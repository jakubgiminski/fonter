export interface FontEntry {
  family: string;
  weights: number[];
  category: "serif" | "sans-serif" | "display" | "handwriting" | "monospace";
}

export const fontPool: FontEntry[] = [
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

const loadedFonts = new Set<string>();

export function loadFont(family: string, weights: number[] = [300, 400, 500, 600, 700]): void {
  const normalizedWeights = [...new Set(weights)].sort((a, b) => a - b);
  const key = `${family}-${normalizedWeights.join(",")}`;
  if (loadedFonts.has(key)) return;
  loadedFonts.add(key);

  const weightsStr = normalizedWeights.join(";");
  const familyStr = encodeURIComponent(family).replace(/%20/g, "+");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${familyStr}:wght@${weightsStr}&display=swap`;
  document.head.appendChild(link);
}

export function getRandomFont(excludeFamily?: string): FontEntry {
  const available = excludeFamily
    ? fontPool.filter((f) => f.family !== excludeFamily)
    : fontPool;
  return available[Math.floor(Math.random() * available.length)];
}

export function getRandomPair(): [FontEntry, FontEntry] {
  const primary = getRandomFont();
  const secondary = getRandomFont(primary.family);
  return [primary, secondary];
}
