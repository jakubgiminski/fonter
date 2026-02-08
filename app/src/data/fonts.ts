export type FontCategory = "serif" | "sans-serif" | "display" | "handwriting" | "monospace";

export interface FontEntry {
  family: string;
  weights: number[];
  category: FontCategory;
}

const FALLBACK_FONT_POOL: FontEntry[] = [
  { family: "Playfair Display", weights: [400, 500, 700, 900], category: "serif" },
  { family: "Cormorant Garamond", weights: [300, 400, 500, 600, 700], category: "serif" },
  { family: "Libre Baskerville", weights: [400, 700], category: "serif" },
  { family: "DM Serif Display", weights: [400], category: "serif" },
  { family: "Lora", weights: [400, 500, 600, 700], category: "serif" },
  { family: "Source Serif 4", weights: [300, 400, 600, 700], category: "serif" },
  { family: "Bitter", weights: [300, 400, 500, 700], category: "serif" },
  { family: "Crimson Text", weights: [400, 600, 700], category: "serif" },
  { family: "DM Sans", weights: [300, 400, 500, 700], category: "sans-serif" },
  { family: "Work Sans", weights: [300, 400, 500, 600, 700], category: "sans-serif" },
  { family: "Outfit", weights: [300, 400, 500, 600, 700], category: "sans-serif" },
  { family: "Sora", weights: [300, 400, 500, 600, 700], category: "sans-serif" },
  { family: "Manrope", weights: [300, 400, 500, 600, 700, 800], category: "sans-serif" },
  { family: "Public Sans", weights: [300, 400, 500, 600, 700], category: "sans-serif" },
  { family: "Bricolage Grotesque", weights: [400, 500, 600, 700, 800], category: "sans-serif" },
  { family: "Instrument Serif", weights: [400], category: "serif" },
  { family: "Fraunces", weights: [300, 400, 500, 700, 900], category: "serif" },
  { family: "Newsreader", weights: [300, 400, 500, 600, 700], category: "serif" },
  { family: "Alegreya", weights: [400, 500, 700, 900], category: "serif" },
  { family: "Chivo", weights: [300, 400, 500, 700, 900], category: "sans-serif" },
  { family: "Archivo", weights: [300, 400, 500, 600, 700, 900], category: "sans-serif" },
  { family: "Plus Jakarta Sans", weights: [300, 400, 500, 600, 700, 800], category: "sans-serif" },
  { family: "Literata", weights: [300, 400, 500, 700], category: "serif" },
  { family: "Space Mono", weights: [400, 700], category: "monospace" },
];

export const defaultFontPool = FALLBACK_FONT_POOL;

const DEFAULT_GOOGLE_FONT_CATALOG_URL = "/api/google-fonts-metadata";
const GOOGLE_FONT_CACHE_KEY = "font-match-google-font-catalog-v1";
const GOOGLE_FONT_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const TARGET_RENDER_WEIGHTS = [300, 400, 700];
const CONFIGURED_GOOGLE_FONT_CATALOG_URL = import.meta.env.VITE_GOOGLE_FONTS_METADATA_URL?.trim();
const GOOGLE_FONT_CATALOG_URLS = [
  CONFIGURED_GOOGLE_FONT_CATALOG_URL,
  DEFAULT_GOOGLE_FONT_CATALOG_URL,
].filter((value): value is string => Boolean(value));

interface GoogleFontAxis {
  tag?: string;
  start?: number;
  end?: number;
}

interface GoogleFontMetadataItem {
  family?: string;
  category?: string;
  fonts?: Record<string, unknown>;
  axes?: GoogleFontAxis[];
}

interface GoogleFontMetadataResponse {
  familyMetadataList?: GoogleFontMetadataItem[];
}

interface CachedCatalog {
  timestamp: number;
  fonts: FontEntry[];
}

interface IndexedCycle<T> {
  order: T[];
  index: number;
}

