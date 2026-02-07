import { FONT_OPTIONS } from "../data";
import type { ContentFill, FontId, LayoutId, TypographyConfig } from "../types";

interface PreviewStageProps {
  layoutId: LayoutId;
  content: ContentFill;
  config: TypographyConfig;
  primaryFontId: FontId;
  secondaryFontId: FontId;
}

const fontStack = (fontId: FontId) => FONT_OPTIONS.find((font) => font.id === fontId)?.stack ?? "serif";

export const PreviewStage = ({
  layoutId,
  content,
  config,
  primaryFontId,
  secondaryFontId
}: PreviewStageProps) => {
  const primaryStyles = {
    fontFamily: fontStack(primaryFontId),
    fontSize: `${config.primarySize}px`,
    fontWeight: config.primaryWeight,
    lineHeight: config.primaryLineHeight
  } as const;

  const secondaryStyles = {
    fontFamily: fontStack(secondaryFontId),
    fontSize: `${config.secondarySize}px`,
    fontWeight: config.secondaryWeight,
    lineHeight: config.secondaryLineHeight
  } as const;

  if (layoutId === "titleParagraph") {
    return (
      <section className="preview-stage preview-title-paragraph">
        <h1 style={primaryStyles}>{content.primary}</h1>
        <p style={secondaryStyles}>{content.secondary}</p>
      </section>
    );
  }

  if (layoutId === "quoteAttribution") {
    return (
      <section className="preview-stage preview-quote">
        <blockquote style={primaryStyles}>"{content.primary}"</blockquote>
        <cite style={secondaryStyles}>{content.secondary}</cite>
      </section>
    );
  }

  return (
    <section className="preview-stage preview-title-subtitle">
      <h1 style={primaryStyles}>{content.primary}</h1>
      <h2 style={secondaryStyles}>{content.secondary}</h2>
    </section>
  );
};
