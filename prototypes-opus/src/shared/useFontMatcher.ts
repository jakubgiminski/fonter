import { useState, useCallback, useEffect } from "react";
import type { FontPair, LayoutType, LayoutConfig, ContentFillKey, LockState, SavedSnapshot } from "./types";
import { getRandomFont, loadFontPair } from "./fonts";

const DEFAULT_CONFIG: LayoutConfig = {
  primary: { size: 48, weight: 700, lineHeight: 1.2 },
  secondary: { size: 18, weight: 400, lineHeight: 1.6 },
};

export function useFontMatcher() {
  const [fontPair, setFontPair] = useState<FontPair>({
    primary: getRandomFont(),
    secondary: getRandomFont(),
  });
  const [layout, setLayout] = useState<LayoutType>("title-paragraph");
  const [config, setConfig] = useState<LayoutConfig>(DEFAULT_CONFIG);
  const [contentFill, setContentFill] = useState<ContentFillKey>("fill-1");
  const [locks, setLocks] = useState<LockState>({ primary: false, secondary: false });
  const [snapshots, setSnapshots] = useState<SavedSnapshot[]>([]);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    setFontsReady(false);
    loadFontPair(fontPair.primary, fontPair.secondary).then(() => setFontsReady(true));
  }, [fontPair]);

  const shuffle = useCallback(() => {
    setFontPair((prev) => ({
      primary: locks.primary ? prev.primary : getRandomFont(prev.secondary),
      secondary: locks.secondary ? prev.secondary : getRandomFont(prev.primary),
    }));
  }, [locks]);

  const toggleLock = useCallback((which: "primary" | "secondary") => {
    setLocks((prev) => ({ ...prev, [which]: !prev[which] }));
  }, []);

  const updateConfig = useCallback((which: "primary" | "secondary", field: keyof LayoutConfig["primary"], value: number) => {
    setConfig((prev) => ({
      ...prev,
      [which]: { ...prev[which], [field]: value },
    }));
  }, []);

  const saveSnapshot = useCallback(() => {
    const snapshot: SavedSnapshot = {
      id: crypto.randomUUID(),
      fontPair: { ...fontPair },
      layout,
      config: JSON.parse(JSON.stringify(config)),
      timestamp: Date.now(),
    };
    setSnapshots((prev) => [snapshot, ...prev]);
  }, [fontPair, layout, config]);

  const removeSnapshot = useCallback((id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const loadSnapshot = useCallback((snapshot: SavedSnapshot) => {
    setFontPair(snapshot.fontPair);
    setLayout(snapshot.layout);
    setConfig(snapshot.config);
  }, []);

  return {
    fontPair,
    layout,
    setLayout,
    config,
    updateConfig,
    contentFill,
    setContentFill,
    locks,
    toggleLock,
    shuffle,
    snapshots,
    saveSnapshot,
    removeSnapshot,
    loadSnapshot,
    fontsReady,
  };
}
