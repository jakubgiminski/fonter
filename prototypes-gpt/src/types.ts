export type FontId =
  | "playfair"
  | "lora"
  | "merriweather"
  | "libre"
  | "cormorant"
  | "oswald"
  | "worksans"
  | "sourcesans";

export interface FontDefinition {
  id: FontId;
  label: string;
  stack: string;
}

export type LayoutId = "titleSubtitle" | "titleParagraph" | "quoteAttribution";

export interface ContentFill {
  primary: string;
  secondary: string;
}

export interface TypographyConfig {
  primarySize: number;
  primaryWeight: number;
  primaryLineHeight: number;
  secondarySize: number;
  secondaryWeight: number;
  secondaryLineHeight: number;
  fillIndex: number;
}

export interface LayoutDefinition {
  id: LayoutId;
  label: string;
  hint: string;
  fills: ContentFill[];
  defaults: Omit<TypographyConfig, "fillIndex">;
}

export interface Snapshot {
  id: string;
  savedAt: string;
  layoutId: LayoutId;
  primaryFontId: FontId;
  secondaryFontId: FontId;
  config: TypographyConfig;
}