export interface PairEngine {
  getFontByFamily: (family: string) => FontEntry | undefined;
  nextUnlockedPair: () => [FontEntry, FontEntry];
  nextSecondaryForPrimary: (primaryFamily: string, excludeSecondaryFamily?: string) => FontEntry | null;
  nextPrimaryForSecondary: (secondaryFamily: string, excludePrimaryFamily?: string) => FontEntry | null;
}

const fontLoadPromises = new Map<string, Promise<void>>();
let catalogPromise: Promise<FontEntry[]> | null = null;
let preconnectInitialized = false;

function normalizeWeights(weights: number[]): number[] {
  return [...new Set(weights)]
    .filter((weight) => Number.isFinite(weight))
    .map((weight) => Math.round(weight))
    .filter((weight) => weight >= 100 && weight <= 900)
    .sort((a, b) => a - b);
}

function mapGoogleCategory(value: string | undefined): FontCategory {
  const normalized = value?.toLowerCase().trim();

  if (normalized === "serif") return "serif";
  if (normalized === "display") return "display";
  if (normalized === "handwriting") return "handwriting";
  if (normalized === "monospace") return "monospace";
  return "sans-serif";
}

function extractWeights(item: GoogleFontMetadataItem): number[] {
  const fromFontsObject = normalizeWeights(
    Object.keys(item.fonts ?? {})
      .map((key) => Number.parseInt(key, 10))
      .filter((weight) => Number.isFinite(weight))
  );

  if (fromFontsObject.length > 0) {
    return fromFontsObject;
  }

  const weightAxis = item.axes?.find((axis) => axis.tag === "wght");
  if (weightAxis?.start && weightAxis?.end) {
    const start = Math.max(100, Math.ceil(weightAxis.start / 100) * 100);
    const end = Math.min(900, Math.floor(weightAxis.end / 100) * 100);
    const stepped: number[] = [];
    for (let value = start; value <= end; value += 100) {
      stepped.push(value);
    }
    if (stepped.length > 0) {
      return stepped;
    }
  }

  return [400, 700];
}

function pickClosestWeights(availableWeights: number[], requestedWeights: number[]): number[] {
  if (availableWeights.length === 0) return [400, 700];

  const selected = requestedWeights.map((requested) => {
    return availableWeights.reduce((best, candidate) => {
      const candidateDistance = Math.abs(candidate - requested);
      const bestDistance = Math.abs(best - requested);
      return candidateDistance < bestDistance ? candidate : best;
    }, availableWeights[0]);
  });

  return normalizeWeights(selected);
}

function toGoogleFontsUrl(family: string, availableWeights: number[]): string {
  const optimizedWeights = pickClosestWeights(normalizeWeights(availableWeights), TARGET_RENDER_WEIGHTS);
  const weightsStr = optimizedWeights.join(";");
  const familyStr = encodeURIComponent(family).replace(/%20/g, "+");
  return `https://fonts.googleapis.com/css2?family=${familyStr}:wght@${weightsStr}&display=swap`;
}

function ensureFontPreconnect(): void {
  if (preconnectInitialized) return;
  preconnectInitialized = true;

  const preconnectUrls = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];
  for (const href of preconnectUrls) {
    const existing = document.head.querySelector(`link[rel="preconnect"][href="${href}"]`);
    if (existing) continue;

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    if (href.includes("gstatic")) {
      link.crossOrigin = "";
    }
    document.head.appendChild(link);
  }
}

function toCatalogItem(raw: GoogleFontMetadataItem): FontEntry | null {
  if (!raw.family || typeof raw.family !== "string") return null;
  const family = raw.family.trim();
  if (!family) return null;

  return {
    family,
    category: mapGoogleCategory(raw.category),
    weights: extractWeights(raw),
  };
}

