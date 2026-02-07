import React from "react";
import { useFontMatcher } from "../shared/useFontMatcher";
import { CONTENT_FILLS } from "../shared/contentFills";
import type { LayoutType, ContentFillKey } from "../shared/types";

const LAYOUTS: { key: LayoutType; label: string }[] = [
  { key: "title-subtitle", label: "TITLE/SUB" },
  { key: "title-paragraph", label: "TITLE/PARA" },
  { key: "hero-card", label: "HERO CARD" },
  { key: "editorial", label: "EDITORIAL" },
  { key: "split-screen", label: "SPLIT" },
];

const FILLS: ContentFillKey[] = ["fill-1", "fill-2", "fill-3"];

const s = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#f5f0eb",
    color: "#000",
    fontFamily: "'Space Mono', 'Courier New', monospace",
    fontSize: 12,
    letterSpacing: "0.02em",
  } as React.CSSProperties,

  topBar: {
    borderBottom: "4px solid #000",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: 8,
  } as React.CSSProperties,

  title: {
    fontSize: 14,
    fontWeight: 900,
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    margin: 0,
  } as React.CSSProperties,

  fontNames: {
    border: "3px solid #000",
    padding: "10px 16px",
    display: "flex",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  fontLabel: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.2em",
    color: "#ff0000",
  } as React.CSSProperties,

  fontValue: {
    fontSize: 16,
    fontWeight: 900,
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  controlsBar: {
    borderBottom: "3px solid #000",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  sectionLabel: {
    fontSize: 9,
    fontWeight: 900,
    textTransform: "uppercase" as const,
    letterSpacing: "0.25em",
    marginRight: 8,
    color: "#ff0000",
  } as React.CSSProperties,

  btn: {
    border: "2px solid #000",
    background: "#000",
    color: "#f5f0eb",
    padding: "6px 14px",
    fontFamily: "'Space Mono', 'Courier New', monospace",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    cursor: "pointer",
    borderRadius: 0,
    transition: "background 0.1s, color 0.1s",
  } as React.CSSProperties,

  btnActive: {
    background: "#ff0000",
    borderColor: "#ff0000",
    color: "#fff",
  } as React.CSSProperties,

  btnOutline: {
    border: "2px solid #000",
    background: "transparent",
    color: "#000",
    padding: "6px 14px",
    fontFamily: "'Space Mono', 'Courier New', monospace",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    cursor: "pointer",
    borderRadius: 0,
  } as React.CSSProperties,

  lockBtn: (locked: boolean): React.CSSProperties => ({
    border: "2px solid #000",
    background: locked ? "#ff0000" : "transparent",
    color: locked ? "#fff" : "#000",
    padding: "6px 10px",
    fontFamily: "'Space Mono', 'Courier New', monospace",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    borderRadius: 0,
    minWidth: 36,
    textAlign: "center",
  }),

  separator: {
    width: 2,
    height: 24,
    background: "#000",
    margin: "0 8px",
    flexShrink: 0,
  } as React.CSSProperties,

  mainArea: {
    display: "flex",
    flexDirection: "row" as const,
    minHeight: "calc(100vh - 140px)",
  } as React.CSSProperties,

  previewPane: {
    flex: 1,
    borderRight: "3px solid #000",
    padding: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
  } as React.CSSProperties,

  sidebar: {
    width: 320,
    flexShrink: 0,
    borderLeft: "none",
    overflow: "auto",
  } as React.CSSProperties,

  sidebarSection: {
    borderBottom: "3px solid #000",
    padding: "16px 20px",
  } as React.CSSProperties,

  sidebarTitle: {
    fontSize: 10,
    fontWeight: 900,
    textTransform: "uppercase" as const,
    letterSpacing: "0.25em",
    marginBottom: 14,
    color: "#ff0000",
    borderBottom: "2px solid #ff0000",
    paddingBottom: 6,
  } as React.CSSProperties,

  sliderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
  } as React.CSSProperties,

  sliderLabel: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    width: 80,
    flexShrink: 0,
  } as React.CSSProperties,

  slider: {
    flex: 1,
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    height: 3,
    background: "#000",
    outline: "none",
    borderRadius: 0,
    cursor: "pointer",
    accentColor: "#ff0000",
  } as React.CSSProperties,

  sliderValue: {
    fontSize: 11,
    fontWeight: 900,
    width: 40,
    textAlign: "right" as const,
    flexShrink: 0,
  } as React.CSSProperties,

  snapshotItem: {
    border: "2px solid #000",
    padding: "10px 12px",
    marginBottom: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,

  snapshotFonts: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    lineHeight: 1.4,
    flex: 1,
    overflow: "hidden",
  } as React.CSSProperties,

  snapshotActions: {
    display: "flex",
    gap: 4,
    flexShrink: 0,
  } as React.CSSProperties,

  smallBtn: {
    border: "2px solid #000",
    background: "#000",
    color: "#f5f0eb",
    padding: "3px 8px",
    fontFamily: "'Space Mono', 'Courier New', monospace",
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    cursor: "pointer",
    borderRadius: 0,
  } as React.CSSProperties,

  removeBtn: {
    border: "2px solid #ff0000",
    background: "#ff0000",
    color: "#fff",
    padding: "3px 8px",
    fontFamily: "'Space Mono', 'Courier New', monospace",
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    cursor: "pointer",
    borderRadius: 0,
  } as React.CSSProperties,

  previewContainer: {
    width: "100%",
    maxWidth: 800,
  } as React.CSSProperties,

  loading: {
    fontSize: 14,
    fontWeight: 900,
    textTransform: "uppercase" as const,
    letterSpacing: "0.3em",
    animation: "pulse 1s infinite",
  } as React.CSSProperties,
};

