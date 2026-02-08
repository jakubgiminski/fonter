import type { CSSProperties } from "react";
import { authorKeys, type AuthorKey, type ContentSnippet } from "../data/content";
import type { FontEntry } from "../data/fonts";
import { layoutOptions, type LayoutType, useFontMatch } from "../hooks/useFontMatch";
import "./fontMatch.css";

const layoutLabels: Record<LayoutType, string> = {
  hero: "Hero",
  brief: "Brief",
  essay: "Essay",
  quote: "Quote",
};

const lockPaths = {
  locked:
    "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2z",
  unlocked:
    "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z",
} as const;

interface FontSelectProps {
  ariaLabel: string;
  fonts: FontEntry[];
  value: string;
  onChange: (family: string) => void;
}

function FontSelect({ ariaLabel, fonts, value, onChange }: FontSelectProps) {
  return (
    <select className="font-match-select" aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)}>
      {fonts.map((font) => (
        <option key={font.family} value={font.family}>
          {font.family}
        </option>
      ))}
    </select>
  );
}

interface LockButtonProps {
  locked: boolean;
  ariaLabel: string;
  onClick: () => void;
}

function LockButton({ locked, ariaLabel, onClick }: LockButtonProps) {
  return (
    <button
      type="button"
      className={`font-match-lock${locked ? " locked" : ""}`}
      aria-label={ariaLabel}
      aria-pressed={locked}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={locked ? lockPaths.locked : lockPaths.unlocked} />
      </svg>
    </button>
  );
}

interface OptionPillsProps<T extends string> {
  options: readonly T[];
  active: T;
  onSelect: (value: T) => void;
  labels?: Partial<Record<T, string>>;
}

function OptionPills<T extends string>({ options, active, onSelect, labels }: OptionPillsProps<T>) {
  return (
    <div className="font-match-pill-group">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`font-match-pill${active === option ? " active" : ""}`}
          aria-pressed={active === option}
          onClick={() => onSelect(option)}
        >
          {labels?.[option] ?? option}
        </button>
      ))}
    </div>
  );
}

function quoteFromParagraph(paragraph: string): string {
  const sentence = paragraph.split(". ")[0]?.trim();
  if (!sentence) return paragraph;
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
}

function LayoutPreview({ layout, content }: { layout: LayoutType; content: ContentSnippet }) {
  if (layout === "hero") {
    return (
      <div className="preview-layout preview-hero">
        <h1 className="preview-primary preview-hero-title">{content.title}</h1>
        <p className="preview-secondary preview-hero-subtitle">{content.subtitle}</p>
      </div>
    );
  }

  if (layout === "brief") {
    return (
      <div className="preview-layout preview-reading">
        <h1 className="preview-primary preview-brief-title">{content.title}</h1>
        <h2 className="preview-primary preview-brief-subtitle">{content.subtitle}</h2>
        <p className="preview-secondary preview-body-text">{content.paragraph1}</p>
      </div>
    );
  }

  if (layout === "essay") {
    return (
      <div className="preview-layout preview-reading">
        <h1 className="preview-primary preview-essay-title">{content.title}</h1>
        <p className="preview-secondary preview-body-text paragraph-spacing">{content.paragraph1}</p>
        <p className="preview-secondary preview-body-text">{content.paragraph2}</p>
      </div>
    );
  }

  return (
    <div className="preview-layout preview-quote">
      <p className="preview-secondary preview-quote-text">{quoteFromParagraph(content.paragraph1)}</p>
      <p className="preview-primary preview-quote-attr">- {content.subtitle}</p>
    </div>
  );
}

function FontMatch() {
  const {
    primary,
    secondary,
    layout,
    author,
    content,
    locked,
    fonts,
    shuffle,
    setLayout,
    setAuthor,
    toggleLock,
    setPrimary,
    setSecondary,
  } = useFontMatch();

  const fontVariables = {
    "--primary-font": `"${primary.family}", ${primary.category}`,
    "--secondary-font": `"${secondary.family}", ${secondary.category}`,
  } as CSSProperties;

  return (
    <div className="font-match-root" style={fontVariables}>
      <div className="font-match-center">
        <div className="font-match-page">
          <LayoutPreview layout={layout} content={content} />
        </div>

        <div className="font-match-controls-wrap">
          <div className="font-match-controls">
            <div className="font-match-font-row">
              <FontSelect ariaLabel="Primary font" fonts={fonts} value={primary.family} onChange={setPrimary} />
              <LockButton
                locked={locked === "primary"}
                ariaLabel="Lock primary font"
                onClick={() => toggleLock("primary")}
              />
              <button type="button" className="font-match-shuffle" onClick={shuffle}>
                Shuffle Fonts
              </button>
              <LockButton
                locked={locked === "secondary"}
                ariaLabel="Lock secondary font"
                onClick={() => toggleLock("secondary")}
              />
              <FontSelect ariaLabel="Secondary font" fonts={fonts} value={secondary.family} onChange={setSecondary} />
            </div>

            <div className="font-match-divider-horizontal" />

            <div className="font-match-bottom-row">
              <OptionPills options={layoutOptions} active={layout} onSelect={setLayout} labels={layoutLabels} />
              <div className="font-match-divider-vertical" />
              <OptionPills<AuthorKey> options={authorKeys} active={author} onSelect={setAuthor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FontMatch;
