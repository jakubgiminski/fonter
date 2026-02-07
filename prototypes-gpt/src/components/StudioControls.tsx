import { FONT_OPTIONS, LAYOUTS } from "../data";
import type { FontId, LayoutId, Snapshot } from "../types";

interface StudioControlsProps {
  activeLayout: LayoutId;
  activeFillIndex: number;
  primaryFontId: FontId;
  secondaryFontId: FontId;
  lockPrimary: boolean;
  lockSecondary: boolean;
  snapshots: Snapshot[];
  onLayoutChange: (layoutId: LayoutId) => void;
  onFillChange: (fillIndex: number) => void;
  onPrimarySizeChange: (value: number) => void;
  onPrimaryWeightChange: (value: number) => void;
  onPrimaryLineHeightChange: (value: number) => void;
  onSecondarySizeChange: (value: number) => void;
  onSecondaryWeightChange: (value: number) => void;
  onSecondaryLineHeightChange: (value: number) => void;
  onTogglePrimaryLock: () => void;
  onToggleSecondaryLock: () => void;
  onShuffle: () => void;
  onSaveSnapshot: () => void;
  onLoadSnapshot: (snapshot: Snapshot) => void;
  primarySize: number;
  primaryWeight: number;
  primaryLineHeight: number;
  secondarySize: number;
  secondaryWeight: number;
  secondaryLineHeight: number;
}

const fontLabel = (fontId: FontId) => FONT_OPTIONS.find((font) => font.id === fontId)?.label ?? "";

export const StudioControls = ({
  activeLayout,
  activeFillIndex,
  primaryFontId,
  secondaryFontId,
  lockPrimary,
  lockSecondary,
  snapshots,
  onLayoutChange,
  onFillChange,
  onPrimarySizeChange,
  onPrimaryWeightChange,
  onPrimaryLineHeightChange,
  onSecondarySizeChange,
  onSecondaryWeightChange,
  onSecondaryLineHeightChange,
  onTogglePrimaryLock,
  onToggleSecondaryLock,
  onShuffle,
  onSaveSnapshot,
  onLoadSnapshot,
  primarySize,
  primaryWeight,
  primaryLineHeight,
  secondarySize,
  secondaryWeight,
  secondaryLineHeight
}: StudioControlsProps) => {
  const activeLayoutDef = LAYOUTS.find((layout) => layout.id === activeLayout) ?? LAYOUTS[0];

  return (
    <aside className="controls-panel">
      <section className="controls-block">
        <h3>Layout</h3>
        <div className="button-row">
          {LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              className={layout.id === activeLayout ? "is-active" : ""}
              onClick={() => onLayoutChange(layout.id)}
            >
              {layout.label}
            </button>
          ))}
        </div>
      </section>

      <section className="controls-block">
        <h3>Content Fill</h3>
        <div className="button-row">
          {activeLayoutDef.fills.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === activeFillIndex ? "is-active" : ""}
              onClick={() => onFillChange(index)}
            >
              Fill {index + 1}
            </button>
          ))}
        </div>
      </section>

      <section className="controls-block">
        <h3>Font Pairing</h3>
        <div className="font-meta">
          <div>
            <span>Primary</span>
            <strong>{fontLabel(primaryFontId)}</strong>
          </div>
          <button type="button" className={lockPrimary ? "is-active" : ""} onClick={onTogglePrimaryLock}>
            {lockPrimary ? "Primary Locked" : "Lock Primary"}
          </button>
        </div>
        <div className="font-meta">
          <div>
            <span>Secondary</span>
            <strong>{fontLabel(secondaryFontId)}</strong>
          </div>
          <button
            type="button"
            className={lockSecondary ? "is-active" : ""}
            onClick={onToggleSecondaryLock}
          >
            {lockSecondary ? "Secondary Locked" : "Lock Secondary"}
          </button>
        </div>
        <div className="button-row">
          <button type="button" onClick={onShuffle}>
            Shuffle Fonts
          </button>
          <button type="button" onClick={onSaveSnapshot}>
            Save Snapshot
          </button>
        </div>
      </section>

      <section className="controls-block">
        <h3>Primary Settings</h3>
        <label>
          Size
          <input
            type="range"
            min={24}
            max={92}
            value={primarySize}
            onChange={(event) => onPrimarySizeChange(Number(event.target.value))}
          />
          <span>{primarySize}px</span>
        </label>
        <label>
          Weight
          <input
            type="range"
            min={300}
            max={900}
            step={100}
            value={primaryWeight}
            onChange={(event) => onPrimaryWeightChange(Number(event.target.value))}
          />
          <span>{primaryWeight}</span>
        </label>
        <label>
          Line Height
          <input
            type="range"
            min={0.9}
            max={2}
            step={0.05}
            value={primaryLineHeight}
            onChange={(event) => onPrimaryLineHeightChange(Number(event.target.value))}
          />
          <span>{primaryLineHeight.toFixed(2)}</span>
        </label>
      </section>

      <section className="controls-block">
        <h3>Secondary Settings</h3>
        <label>
          Size
          <input
            type="range"
            min={13}
            max={56}
            value={secondarySize}
            onChange={(event) => onSecondarySizeChange(Number(event.target.value))}
          />
          <span>{secondarySize}px</span>
        </label>
        <label>
          Weight
          <input
            type="range"
            min={300}
            max={900}
            step={100}
            value={secondaryWeight}
            onChange={(event) => onSecondaryWeightChange(Number(event.target.value))}
          />
          <span>{secondaryWeight}</span>
        </label>
        <label>
          Line Height
          <input
            type="range"
            min={0.9}
            max={2}
            step={0.05}
            value={secondaryLineHeight}
            onChange={(event) => onSecondaryLineHeightChange(Number(event.target.value))}
          />
          <span>{secondaryLineHeight.toFixed(2)}</span>
        </label>
      </section>

      <section className="controls-block">
        <h3>Snapshots</h3>
        <div className="snapshot-list">
          {snapshots.length === 0 && <p>No snapshots yet.</p>}
          {snapshots.map((snapshot) => (
            <button key={snapshot.id} type="button" onClick={() => onLoadSnapshot(snapshot)}>
              <span>{new Date(snapshot.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              <strong>
                {fontLabel(snapshot.primaryFontId)} / {fontLabel(snapshot.secondaryFontId)}
              </strong>
              <small>{LAYOUTS.find((layout) => layout.id === snapshot.layoutId)?.label}</small>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
};
