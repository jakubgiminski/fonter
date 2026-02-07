export interface FontConfig {
  size: number;
  weight: number;
  lineHeight: number;
}

export interface LayoutConfig {
  primary: FontConfig;
  secondary: FontConfig;
}

export interface FontPair {
  primary: string;
  secondary: string;
}

export interface SavedSnapshot {
  id: string;
  fontPair: FontPair;
  layout: LayoutType;
  config: LayoutConfig;
  timestamp: number;
}

export type LayoutType = "title-subtitle" | "title-paragraph" | "hero-card" | "editorial" | "split-screen";

export type ContentFillKey = "fill-1" | "fill-2" | "fill-3";

export interface LockState {
  primary: boolean;
  secondary: boolean;
}
