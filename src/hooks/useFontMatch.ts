import { useState, useCallback, useEffect, useRef } from "react";
import {
  createPairEngine,
  defaultFontPool,
  getFontPool,
  loadFont,
  type FontEntry,
  type PairEngine,
} from "../data/fonts";
import { contentSnippets, authorKeys } from "../data/content";
import type { AuthorKey, ContentSnippet } from "../data/content";

export const layoutOptions = ["hero", "brief", "essay", "quote"] as const;
export type LayoutType = (typeof layoutOptions)[number];
export type FontSlot = "primary" | "secondary";
export type LockTarget = FontSlot | null;

type FontPair = [FontEntry, FontEntry];

interface PrefetchedPair {
  contextKey: string;
  pair: FontPair;
  ready: Promise<void>;
}

export interface FontMatchState {
  primary: FontEntry;
  secondary: FontEntry;
  layout: LayoutType;
  author: AuthorKey;
  content: ContentSnippet;
  locked: LockTarget;
  fonts: FontEntry[];
  isCatalogLoading: boolean;
  isPairUpdating: boolean;
  shuffle: () => Promise<void>;
  setLayout: (l: LayoutType) => void;
  setAuthor: (a: AuthorKey) => void;
  toggleLock: (target: FontSlot) => void;
  setPrimary: (family: string) => void;
  setSecondary: (family: string) => void;
}

function isSamePair(first: FontPair, second: FontPair): boolean {
  return first[0].family === second[0].family && first[1].family === second[1].family;
}

function getContextKey(locked: LockTarget, pair: FontPair): string {
  if (locked === "primary") {
    return `lock-primary:${pair[0].family}`;
  }

  if (locked === "secondary") {
    return `lock-secondary:${pair[1].family}`;
  }

  return "unlocked";
}