function Brutalist() {
  const {
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
  } = useFontMatcher();

  const content = CONTENT_FILLS[layout][contentFill];

  const primaryStyle: React.CSSProperties = {
    fontFamily: `${fontPair.primary}, serif`,
    fontSize: config.primary.size,
    fontWeight: config.primary.weight,
    lineHeight: config.primary.lineHeight,
    margin: 0,
    padding: 0,
  };

  const secondaryStyle: React.CSSProperties = {
    fontFamily: `${fontPair.secondary}, sans-serif`,
    fontSize: config.secondary.size,
    fontWeight: config.secondary.weight,
    lineHeight: config.secondary.lineHeight,
    margin: 0,
    padding: 0,
  };

  const renderPreview = () => {
    if (layout === "title-subtitle") {
      return (
        <div style={s.previewContainer}>
          <h1 style={{ ...primaryStyle, borderBottom: "4px solid #000", paddingBottom: 20, marginBottom: 20 }}>
            {content.primary}
          </h1>
          <p style={{ ...secondaryStyle, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {content.secondary}
          </p>
        </div>
      );
    }

    if (layout === "title-paragraph") {
      return (
        <div style={s.previewContainer}>
          <h1 style={{ ...primaryStyle, marginBottom: 24, borderLeft: "6px solid #ff0000", paddingLeft: 20 }}>
            {content.primary}
          </h1>
          <p style={secondaryStyle}>{content.secondary}</p>
        </div>
      );
    }

    if (layout === "hero-card") {
      return (
        <div style={{ ...s.previewContainer, border: "4px solid #000", padding: 40, background: "#fff" }}>
          <h1 style={{ ...primaryStyle, marginBottom: 30, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
            {content.primary}
          </h1>
          <div style={{ borderTop: "3px solid #000", paddingTop: 20 }}>
            <p style={secondaryStyle}>{content.secondary}</p>
          </div>
        </div>
      );
    }

    if (layout === "editorial") {
      const firstChar = content.secondary.charAt(0);
      const rest = content.secondary.slice(1);
      return (
        <div style={s.previewContainer}>
          <h1 style={{
            ...primaryStyle,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            borderBottom: "6px solid #000",
            paddingBottom: 16,
            marginBottom: 24,
          }}>
            {content.primary}
          </h1>
          <p style={secondaryStyle}>
            <span style={{
              fontFamily: `${fontPair.primary}, serif`,
              fontSize: config.secondary.size * 3.5,
              fontWeight: 900,
              float: "left",
              lineHeight: 0.8,
              marginRight: 8,
              marginTop: 4,
              color: "#ff0000",
            }}>
              {firstChar}
            </span>
            {rest}
          </p>
        </div>
      );
    }

    if (layout === "split-screen") {
      return (
        <div style={{
          ...s.previewContainer,
          display: "flex",
          gap: 0,
          flexWrap: "wrap" as const,
        }}>
          <div style={{
            flex: "1 1 280px",
            borderRight: "4px solid #000",
            paddingRight: 30,
            display: "flex",
            alignItems: "center",
          }}>
            <h1 style={{ ...primaryStyle, textTransform: "uppercase" }}>{content.primary}</h1>
          </div>
          <div style={{
            flex: "1 1 280px",
            paddingLeft: 30,
            display: "flex",
            alignItems: "center",
          }}>
            <p style={secondaryStyle}>{content.secondary}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSlider = (
    which: "primary" | "secondary",
    field: "size" | "weight" | "lineHeight",
    min: number,
    max: number,
    step: number,
    label: string,
  ) => {
    const value = config[which][field];
    return (
      <div style={s.sliderRow} key={`${which}-${field}`}>
        <span style={s.sliderLabel}>{label}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => updateConfig(which, field, parseFloat(e.target.value))}
          style={s.slider}
        />
        <span style={s.sliderValue}>{value}</span>
      </div>
    );
  };

  const [mobilePanel, setMobilePanel] = React.useState(false);

  return (
    <div style={s.root}>
      <style>{`
        @media (max-width: 768px) {
          .brut-main { flex-direction: column !important; }
          .brut-sidebar { width: 100% !important; border-right: none !important; border-top: 3px solid #000 !important; }
          .brut-preview { border-right: none !important; padding: 20px !important; }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: #ff0000;
          border: 2px solid #000;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #ff0000;
          border: 2px solid #000;
          cursor: pointer;
          border-radius: 0;
        }
        .brut-btn:hover { background: #ff0000 !important; border-color: #ff0000 !important; color: #fff !important; }
        .brut-btn-outline:hover { background: #000 !important; color: #f5f0eb !important; }
        .brut-mobile-toggle { display: none !important; }
        @media (max-width: 768px) {
          .brut-mobile-toggle { display: block !important; }
          .brut-sidebar-hidden { display: none !important; }
        }
      `}</style>

      <div style={s.topBar}>
        <h1 style={s.title}>FONT PAIR MATCHER</h1>
        <div style={s.fontNames}>
          <div>
            <div style={s.fontLabel}>PRIMARY</div>
            <div style={s.fontValue}>{fontPair.primary}</div>
          </div>
          <div style={{ ...s.separator, height: 36 }} />
          <div>
            <div style={s.fontLabel}>SECONDARY</div>
            <div style={s.fontValue}>{fontPair.secondary}</div>
          </div>
        </div>
      </div>

      <div style={s.controlsBar}>
        <span style={s.sectionLabel}>LAYOUT</span>
        {LAYOUTS.map((l) => (
          <button
            key={l.key}
            className="brut-btn"
            style={{
              ...s.btn,
              ...(layout === l.key ? s.btnActive : {}),
            }}
            onClick={() => setLayout(l.key)}
          >
            {l.label}
          </button>
        ))}

        <div style={s.separator} />

        <span style={s.sectionLabel}>FILL</span>
        {FILLS.map((f, i) => (
          <button
            key={f}
            className="brut-btn"
            style={{
              ...s.btn,
              ...(contentFill === f ? s.btnActive : {}),
            }}
            onClick={() => setContentFill(f)}
          >
            {i + 1}
          </button>
        ))}

        <div style={s.separator} />

        <button className="brut-btn" style={s.btn} onClick={shuffle}>
          SHUFFLE
        </button>

        <button
          style={s.lockBtn(locks.primary)}
          onClick={() => toggleLock("primary")}
          title={locks.primary ? "Unlock primary" : "Lock primary"}
        >
          {locks.primary ? "\u{1F512}" : "\u{1F513}"} P
        </button>
        <button
          style={s.lockBtn(locks.secondary)}
          onClick={() => toggleLock("secondary")}
          title={locks.secondary ? "Unlock secondary" : "Lock secondary"}
        >
          {locks.secondary ? "\u{1F512}" : "\u{1F513}"} S
        </button>

        <div style={s.separator} />

        <button className="brut-btn" style={s.btn} onClick={saveSnapshot}>
          SAVE
        </button>

        <button
          className="brut-btn brut-mobile-toggle"
          style={s.btn}
          onClick={() => setMobilePanel(!mobilePanel)}
        >
          {mobilePanel ? "CLOSE PANEL" : "CONFIG"}
        </button>
      </div>

      <div className="brut-main" style={s.mainArea}>
        <div className="brut-preview" style={s.previewPane}>
          {!fontsReady && (
            <div style={s.loading}>LOADING FONTS...</div>
          )}
          {fontsReady && renderPreview()}
        </div>

        <div
          className={`brut-sidebar ${!mobilePanel ? "brut-sidebar-hidden" : ""}`}
          style={s.sidebar}
        >
          <div style={s.sidebarSection}>
            <div style={s.sidebarTitle}>PRIMARY — {fontPair.primary}</div>
            {renderSlider("primary", "size", 12, 120, 1, "SIZE")}
            {renderSlider("primary", "weight", 100, 900, 100, "WEIGHT")}
            {renderSlider("primary", "lineHeight", 0.8, 3.0, 0.1, "LINE-H")}
          </div>

          <div style={s.sidebarSection}>
            <div style={s.sidebarTitle}>SECONDARY — {fontPair.secondary}</div>
            {renderSlider("secondary", "size", 12, 120, 1, "SIZE")}
            {renderSlider("secondary", "weight", 100, 900, 100, "WEIGHT")}
            {renderSlider("secondary", "lineHeight", 0.8, 3.0, 0.1, "LINE-H")}
          </div>

          <div style={s.sidebarSection}>
            <div style={s.sidebarTitle}>
              SNAPSHOTS ({snapshots.length})
            </div>
            {snapshots.length === 0 && (
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999" }}>
                NO SNAPSHOTS SAVED
              </div>
            )}
            {snapshots.map((snap) => (
              <div key={snap.id} style={s.snapshotItem}>
                <div style={s.snapshotFonts}>
                  <div>{snap.fontPair.primary}</div>
                  <div style={{ color: "#999" }}>{snap.fontPair.secondary}</div>
                </div>
                <div style={s.snapshotActions}>
                  <button style={s.smallBtn} onClick={() => loadSnapshot(snap)}>
                    LOAD
                  </button>
                  <button style={s.removeBtn} onClick={() => removeSnapshot(snap.id)}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Brutalist;
