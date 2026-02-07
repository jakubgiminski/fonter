import type { FontDefinition, LayoutDefinition, LayoutId, TypographyConfig } from "./types";

export const FONT_OPTIONS: FontDefinition[] = [
  { id: "playfair", label: "Playfair Display", stack: '"Playfair Display", serif' },
  { id: "lora", label: "Lora", stack: '"Lora", serif' },
  { id: "merriweather", label: "Merriweather", stack: '"Merriweather", serif' },
  { id: "libre", label: "Libre Baskerville", stack: '"Libre Baskerville", serif' },
  { id: "cormorant", label: "Cormorant Garamond", stack: '"Cormorant Garamond", serif' },
  { id: "oswald", label: "Oswald", stack: '"Oswald", sans-serif' },
  { id: "worksans", label: "Work Sans", stack: '"Work Sans", sans-serif' },
  { id: "sourcesans", label: '"Source Sans 3"', stack: '"Source Sans 3", sans-serif' }
];

export const LAYOUTS: LayoutDefinition[] = [
  {
    id: "titleSubtitle",
    label: "Title + Subtitle",
    hint: "Big statement and a supporting line.",
    fills: [
      {
        primary: "All happy families are alike; each unhappy family is unhappy in its own way.",
        secondary: "Leo Tolstoy, Anna Karenina"
      },
      {
        primary: "It was the best of times, it was the worst of times.",
        secondary: "Charles Dickens, A Tale of Two Cities"
      },
      {
        primary: "Call me Ishmael.",
        secondary: "Herman Melville, Moby-Dick"
      }
    ],
    defaults: {
      primarySize: 56,
      primaryWeight: 700,
      primaryLineHeight: 1.1,
      secondarySize: 24,
      secondaryWeight: 500,
      secondaryLineHeight: 1.35
    }
  },
  {
    id: "titleParagraph",
    label: "Title + Paragraph",
    hint: "Hero headline with a readable body paragraph.",
    fills: [
      {
        primary: "There was no possibility of taking a walk that day.",
        secondary:
          "The cold winter wind had brought with it clouds so sombre, and a rain so penetrating, that further outdoor exercise was now out of the question."
      },
      {
        primary: "Ships at a distance have every man's wish on board.",
        secondary:
          "For some they come in with the tide. For others they sail forever on the horizon, never out of sight."
      },
      {
        primary: "The sky above the port was the color of television, tuned to a dead channel.",
        secondary:
          "A city can feel both electric and exhausted in one breath, and typography should hold that contradiction with ease."
      }
    ],
    defaults: {
      primarySize: 50,
      primaryWeight: 700,
      primaryLineHeight: 1.12,
      secondarySize: 19,
      secondaryWeight: 400,
      secondaryLineHeight: 1.65
    }
  },
  {
    id: "quoteAttribution",
    label: "Quote + Attribution",
    hint: "Expressive quote paired with an author line.",
    fills: [
      {
        primary: "Whatever our souls are made of, his and mine are the same.",
        secondary: "Emily Bronte, Wuthering Heights"
      },
      {
        primary: "I cannot fix on the hour, or the spot, or the look or the words, which laid the foundation.",
        secondary: "Jane Austen, Pride and Prejudice"
      },
      {
        primary: "The world was hers for the reading.",
        secondary: "Betty Smith, A Tree Grows in Brooklyn"
      }
    ],
    defaults: {
      primarySize: 44,
      primaryWeight: 600,
      primaryLineHeight: 1.28,
      secondarySize: 18,
      secondaryWeight: 500,
      secondaryLineHeight: 1.45
    }
  }
];

export const DEFAULT_LAYOUT = LAYOUTS[0].id;

export const buildInitialConfigs = (): Record<LayoutId, TypographyConfig> =>
  Object.fromEntries(
    LAYOUTS.map((layout) => [
      layout.id,
      {
        ...layout.defaults,
        fillIndex: 0
      }
    ])
  ) as Record<LayoutId, TypographyConfig>;
