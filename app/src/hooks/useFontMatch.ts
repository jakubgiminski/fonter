import { useState, useCallback, useEffect } from "react";
import { getRandomFont, getRandomPair, loadFont, fontPool } from "../data/fonts";
import type { FontEntry } from "../data/fonts";
import { contentSnippets, authorKeys } from "../data/content";
import type { AuthorKey, ContentSnippet } from "../data/content";

export const layoutOptions = ["hero", "brief", "essay", "quote"] as const;
export type LayoutType = (typeof layoutOptions)[number];
export type FontSlot = "primary" | "secondary";
export type LockTarget = FontSlot | null;

export interface FontMatchState {
  primary: FontEntry;
  secondary: FontEntry;
  layout: LayoutType;
  author: AuthorKey;
  content: ContentSnippet;
  locked: LockTarget;
  fonts: FontEntry[];
  shuffle: () => void;
  setLayout: (l: LayoutType) => void;
  setAuthor: (a: AuthorKey) => void;
  toggleLock: (target: FontSlot) => void;
  setPrimary: (family: string) => void;
  setSecondary: (family: string) => void;
}

export function useFontMatch(): FontMatchState {
  const [pair, setPair] = useState<[FontEntry, FontEntry]>(() => getRandomPair());
  const [layout, setLayout] = useState<LayoutType>(layoutOptions[0]);
  const [author, setAuthor] = useState<AuthorKey>(authorKeys[0]);
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

  const toggleLock = useCallback((target: FontSlot) => {
    setLocked((prev) => (prev === target ? null : target));
  }, []);

  const setFont = useCallback((target: FontSlot, family: string) => {
    const font = fontPool.find((entry) => entry.family === family);
    if (!font) return;

    setPair(([prevPrimary, prevSecondary]) =>
      target === "primary" ? [font, prevSecondary] : [prevPrimary, font]
    );
  }, []);

  const setPrimary = useCallback((family: string) => {
    setFont("primary", family);
  }, [setFont]);

  const setSecondary = useCallback((family: string) => {
    setFont("secondary", family);
  }, [setFont]);

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
