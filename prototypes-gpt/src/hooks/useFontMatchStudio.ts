import { useMemo, useState } from "react";
import { buildInitialConfigs, DEFAULT_LAYOUT, FONT_OPTIONS, LAYOUTS } from "../data";
import type { FontId, LayoutId, Snapshot, TypographyConfig } from "../types";

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

const pickRandomFont = (exclude: FontId[] = []): FontId => {
  const available = FONT_OPTIONS.filter((font) => !exclude.includes(font.id));
  return available[Math.floor(Math.random() * available.length)].id;
};

export const useFontMatchStudio = () => {
  const [activeLayout, setActiveLayout] = useState<LayoutId>(DEFAULT_LAYOUT);
  const [configsByLayout, setConfigsByLayout] = useState<Record<LayoutId, TypographyConfig>>(
    buildInitialConfigs
  );
  const [primaryFontId, setPrimaryFontId] = useState<FontId>(() => pickRandomFont());
  const [secondaryFontId, setSecondaryFontId] = useState<FontId>(() =>
    pickRandomFont([primaryFontId])
  );
  const [lockPrimary, setLockPrimary] = useState(false);
  const [lockSecondary, setLockSecondary] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const activeLayoutDef = useMemo(
    () => LAYOUTS.find((layout) => layout.id === activeLayout) ?? LAYOUTS[0],
    [activeLayout]
  );
  const activeConfig = configsByLayout[activeLayout];
  const activeFill = activeLayoutDef.fills[activeConfig.fillIndex];

  const updateActiveConfig = (patch: Partial<TypographyConfig>) => {
    setConfigsByLayout((prev) => ({
      ...prev,
      [activeLayout]: {
        ...prev[activeLayout],
        ...patch
      }
    }));
  };

  const shuffleFonts = () => {
    if (lockPrimary && lockSecondary) {
      return;
    }

    let nextPrimary = primaryFontId;
    let nextSecondary = secondaryFontId;

    if (!lockPrimary) {
      nextPrimary = pickRandomFont(lockSecondary ? [secondaryFontId] : []);
    }
    if (!lockSecondary) {
      nextSecondary = pickRandomFont([nextPrimary]);
    }
    if (nextPrimary === nextSecondary) {
      nextSecondary = pickRandomFont([nextPrimary]);
    }

    setPrimaryFontId(nextPrimary);
    setSecondaryFontId(nextSecondary);
  };

  const saveSnapshot = () => {
    const snapshot: Snapshot = {
      id: randomId(),
      savedAt: new Date().toISOString(),
      layoutId: activeLayout,
      primaryFontId,
      secondaryFontId,
      config: { ...activeConfig }
    };
    setSnapshots((prev) => [snapshot, ...prev].slice(0, 14));
  };

  const loadSnapshot = (snapshot: Snapshot) => {
    setActiveLayout(snapshot.layoutId);
    setPrimaryFontId(snapshot.primaryFontId);
    setSecondaryFontId(snapshot.secondaryFontId);
    setConfigsByLayout((prev) => ({
      ...prev,
      [snapshot.layoutId]: { ...snapshot.config }
    }));
  };

  return {
    activeLayout,
    activeLayoutDef,
    activeConfig,
    activeFill,
    primaryFontId,
    secondaryFontId,
    lockPrimary,
    lockSecondary,
    snapshots,
    setActiveLayout,
    updateActiveConfig,
    setLockPrimary,
    setLockSecondary,
    shuffleFonts,
    saveSnapshot,
    loadSnapshot
  };
};
