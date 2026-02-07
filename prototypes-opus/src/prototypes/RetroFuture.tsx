import React, { useState } from "react";
import { useFontMatcher } from "../shared/useFontMatcher";
import { CONTENT_FILLS } from "../shared/contentFills";
import type { LayoutType, ContentFillKey } from "../shared/types";

const LAYOUTS: { key: LayoutType; label: string }[] = [
  { key: "title-subtitle", label: "TITLE/SUB" },
  { key: "title-paragraph", label: "TITLE/PARA" },
  { key: "hero-card", label: "HERO CARD" },
  { key: "editorial", label: "EDITORIAL" },
  { key: "split-screen", label: "SPLIT SCR" },
];

const FILLS: ContentFillKey[] = ["fill-1", "fill-2", "fill-3"];

const NEON_CYAN = "#00fff5";
const NEON_PINK = "#ff2d95";
const NEON_PURPLE = "#b026ff";
const BG_DARK = "#0a0a14";
const BG_PANEL = "#0f0f1e";
const BG_CARD = "#14142a";
const BORDER_DIM = "#1a1a3a";

function RetroFuture() {
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

  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const content = CONTENT_FILLS[layout][contentFill];

  const primaryStyle: React.CSSProperties = {
    fontFamily: `"${fontPair.primary}", serif`,
    fontSize: config.primary.size,
    fontWeight: config.primary.weight,
    lineHeight: config.primary.lineHeight,
    color: NEON_CYAN,
    textShadow: `0 0 10px ${NEON_CYAN}80, 0 0 30px ${NEON_CYAN}40`,
    margin: 0,
    transition: "opacity 0.3s ease",
    opacity: fontsReady ? 1 : 0.3,
  };

  const secondaryStyle: React.CSSProperties = {
    fontFamily: `"${fontPair.secondary}", sans-serif`,
    fontSize: config.secondary.size,
    fontWeight: config.secondary.weight,
    lineHeight: config.secondary.lineHeight,
    color: "#c0c0e0",
    margin: 0,
    transition: "opacity 0.3s ease",
    opacity: fontsReady ? 1 : 0.3,
  };

  const neonButton = (
    label: string,
    onClick: () => void,
    color: string,
    id: string,
    extraStyle?: React.CSSProperties
  ): React.ReactNode => {
    const isHovered = hoveredBtn === id;
    return (
      <button
        key={id}
        onClick={onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => setHoveredBtn(null)}
        style={{
          background: isHovered ? `${color}18` : "transparent",
          border: `1px solid ${isHovered ? color : BORDER_DIM}`,
          color: isHovered ? color : "#7070a0",
          padding: "6px 14px",
          fontFamily: "'JetBrains Mono', 'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isHovered ? `0 0 12px ${color}40, inset 0 0 12px ${color}10` : "none",
          textShadow: isHovered ? `0 0 8px ${color}80` : "none",
          whiteSpace: "nowrap" as const,
          ...extraStyle,
        }}
      >
        {label}
      </button>
    );
  };

  const renderSlider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    onChange: (v: number) => void,
    color: string
  ) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: "#505080",
          width: 80,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          flex: 1,
          accentColor: color,
          height: 4,
          cursor: "pointer",
        }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color,
          width: 36,
          textAlign: "right",
          textShadow: `0 0 6px ${color}60`,
        }}
      >
        {value}
      </span>
    </div>
  );

  const renderLayoutPreview = () => {
    if (layout === "title-subtitle") {
      return (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h1 style={{ ...primaryStyle, marginBottom: 20 }}>{content.primary}</h1>
          <p style={{ ...secondaryStyle, maxWidth: 600, margin: "0 auto" }}>{content.secondary}</p>
        </div>
      );
    }

    if (layout === "title-paragraph") {
      return (
        <div style={{ padding: "40px 30px", maxWidth: 700 }}>
          <h1 style={{ ...primaryStyle, marginBottom: 24 }}>{content.primary}</h1>
          <p style={secondaryStyle}>{content.secondary}</p>
        </div>
      );
    }

    if (layout === "hero-card") {
      return (
        <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              background: `${BG_CARD}cc`,
              border: `1px solid ${NEON_PURPLE}40`,
              borderRadius: 4,
              padding: "50px 40px",
              maxWidth: 650,
              width: "100%",
              boxShadow: `0 0 30px ${NEON_PURPLE}15, inset 0 0 30px ${NEON_PURPLE}05`,
            }}
          >
            <h1 style={{ ...primaryStyle, marginBottom: 24, textAlign: "center" }}>{content.primary}</h1>
            <p style={{ ...secondaryStyle, textAlign: "center" }}>{content.secondary}</p>
          </div>
        </div>
      );
    }

    if (layout === "editorial") {
      const firstChar = content.secondary.charAt(0);
      const rest = content.secondary.slice(1);
      return (
        <div style={{ padding: "40px 30px", maxWidth: 700 }}>
          <h1
            style={{
              ...primaryStyle,
              marginBottom: 24,
              borderBottom: `1px solid ${NEON_PINK}30`,
              paddingBottom: 16,
            }}
          >
            {content.primary}
          </h1>
          <p style={secondaryStyle}>
            <span
              style={{
                fontFamily: `"${fontPair.primary}", serif`,
                fontSize: config.secondary.size * 3.2,
                fontWeight: config.primary.weight,
                lineHeight: 1,
                float: "left",
                marginRight: 8,
                marginTop: 4,
                color: NEON_PINK,
                textShadow: `0 0 15px ${NEON_PINK}60`,
              }}
            >
              {firstChar}
            </span>
            {rest}
          </p>
        </div>
      );
    }

    if (layout === "split-screen") {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 300,
            gap: 0,
          }}
          className="retro-split"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 30px",
              borderRight: `1px solid ${NEON_CYAN}20`,
            }}
          >
            <h1 style={{ ...primaryStyle, textAlign: "center" }}>{content.primary}</h1>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "40px 30px",
            }}
          >
            <p style={secondaryStyle}>{content.secondary}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <style>{`
        @keyframes retro-scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        @keyframes retro-flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; }
          94% { opacity: 1; }
          96% { opacity: 0.9; }
          97% { opacity: 1; }
        }
        @keyframes retro-glow-pulse {
          0%, 100% { text-shadow: 0 0 10px #00fff580, 0 0 30px #00fff540; }
          50% { text-shadow: 0 0 15px #00fff5a0, 0 0 40px #00fff560, 0 0 60px #00fff530; }
        }
        .retro-container::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.08) 2px,
            rgba(0, 0, 0, 0.08) 4px
          );
          pointer-events: none;
          z-index: 9999;
          animation: retro-scanline 0.1s linear infinite;
        }
        .retro-container::after {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            linear-gradient(90deg, transparent 49.5%, ${BORDER_DIM}30 49.5%, ${BORDER_DIM}30 50.5%, transparent 50.5%) 0 0 / 60px 60px,
            linear-gradient(0deg, transparent 49.5%, ${BORDER_DIM}30 49.5%, ${BORDER_DIM}30 50.5%, transparent 50.5%) 0 0 / 60px 60px;
          pointer-events: none;
          z-index: -1;
        }
        .retro-split {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .retro-split {
            grid-template-columns: 1fr !important;
          }
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: ${BORDER_DIM};
          border-radius: 2px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 1px;
          cursor: pointer;
        }
      `}</style>

      <div
        className="retro-container"
        style={{
          minHeight: "100vh",
          background: BG_DARK,
          color: "#c0c0e0",
          fontFamily: "'JetBrains Mono', 'Space Mono', monospace",
          position: "relative",
          animation: "retro-flicker 4s ease-in-out infinite",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px 16px",
          }}
        >
          <header
            style={{
              textAlign: "center",
              marginBottom: 30,
              padding: "20px 0",
              borderBottom: `1px solid ${NEON_CYAN}20`,
            }}
          >
            <h1
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: NEON_CYAN,
                margin: "0 0 12px 0",
                textShadow: `0 0 10px ${NEON_CYAN}80, 0 0 30px ${NEON_CYAN}40`,
                animation: "retro-glow-pulse 3s ease-in-out infinite",
              }}
            >
              {">"} FONT_PAIR_MATCHER v3.0
            </h1>
            <div
              style={{
                fontSize: 10,
                color: "#4040a0",
                letterSpacing: "0.15em",
              }}
            >
              SYS::RETRO_FUTURISTIC_INTERFACE
            </div>
          </header>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              marginBottom: 16,
              padding: "12px 16px",
              background: `${BG_PANEL}`,
              border: `1px solid ${BORDER_DIM}`,
            }}
          >
            <span style={{ fontSize: 10, color: "#4040a0", marginRight: 4, letterSpacing: "0.1em" }}>
              LAYOUT:
            </span>
            {LAYOUTS.map((l) =>
              neonButton(
                l.label,
                () => setLayout(l.key),
                layout === l.key ? NEON_CYAN : NEON_PURPLE,
                `layout-${l.key}`,
                {
                  border: layout === l.key ? `1px solid ${NEON_CYAN}` : undefined,
                  color: layout === l.key ? NEON_CYAN : undefined,
                  boxShadow: layout === l.key ? `0 0 12px ${NEON_CYAN}40` : undefined,
                  textShadow: layout === l.key ? `0 0 8px ${NEON_CYAN}80` : undefined,
                }
              )
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              marginBottom: 20,
              padding: "12px 16px",
              background: `${BG_PANEL}`,
              border: `1px solid ${BORDER_DIM}`,
            }}
          >
            <span style={{ fontSize: 10, color: "#4040a0", marginRight: 4, letterSpacing: "0.1em" }}>
              CONTENT:
            </span>
            {FILLS.map((f, i) =>
              neonButton(
                `DATA-${i + 1}`,
                () => setContentFill(f),
                contentFill === f ? NEON_PINK : NEON_PURPLE,
                `fill-${f}`,
                {
                  border: contentFill === f ? `1px solid ${NEON_PINK}` : undefined,
                  color: contentFill === f ? NEON_PINK : undefined,
                  boxShadow: contentFill === f ? `0 0 12px ${NEON_PINK}40` : undefined,
                  textShadow: contentFill === f ? `0 0 8px ${NEON_PINK}80` : undefined,
                }
              )
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: 20,
              alignItems: "start",
            }}
            className="retro-main-grid"
          >
            <style>{`
              @media (max-width: 768px) {
                .retro-main-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>

            <div>
              <div
                style={{
                  background: BG_PANEL,
                  border: `1px solid ${BORDER_DIM}`,
                  minHeight: 350,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 28,
                    background: `${BG_CARD}`,
                    borderBottom: `1px solid ${BORDER_DIM}`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                    gap: 6,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: NEON_PINK, boxShadow: `0 0 6px ${NEON_PINK}80` }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: NEON_PURPLE, boxShadow: `0 0 6px ${NEON_PURPLE}80` }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: NEON_CYAN, boxShadow: `0 0 6px ${NEON_CYAN}80` }} />
                  <span style={{ fontSize: 9, color: "#4040a0", marginLeft: 8, letterSpacing: "0.1em" }}>
                    PREVIEW_VIEWPORT
                  </span>
                </div>

                <div style={{ paddingTop: 28 }}>
                  {renderLayoutPreview()}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 16,
                  padding: "14px 16px",
                  background: BG_PANEL,
                  border: `1px solid ${BORDER_DIM}`,
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 10, color: "#4040a0", letterSpacing: "0.1em", marginBottom: 6 }}>
                    PRIMARY_FONT:
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 16,
                        color: NEON_CYAN,
                        textShadow: `0 0 10px ${NEON_CYAN}60`,
                        fontFamily: `"${fontPair.primary}", serif`,
                        fontWeight: 600,
                      }}
                    >
                      {fontPair.primary}
                    </span>
                    <button
                      onClick={() => toggleLock("primary")}
                      style={{
                        background: "transparent",
                        border: `1px solid ${locks.primary ? NEON_PINK : BORDER_DIM}`,
                        color: locks.primary ? NEON_PINK : "#5050a0",
                        padding: "2px 8px",
                        fontSize: 14,
                        cursor: "pointer",
                        boxShadow: locks.primary ? `0 0 8px ${NEON_PINK}40` : "none",
                        transition: "all 0.2s ease",
                      }}
                      title={locks.primary ? "Unlock primary font" : "Lock primary font"}
                    >
                      {locks.primary ? "\u{1F512}" : "\u{1F513}"}
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 10, color: "#4040a0", letterSpacing: "0.1em", marginBottom: 6 }}>
                    SECONDARY_FONT:
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 16,
                        color: NEON_PURPLE,
                        textShadow: `0 0 10px ${NEON_PURPLE}60`,
                        fontFamily: `"${fontPair.secondary}", sans-serif`,
                        fontWeight: 600,
                      }}
                    >
                      {fontPair.secondary}
                    </span>
                    <button
                      onClick={() => toggleLock("secondary")}
                      style={{
                        background: "transparent",
                        border: `1px solid ${locks.secondary ? NEON_PINK : BORDER_DIM}`,
                        color: locks.secondary ? NEON_PINK : "#5050a0",
                        padding: "2px 8px",
                        fontSize: 14,
                        cursor: "pointer",
                        boxShadow: locks.secondary ? `0 0 8px ${NEON_PINK}40` : "none",
                        transition: "all 0.2s ease",
                      }}
                      title={locks.secondary ? "Unlock secondary font" : "Lock secondary font"}
                    >
                      {locks.secondary ? "\u{1F512}" : "\u{1F513}"}
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 12,
                }}
              >
                {neonButton(
                  "\u26A1 SHUFFLE FONTS",
                  shuffle,
                  NEON_CYAN,
                  "shuffle",
                  {
                    flex: 1,
                    padding: "12px 20px",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                  }
                )}
                {neonButton(
                  "\u{1F4BE} SAVE SNAPSHOT",
                  saveSnapshot,
                  NEON_PINK,
                  "save",
                  {
                    flex: 1,
                    padding: "12px 20px",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                  }
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  background: BG_PANEL,
                  border: `1px solid ${BORDER_DIM}`,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: NEON_CYAN,
                    letterSpacing: "0.15em",
                    marginBottom: 14,
                    textShadow: `0 0 8px ${NEON_CYAN}40`,
                    borderBottom: `1px solid ${BORDER_DIM}`,
                    paddingBottom: 8,
                  }}
                >
                  {">"} PRIMARY_CONFIG
                </div>
                {renderSlider("size", config.primary.size, 12, 120, 1, (v) => updateConfig("primary", "size", v), NEON_CYAN)}
                {renderSlider("weight", config.primary.weight, 100, 900, 100, (v) => updateConfig("primary", "weight", v), NEON_CYAN)}
                {renderSlider("ln-height", config.primary.lineHeight, 0.8, 3.0, 0.1, (v) => updateConfig("primary", "lineHeight", v), NEON_CYAN)}
              </div>

              <div
                style={{
                  background: BG_PANEL,
                  border: `1px solid ${BORDER_DIM}`,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: NEON_PURPLE,
                    letterSpacing: "0.15em",
                    marginBottom: 14,
                    textShadow: `0 0 8px ${NEON_PURPLE}40`,
                    borderBottom: `1px solid ${BORDER_DIM}`,
                    paddingBottom: 8,
                  }}
                >
                  {">"} SECONDARY_CONFIG
                </div>
                {renderSlider("size", config.secondary.size, 12, 120, 1, (v) => updateConfig("secondary", "size", v), NEON_PURPLE)}
                {renderSlider("weight", config.secondary.weight, 100, 900, 100, (v) => updateConfig("secondary", "weight", v), NEON_PURPLE)}
                {renderSlider("ln-height", config.secondary.lineHeight, 0.8, 3.0, 0.1, (v) => updateConfig("secondary", "lineHeight", v), NEON_PURPLE)}
              </div>

              <div
                style={{
                  background: BG_PANEL,
                  border: `1px solid ${BORDER_DIM}`,
                  padding: 16,
                  maxHeight: 400,
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: NEON_PINK,
                    letterSpacing: "0.15em",
                    marginBottom: 14,
                    textShadow: `0 0 8px ${NEON_PINK}40`,
                    borderBottom: `1px solid ${BORDER_DIM}`,
                    paddingBottom: 8,
                  }}
                >
                  {">"} SAVED_SNAPSHOTS [{snapshots.length}]
                </div>

                {snapshots.length === 0 && (
                  <div style={{ fontSize: 10, color: "#3030a0", fontStyle: "italic", padding: "10px 0" }}>
                    NO_DATA_STORED
                  </div>
                )}

                {snapshots.map((snap) => (
                  <div
                    key={snap.id}
                    style={{
                      padding: "10px 10px",
                      marginBottom: 8,
                      border: `1px solid ${BORDER_DIM}`,
                      background: `${BG_CARD}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: NEON_CYAN,
                        marginBottom: 2,
                        textShadow: `0 0 6px ${NEON_CYAN}40`,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {snap.fontPair.primary}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: NEON_PURPLE,
                        marginBottom: 6,
                        textShadow: `0 0 6px ${NEON_PURPLE}40`,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {snap.fontPair.secondary}
                    </div>
                    <div style={{ fontSize: 9, color: "#4040a0", marginBottom: 8 }}>
                      {snap.layout.toUpperCase()} \u00B7{" "}
                      {new Date(snap.timestamp).toLocaleTimeString()}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {neonButton(
                        "LOAD",
                        () => loadSnapshot(snap),
                        NEON_CYAN,
                        `load-${snap.id}`,
                        { padding: "3px 10px", fontSize: 9 }
                      )}
                      {neonButton(
                        "\u00D7 DEL",
                        () => removeSnapshot(snap.id),
                        NEON_PINK,
                        `del-${snap.id}`,
                        { padding: "3px 10px", fontSize: 9 }
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <footer
            style={{
              textAlign: "center",
              padding: "20px 0",
              marginTop: 30,
              borderTop: `1px solid ${BORDER_DIM}`,
              fontSize: 9,
              color: "#2525a0",
              letterSpacing: "0.2em",
            }}
          >
            SYS::FONT_MATCH_TERMINAL // PROTOTYPE_03 // RETRO_FUTURE
          </footer>
        </div>
      </div>
    </>
  );
}

export default RetroFuture;