function getCachedCatalog(): FontEntry[] | null {
  try {
    const raw = localStorage.getItem(GOOGLE_FONT_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedCatalog;
    if (!parsed || !Array.isArray(parsed.fonts)) return null;
    if (typeof parsed.timestamp !== "number") return null;
    if (Date.now() - parsed.timestamp > GOOGLE_FONT_CACHE_TTL_MS) return null;

    const validFonts = parsed.fonts
      .map((font) => {
        if (!font || typeof font.family !== "string" || !Array.isArray(font.weights)) return null;
        return {
          family: font.family,
          weights: normalizeWeights(font.weights),
          category: mapGoogleCategory(font.category),
        } satisfies FontEntry;
      })
      .filter((font): font is FontEntry => Boolean(font));

    return validFonts.length > 1 ? validFonts : null;
  } catch {
    return null;
  }
}

function cacheCatalog(fonts: FontEntry[]): void {
  try {
    const payload: CachedCatalog = {
      timestamp: Date.now(),
      fonts,
    };
    localStorage.setItem(GOOGLE_FONT_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore localStorage write failures.
  }
}

async function fetchGoogleFontCatalog(): Promise<FontEntry[] | null> {
  for (const url of GOOGLE_FONT_CATALOG_URLS) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json,text/plain,*/*",
        },
      });

      if (!response.ok) {
        continue;
      }

      const text = await response.text();
      const jsonStart = text.indexOf("{");
      if (jsonStart < 0) {
        continue;
      }

      const parsed = JSON.parse(text.slice(jsonStart)) as GoogleFontMetadataResponse;
      const familyMetadata = parsed.familyMetadataList;
      if (!Array.isArray(familyMetadata)) {
        continue;
      }

      const mapped = familyMetadata
        .map(toCatalogItem)
        .filter((font): font is FontEntry => Boolean(font));

      if (mapped.length > 1) {
        return mapped;
      }
    } catch {
      // Try next metadata source.
    }
  }

  throw new Error("Unable to fetch Google Fonts metadata from configured sources");
}

export async function getFontPool(): Promise<FontEntry[]> {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      const fromCache = getCachedCatalog();
      if (fromCache) return fromCache;

      try {
        const fromNetwork = await fetchGoogleFontCatalog();
        if (fromNetwork) {
          cacheCatalog(fromNetwork);
          return fromNetwork;
        }
      } catch {
        // Fall through to local fallback pool.
      }

      return FALLBACK_FONT_POOL;
    })();
  }

  return catalogPromise;
}

export function loadFont(family: string, availableWeights: number[] = [300, 400, 500, 600, 700]): Promise<void> {
  ensureFontPreconnect();

  const href = toGoogleFontsUrl(family, availableWeights);
  const key = `${family}::${href}`;
  const existing = fontLoadPromises.get(key);
  if (existing) return existing;

  const loadPromise = new Promise<void>((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });

  fontLoadPromises.set(key, loadPromise);
  return loadPromise;
}

function shuffleArray<T>(items: T[]): T[] {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function buildUnlockedCycle(fonts: FontEntry[]): { primaries: FontEntry[]; secondaries: FontEntry[] } {
  const primaries = shuffleArray(fonts);
  let secondaries = shuffleArray(fonts);

  const hasCollisions = () =>
    primaries.some((primary, index) => primary.family === secondaries[index].family);

  let attempts = 0;
  while (hasCollisions() && attempts < 16) {
    secondaries = shuffleArray(fonts);
    attempts += 1;
  }

  if (hasCollisions() && primaries.length > 1) {
    secondaries = [...primaries.slice(1), primaries[0]];
  }

  return { primaries, secondaries };
}

function buildLockedCycle(fonts: FontEntry[], excludedFamily: string): FontEntry[] {
  return shuffleArray(fonts.filter((font) => font.family !== excludedFamily));
}

export function createPairEngine(fonts: FontEntry[]): PairEngine {
  const fontMap = new Map(fonts.map((font) => [font.family, font]));

  let unlockedCycle: IndexedCycle<[FontEntry, FontEntry]> | null = null;
  const secondaryByPrimaryCycles = new Map<string, IndexedCycle<FontEntry>>();
  const primaryBySecondaryCycles = new Map<string, IndexedCycle<FontEntry>>();

  const refreshUnlockedCycle = () => {
    const { primaries, secondaries } = buildUnlockedCycle(fonts);
    const pairOrder = primaries.map(
      (primary, index) => [primary, secondaries[index]] satisfies [FontEntry, FontEntry]
    );
    unlockedCycle = {
      order: pairOrder,
      index: 0,
    };
  };

  const getUnlockedPair = (): [FontEntry, FontEntry] => {
    if (fonts.length < 2) {
      throw new Error("At least two fonts are required to build a pair");
    }

    if (!unlockedCycle || unlockedCycle.index >= unlockedCycle.order.length) {
      refreshUnlockedCycle();
    }

    const cycle = unlockedCycle;
    if (!cycle) {
      throw new Error("Unable to initialize the unlocked pair cycle");
    }

    const pair = cycle.order[cycle.index];
    cycle.index += 1;
    return pair;
  };

  const getNextFromCycle = (cycle: IndexedCycle<FontEntry>, excludedFamily?: string): FontEntry | null => {
    if (cycle.order.length === 0) return null;

    const maxAttempts = cycle.order.length;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const next = cycle.order[cycle.index];
      cycle.index += 1;
      if (!excludedFamily || next.family !== excludedFamily) {
        return next;
      }

      if (cycle.index >= cycle.order.length) {
        break;
      }
    }

    return null;
  };

  const nextSecondary = (primaryFamily: string, excludeSecondaryFamily?: string): FontEntry | null => {
    if (fonts.length < 2) return null;
    if (!fontMap.has(primaryFamily)) return null;

    const existing = secondaryByPrimaryCycles.get(primaryFamily);
    if (!existing || existing.index >= existing.order.length) {
      secondaryByPrimaryCycles.set(primaryFamily, {
        order: buildLockedCycle(fonts, primaryFamily),
        index: 0,
      });
    }

    const cycle = secondaryByPrimaryCycles.get(primaryFamily);
    if (!cycle || cycle.order.length === 0) return null;

    const next = getNextFromCycle(cycle, excludeSecondaryFamily);
    if (next) return next;

    secondaryByPrimaryCycles.set(primaryFamily, {
      order: buildLockedCycle(fonts, primaryFamily),
      index: 0,
    });
    const refreshed = secondaryByPrimaryCycles.get(primaryFamily);
    if (!refreshed) return null;
    return getNextFromCycle(refreshed, excludeSecondaryFamily);
  };

  const nextPrimary = (secondaryFamily: string, excludePrimaryFamily?: string): FontEntry | null => {
    if (fonts.length < 2) return null;
    if (!fontMap.has(secondaryFamily)) return null;

    const existing = primaryBySecondaryCycles.get(secondaryFamily);
    if (!existing || existing.index >= existing.order.length) {
      primaryBySecondaryCycles.set(secondaryFamily, {
        order: buildLockedCycle(fonts, secondaryFamily),
        index: 0,
      });
    }

    const cycle = primaryBySecondaryCycles.get(secondaryFamily);
    if (!cycle || cycle.order.length === 0) return null;

    const next = getNextFromCycle(cycle, excludePrimaryFamily);
    if (next) return next;

    primaryBySecondaryCycles.set(secondaryFamily, {
      order: buildLockedCycle(fonts, secondaryFamily),
      index: 0,
    });
    const refreshed = primaryBySecondaryCycles.get(secondaryFamily);
    if (!refreshed) return null;
    return getNextFromCycle(refreshed, excludePrimaryFamily);
  };

  return {
    getFontByFamily: (family: string) => fontMap.get(family),
    nextUnlockedPair: getUnlockedPair,
    nextSecondaryForPrimary: nextSecondary,
    nextPrimaryForSecondary: nextPrimary,
  };
}
