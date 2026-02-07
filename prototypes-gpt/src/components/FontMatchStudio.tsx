import { PreviewStage } from "./PreviewStage";
import { StudioControls } from "./StudioControls";
import { useFontMatchStudio } from "../hooks/useFontMatchStudio";
import type { LayoutId } from "../types";

type StudioVariant =
  | "editorial"
  | "neon"
  | "paper"
  | "bauhaus"
  | "terminal";

interface FontMatchStudioProps {
  variant: StudioVariant;
  heading: string;
  subheading: string;
}

export const FontMatchStudio = ({ variant, heading, subheading }: FontMatchStudioProps) => {
  const studio = useFontMatchStudio();
  const sceneClass = `studio-scene variant-${variant}`;

  const controls = (
    <StudioControls
      activeLayout={studio.activeLayout}
      activeFillIndex={studio.activeConfig.fillIndex}
      primaryFontId={studio.primaryFontId}
      secondaryFontId={studio.secondaryFontId}
      lockPrimary={studio.lockPrimary}
      lockSecondary={studio.lockSecondary}
      snapshots={studio.snapshots}
      onLayoutChange={(layoutId: LayoutId) => studio.setActiveLayout(layoutId)}
      onFillChange={(index) => studio.updateActiveConfig({ fillIndex: index })}
      onPrimarySizeChange={(value) => studio.updateActiveConfig({ primarySize: value })}
      onPrimaryWeightChange={(value) => studio.updateActiveConfig({ primaryWeight: value })}
      onPrimaryLineHeightChange={(value) => studio.updateActiveConfig({ primaryLineHeight: value })}
      onSecondarySizeChange={(value) => studio.updateActiveConfig({ secondarySize: value })}
      onSecondaryWeightChange={(value) => studio.updateActiveConfig({ secondaryWeight: value })}
      onSecondaryLineHeightChange={(value) => studio.updateActiveConfig({ secondaryLineHeight: value })}
      onTogglePrimaryLock={() => studio.setLockPrimary((prev) => !prev)}
      onToggleSecondaryLock={() => studio.setLockSecondary((prev) => !prev)}
      onShuffle={studio.shuffleFonts}
      onSaveSnapshot={studio.saveSnapshot}
      onLoadSnapshot={studio.loadSnapshot}
      primarySize={studio.activeConfig.primarySize}
      primaryWeight={studio.activeConfig.primaryWeight}
      primaryLineHeight={studio.activeConfig.primaryLineHeight}
      secondarySize={studio.activeConfig.secondarySize}
      secondaryWeight={studio.activeConfig.secondaryWeight}
      secondaryLineHeight={studio.activeConfig.secondaryLineHeight}
    />
  );

  const preview = (
    <div className="preview-shell">
      <header className="studio-header">
        <p>{heading}</p>
        <small>{subheading}</small>
      </header>
      <PreviewStage
        layoutId={studio.activeLayout}
        content={studio.activeFill}
        config={studio.activeConfig}
        primaryFontId={studio.primaryFontId}
        secondaryFontId={studio.secondaryFontId}
      />
    </div>
  );

  if (variant === "neon") {
    return (
      <main className={sceneClass}>
        <section className="neon-hero">{preview}</section>
        {controls}
      </main>
    );
  }

  if (variant === "paper") {
    return (
      <main className={sceneClass}>
        <section className="paper-board">
          {controls}
          {preview}
        </section>
      </main>
    );
  }

  if (variant === "bauhaus") {
    return (
      <main className={sceneClass}>
        <section className="bauhaus-grid">
          {preview}
          {controls}
        </section>
      </main>
    );
  }

  if (variant === "terminal") {
    return (
      <main className={sceneClass}>
        {controls}
        <section className="terminal-surface">{preview}</section>
      </main>
    );
  }

  return (
    <main className={sceneClass}>
      {controls}
      {preview}
    </main>
  );
};