export function useFontMatch(): FontMatchState {
  const engineRef = useRef<PairEngine>(createPairEngine(defaultFontPool));

  const [pair, setPair] = useState<FontPair>(() => engineRef.current.nextUnlockedPair());
  const [layout, setLayout] = useState<LayoutType>(layoutOptions[0]);
  const [author, setAuthor] = useState<AuthorKey>(authorKeys[0]);
  const [locked, setLocked] = useState<LockTarget>(null);
  const [fonts, setFonts] = useState<FontEntry[]>(defaultFontPool);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isPairUpdating, setIsPairUpdating] = useState(false);

  const [primary, secondary] = pair;

  const mountedRef = useRef(false);
  const updateInFlightRef = useRef(false);
  const pairRef = useRef<FontPair>(pair);
  const lockedRef = useRef<LockTarget>(locked);
  const prefetchedRef = useRef<PrefetchedPair | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    pairRef.current = pair;
  }, [pair]);

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  const loadPair = useCallback(async ([nextPrimary, nextSecondary]: FontPair) => {
    await Promise.all([
      loadFont(nextPrimary.family, nextPrimary.weights),
      loadFont(nextSecondary.family, nextSecondary.weights),
    ]);
  }, []);

  const nextPairForContext = useCallback((activeLock: LockTarget, activePair: FontPair): FontPair | null => {
    if (activeLock === "primary") {
      const nextSecondary = engineRef.current.nextSecondaryForPrimary(activePair[0].family, activePair[1].family);
      return nextSecondary ? [activePair[0], nextSecondary] : null;
    }

    if (activeLock === "secondary") {
      const nextPrimary = engineRef.current.nextPrimaryForSecondary(activePair[1].family, activePair[0].family);
      return nextPrimary ? [nextPrimary, activePair[1]] : null;
    }

    try {
      return engineRef.current.nextUnlockedPair();
    } catch {
      return null;
    }
  }, []);

  const primeNextPair = useCallback(() => {
    const activePair = pairRef.current;
    const activeLock = lockedRef.current;
    const contextKey = getContextKey(activeLock, activePair);

    const existingPrefetch = prefetchedRef.current;
    if (existingPrefetch && existingPrefetch.contextKey === contextKey && !isSamePair(existingPrefetch.pair, activePair)) {
      return;
    }

    const nextPair = nextPairForContext(activeLock, activePair);
    if (!nextPair || isSamePair(nextPair, activePair)) {
      prefetchedRef.current = null;
      return;
    }

    prefetchedRef.current = {
      contextKey,
      pair: nextPair,
      ready: loadPair(nextPair),
    };
  }, [loadPair, nextPairForContext]);

  const applyPair = useCallback(
    async (nextPair: FontPair) => {
      await loadPair(nextPair);
      if (!mountedRef.current) return;

      pairRef.current = nextPair;
      setPair(nextPair);
    },
    [loadPair]
  );

  useEffect(() => {
    void (async () => {
      try {
        const fetchedFonts = await getFontPool();
        if (!mountedRef.current || fetchedFonts.length < 2) {
          return;
        }

        const nextEngine = createPairEngine(fetchedFonts);
        const nextPair = nextEngine.nextUnlockedPair();

        await loadPair(nextPair);
        if (!mountedRef.current) {
          return;
        }

        engineRef.current = nextEngine;
        setFonts(fetchedFonts);
        pairRef.current = nextPair;
        setPair(nextPair);
        prefetchedRef.current = null;
      } finally {
        if (mountedRef.current) {
          setIsCatalogLoading(false);
        }
      }
    })();
  }, [loadPair]);

  useEffect(() => {
    primeNextPair();
  }, [pair, locked, primeNextPair]);

  const shuffle = useCallback(async () => {
    if (updateInFlightRef.current) return;

    updateInFlightRef.current = true;
    setIsPairUpdating(true);
    try {
      const activePair = pairRef.current;
      const activeLock = lockedRef.current;
      const contextKey = getContextKey(activeLock, activePair);

      const prefetched = prefetchedRef.current;
      let nextPair: FontPair | null = null;

      if (prefetched && prefetched.contextKey === contextKey) {
        await prefetched.ready;
        nextPair = prefetched.pair;
        prefetchedRef.current = null;
      } else {
        nextPair = nextPairForContext(activeLock, activePair);
        if (nextPair) {
          await loadPair(nextPair);
        }
      }

      if (nextPair && !isSamePair(nextPair, activePair) && mountedRef.current) {
        pairRef.current = nextPair;
        setPair(nextPair);
      }
    } finally {
      updateInFlightRef.current = false;
      if (mountedRef.current) {
        setIsPairUpdating(false);
      }
      primeNextPair();
    }
  }, [loadPair, nextPairForContext, primeNextPair]);

  const toggleLock = useCallback((target: FontSlot) => {
    setLocked((prev) => (prev === target ? null : target));
  }, []);

  const setFont = useCallback(
    (target: FontSlot, family: string) => {
      if (updateInFlightRef.current) return;

      const selectedFont = engineRef.current.getFontByFamily(family);
      if (!selectedFont) return;

      const [currentPrimary, currentSecondary] = pairRef.current;
      const nextPair: FontPair =
        target === "primary" ? [selectedFont, currentSecondary] : [currentPrimary, selectedFont];

      if (nextPair[0].family === nextPair[1].family || isSamePair(nextPair, pairRef.current)) {
        return;
      }

      updateInFlightRef.current = true;
      setIsPairUpdating(true);
      prefetchedRef.current = null;

      void (async () => {
        try {
          await applyPair(nextPair);
        } finally {
          updateInFlightRef.current = false;
          if (mountedRef.current) {
            setIsPairUpdating(false);
          }
          primeNextPair();
        }
      })();
    },
    [applyPair, primeNextPair]
  );

  const setPrimary = useCallback(
    (family: string) => {
      setFont("primary", family);
    },
    [setFont]
  );

  const setSecondary = useCallback(
    (family: string) => {
      setFont("secondary", family);
    },
    [setFont]
  );

  return {
    primary,
    secondary,
    layout,
    author,
    content: contentSnippets[author],
    locked,
    fonts,
    isCatalogLoading,
    isPairUpdating,
    shuffle,
    setLayout,
    setAuthor,
    toggleLock,
    setPrimary,
    setSecondary,
  };
}
