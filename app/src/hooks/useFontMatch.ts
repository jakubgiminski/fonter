import { useState, useCallback, useEffect } from "react";
import { getRandomFont, getRandomPair, loadFont, fontPool } from "../data/fonts";
import type { FontEntry } from "../data/fonts";
import { contentSnippets, authorKeys } from "../data/content";
import type { ContentSnippet } from "../data/content";

export type LayoutType = "hero" | "brief" | "essay" | "quote";
export type LockTarget = "primary" | "secondary" | null;

export interface FontMatchState {
  primary: FontEntry;
  secondary: FontEntry;
  layout: LayoutType;
  author: string;
  content: ContentSnippet;
  locked: LockTarget;
  fonts: FontEntry[];
  shuffle: () => void;
  setLayout: (l: LayoutType) => void;
  setAuthor: (a: string) => void;
  toggleLock: (target: "primary" | "secondary") => void;
  setPrimary: (family: string) => void;
  setSecondary: (family: string) => void;
}

export function useFontMatch(): FontMatchState {
  const [pair, setPair] = useState<[FontEntry, FontEntry]>(() => getRandomPair());
  const [layout, setLayout] = useState<LayoutType>("hero");
  const [author, setAuthor] = useState<string>(authorKeys[0]);
  const [locked, setLocked] = useState<LockTarget>(null);

  const [primary, secondary] = pair;

  useEffect(() => {
    loadFont(primary.family, primary.weights);
    loadFont(secondary.family, secondary.weights);
  }, [primary, secondary]);

  const shuffle = useCallback(() => {
    setPair(([prev1, prev2]) => {
      if (locked === "primary") {
        return [prev1, getRandomFont(prev1.family)];
      }
      if (locked === "secondary") {
        return [getRandomFont(prev2.family), prev2];
      }
      return getRandomPair();
    });
  }, [locked]);

  const toggleLock = useCallback((target: "primary" | "secondary") => {
    setLocked((prev) => (prev === target ? null : target));
  }, []);

  const setPrimary = useCallback((family: string) => {
    const font = fontPool.find((f) => f.family === family);
    if (!font) return;
    setPair(([, prev2]) => [font, prev2]);
  }, []);

  const setSecondary = useCallback((family: string) => {
    const font = fontPool.find((f) => f.family === family);
    if (!font) return;
    setPair(([prev1]) => [prev1, font]);
  }, []);

  return {
    primary,
    secondary,
    layout,
    author,
    content: contentSnippets[author],
    locked,
    fonts: fontPool,
    shuffle,
    setLayout,
    setAuthor,
    toggleLock,
    setPrimary,
    setSecondary,
  };
}
