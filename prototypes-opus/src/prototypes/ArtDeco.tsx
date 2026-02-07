import React, { useState } from "react";
import { useFontMatcher } from "../shared/useFontMatcher";
import { CONTENT_FILLS } from "../shared/contentFills";
import type { LayoutType, ContentFillKey } from "../shared/types";

const GOLD = "#d4af37";
const GOLD_LIGHT = "#e8c860";
const CHAMPAGNE = "#f5deb3";
const IVORY = "#faf3e0";
const NAVY = "#0d1b2a";
const NAVY_DEEP = "#080f1a";
const NAVY_MID = "#142640";

const LAYOUTS: { key: LayoutType; label: string }[] = [
  { key: "title-subtitle", label: "TITLE & SUBTITLE" },
  { key: "title-paragraph", label: "TITLE & PARAGRAPH" },
  { key: "hero-card", label: "HERO CARD" },
  { key: "editorial", label: "EDITORIAL" },
  { key: "split-screen", label: "SPLIT SCREEN" },
];

const FILLS: ContentFillKey[] = ["fill-1", "fill-2", "fill-3"];

function ArtDeco() {
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

  const [showSnapshots, setShowSnapshots] = useState(false);

  const content = CONTENT_FILLS[layout][contentFill];

  const primaryStyle: React.CSSProperties = {
    fontFamily: `${fontPair.primary}, serif`,
    fontSize: config.primary.size,
    fontWeight: config.primary.weight,
    lineHeight: config.primary.lineHeight,
  };

  const secondaryStyle: React.CSSProperties = {
    fontFamily: `${fontPair.secondary}, sans-serif`,
    fontSize: config.secondary.size,
    fontWeight: config.secondary.weight,
    lineHeight: config.secondary.lineHeight,
  };

  const renderPreview = () => {
    if (layout === "title-subtitle") {
      return (
        <div style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ marginBottom: 8 }}>
            <div style={decoLineStyle} />
          </div>
          <h1 style={{ ...primaryStyle, color: IVORY, margin: "24px 0 16px", textTransform: "uppercase" as const, letterSpacing: 4 }}>
            {content.primary}
          </h1>
          <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "20px auto" }} />
          <h2 style={{ ...secondaryStyle, color: CHAMPAGNE, margin: 0, letterSpacing: 2, textTransform: "uppercase" as const }}>
            {content.secondary}
          </h2>
          <div style={{ marginTop: 24 }}>
            <div style={decoLineStyle} />
          </div>
        </div>
      );
    }

    if (layout === "title-paragraph") {
      return (
        <div style={{ padding: "50px 40px" }}>
          <h1 style={{ ...primaryStyle, color: IVORY, textAlign: "center", margin: "0 0 8px", letterSpacing: 6, textTransform: "uppercase" as const }}>
            {content.primary}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "16px 0 28px" }}>
            <div style={{ flex: 1, height: 1, background: GOLD }} />
            <div style={{ width: 8, height: 8, background: GOLD, transform: "rotate(45deg)" }} />
            <div style={{ flex: 1, height: 1, background: GOLD }} />
          </div>
          <p style={{ ...secondaryStyle, color: CHAMPAGNE, margin: 0, textAlign: "justify" }}>
            {content.secondary}
          </p>
        </div>
      );
    }

    if (layout === "hero-card") {
      return (
        <div style={{ padding: "40px" }}>
          <h1 style={{ ...primaryStyle, color: GOLD, textAlign: "center", margin: "0 0 32px", letterSpacing: 8, textTransform: "uppercase" as const, fontSize: config.primary.size * 1.2 }}>
            {content.primary}
          </h1>
          <div style={{
            border: `1px solid ${GOLD}`,
            padding: "32px",
            position: "relative",
            background: `linear-gradient(135deg, ${NAVY_DEEP}88, ${NAVY_MID}44)`,
          }}>
            <div style={{ position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTop: `2px solid ${GOLD_LIGHT}`, borderLeft: `2px solid ${GOLD_LIGHT}` }} />
            <div style={{ position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTop: `2px solid ${GOLD_LIGHT}`, borderRight: `2px solid ${GOLD_LIGHT}` }} />
            <div style={{ position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottom: `2px solid ${GOLD_LIGHT}`, borderLeft: `2px solid ${GOLD_LIGHT}` }} />
            <div style={{ position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottom: `2px solid ${GOLD_LIGHT}`, borderRight: `2px solid ${GOLD_LIGHT}` }} />
            <p style={{ ...secondaryStyle, color: CHAMPAGNE, margin: 0, textAlign: "justify" }}>
              {content.secondary}
            </p>
          </div>
        </div>
      );
    }

    if (layout === "editorial") {
      const firstChar = content.secondary.charAt(0);
      const rest = content.secondary.slice(1);
      return (
        <div style={{ padding: "50px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </div>
          <h1 style={{ ...primaryStyle, color: IVORY, margin: "0 0 24px", letterSpacing: 3, textTransform: "uppercase" as const }}>
            {content.primary}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: GOLD }} />
            <div style={{ color: GOLD, fontSize: 10, letterSpacing: 4 }}>{"◆ ◆ ◆"}</div>
            <div style={{ flex: 1, height: 1, background: GOLD }} />
          </div>
          <p style={{ ...secondaryStyle, color: CHAMPAGNE, margin: 0, textAlign: "justify" }}>
            <span style={{
              ...primaryStyle,
              float: "left" as const,
              fontSize: config.primary.size * 2,
              lineHeight: 0.85,
              marginRight: 8,
              marginTop: 4,
              color: GOLD,
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
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          gap: 0,
          minHeight: 300,
          alignItems: "center",
        }}>
          <div style={{ padding: "40px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h1 style={{ ...primaryStyle, color: GOLD, margin: 0, textAlign: "center", letterSpacing: 4, textTransform: "uppercase" as const }}>
              {content.primary}
            </h1>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)` }} />
          <div style={{ padding: "40px 32px" }}>
            <p style={{ ...secondaryStyle, color: CHAMPAGNE, margin: 0, textAlign: "justify" }}>
              {content.secondary}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const decoLineStyle: React.CSSProperties = {
    height: 2,
    background: `linear-gradient(90deg, transparent 0%, ${GOLD}44 15%, ${GOLD} 35%, ${GOLD_LIGHT} 50%, ${GOLD} 65%, ${GOLD}44 85%, transparent 100%)`,
    margin: "0 auto",
    maxWidth: 400,
  };

  const buttonBase: React.CSSProperties = {
    background: "transparent",
    border: `1px solid ${GOLD}`,
    color: GOLD,
    padding: "8px 20px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    transition: "all 0.25s ease",
    position: "relative",
  };

  const buttonActive: React.CSSProperties = {
    ...buttonBase,
    background: GOLD,
    color: NAVY,
  };

  const sliderContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: GOLD,
    fontFamily: "inherit",
  };

  const sliderStyle: React.CSSProperties = {
    width: "100%",
    accentColor: GOLD,
    cursor: "pointer",
    height: 2,
  };

  const sliderValueStyle: React.CSSProperties = {
    fontSize: 11,
    color: CHAMPAGNE,
    fontFamily: "monospace",
    textAlign: "right",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: NAVY,
      color: IVORY,
      fontFamily: "'Georgia', serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes decoShimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .deco-btn:hover {
          background: ${GOLD} !important;
          color: ${NAVY} !important;
        }
        .deco-lock-btn:hover {
          background: ${GOLD}22 !important;
        }
        .deco-snapshot-item:hover {
          background: ${NAVY_MID} !important;
        }
        .deco-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 2px;
          background: ${GOLD}44;
          outline: none;
          border: none;
        }
        .deco-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: ${GOLD};
          cursor: pointer;
          transform: rotate(45deg);
          border: none;
        }
        .deco-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          background: ${GOLD};
          cursor: pointer;
          transform: rotate(45deg);
          border: none;
          border-radius: 0;
        }
        @media (max-width: 768px) {
          .deco-main-grid {
            grid-template-columns: 1fr !important;
          }
          .deco-header-fonts {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .deco-layout-bar {
            flex-wrap: wrap !important;
          }
          .deco-config-grid {
            grid-template-columns: 1fr !important;
          }
          .deco-split-preview {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            ${GOLD}03 40px,
            ${GOLD}03 41px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            ${GOLD}03 40px,
            ${GOLD}03 41px
          )
        `,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <header style={{ textAlign: "center", padding: "40px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 6, height: 6, background: GOLD, transform: "rotate(45deg)" }} />
              ))}
            </div>
            <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: GOLD,
            margin: "0 0 8px",
          }}>
            Font Pair Matcher
          </h1>
          <div style={{
            fontSize: 10,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: CHAMPAGNE,
            opacity: 0.7,
          }}>
            Prototype V — Art Deco
          </div>
          <div style={{ ...decoLineStyle, marginTop: 20 }} />
        </header>

        <div className="deco-header-fonts" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          marginBottom: 24,
          flexWrap: "wrap",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>
              Primary
            </div>
            <div style={{
              fontSize: 20,
              color: IVORY,
              fontFamily: `${fontPair.primary}, serif`,
              fontWeight: 600,
              transition: "opacity 0.3s",
              opacity: fontsReady ? 1 : 0.3,
            }}>
              {fontPair.primary}
            </div>
          </div>
          <div style={{ color: GOLD, fontSize: 14 }}>{"◇"}</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>
              Secondary
            </div>
            <div style={{
              fontSize: 20,
              color: IVORY,
              fontFamily: `${fontPair.secondary}, sans-serif`,
              fontWeight: 400,
              transition: "opacity 0.3s",
              opacity: fontsReady ? 1 : 0.3,
            }}>
              {fontPair.secondary}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
          <button
            className="deco-lock-btn"
            onClick={() => toggleLock("primary")}
            style={{
              ...buttonBase,
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: locks.primary ? GOLD_LIGHT : CHAMPAGNE,
              borderColor: locks.primary ? GOLD_LIGHT : `${GOLD}66`,
              background: locks.primary ? `${GOLD}15` : "transparent",
            }}
          >
            <span style={{ fontSize: 14 }}>{locks.primary ? "\u{1F512}" : "\u{1F513}"}</span>
            Primary
          </button>
          <button
            className="deco-btn"
            onClick={shuffle}
            style={{
              ...buttonBase,
              padding: "10px 32px",
              fontSize: 12,
              letterSpacing: 4,
              border: `2px solid ${GOLD}`,
            }}
          >
            {"△ "}Shuffle Fonts{" △"}
          </button>
          <button
            className="deco-lock-btn"
            onClick={() => toggleLock("secondary")}
            style={{
              ...buttonBase,
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: locks.secondary ? GOLD_LIGHT : CHAMPAGNE,
              borderColor: locks.secondary ? GOLD_LIGHT : `${GOLD}66`,
              background: locks.secondary ? `${GOLD}15` : "transparent",
            }}
          >
            <span style={{ fontSize: 14 }}>{locks.secondary ? "\u{1F512}" : "\u{1F513}"}</span>
            Secondary
          </button>
        </div>

        <div className="deco-layout-bar" style={{
          display: "flex",
          justifyContent: "center",
          gap: 0,
          marginBottom: 20,
          flexWrap: "wrap",
        }}>
          {LAYOUTS.map((l) => (
            <button
              key={l.key}
              className={layout === l.key ? "" : "deco-btn"}
              onClick={() => setLayout(l.key)}
              style={layout === l.key ? {
                ...buttonActive,
                borderWidth: 1,
              } : {
                ...buttonBase,
                borderWidth: 1,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          {FILLS.map((f, i) => (
            <button
              key={f}
              className={contentFill === f ? "" : "deco-btn"}
              onClick={() => setContentFill(f)}
              style={contentFill === f ? {
                ...buttonActive,
                padding: "6px 16px",
              } : {
                ...buttonBase,
                padding: "6px 16px",
                borderColor: `${GOLD}66`,
              }}
            >
              {"FILL " + (i + 1)}
            </button>
          ))}
        </div>

        <div className="deco-main-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 28,
          marginBottom: 40,
        }}>
          <div>
            <div style={{
              border: `1px solid ${GOLD}44`,
              position: "relative",
              background: `linear-gradient(180deg, ${NAVY_DEEP}, ${NAVY} 50%, ${NAVY_DEEP})`,
              minHeight: 300,
              animation: "fadeIn 0.4s ease",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 28, height: 28, borderTop: `2px solid ${GOLD}`, borderLeft: `2px solid ${GOLD}` }} />
              <div style={{ position: "absolute", top: 0, right: 0, width: 28, height: 28, borderTop: `2px solid ${GOLD}`, borderRight: `2px solid ${GOLD}` }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: 28, height: 28, borderBottom: `2px solid ${GOLD}`, borderLeft: `2px solid ${GOLD}` }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderBottom: `2px solid ${GOLD}`, borderRight: `2px solid ${GOLD}` }} />

              <div style={{
                position: "absolute",
                top: 8,
                left: 8,
                right: 8,
                bottom: 8,
                border: `1px solid ${GOLD}15`,
                pointerEvents: "none",
              }} />

              <div style={{
                padding: 16,
                opacity: fontsReady ? 1 : 0.4,
                transition: "opacity 0.3s ease",
              }}>
                {renderPreview()}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{
              border: `1px solid ${GOLD}33`,
              padding: 20,
              background: `${NAVY_DEEP}cc`,
            }}>
              <div style={{
                fontSize: 10,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: 16,
                textAlign: "center",
                paddingBottom: 10,
                borderBottom: `1px solid ${GOLD}22`,
              }}>
                Primary Font
              </div>
              <div className="deco-config-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                <div style={sliderContainer}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={labelStyle}>Size</span>
                    <span style={sliderValueStyle}>{config.primary.size}px</span>
                  </div>
                  <input
                    className="deco-slider"
                    type="range"
                    min={12}
                    max={120}
                    value={config.primary.size}
                    onChange={(e) => updateConfig("primary", "size", Number(e.target.value))}
                    style={sliderStyle}
                  />
                </div>
                <div style={sliderContainer}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={labelStyle}>Weight</span>
                    <span style={sliderValueStyle}>{config.primary.weight}</span>
                  </div>
                  <input
                    className="deco-slider"
                    type="range"
                    min={100}
                    max={900}
                    step={100}
                    value={config.primary.weight}
                    onChange={(e) => updateConfig("primary", "weight", Number(e.target.value))}
                    style={sliderStyle}
                  />
                </div>
                <div style={sliderContainer}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={labelStyle}>Line Height</span>
                    <span style={sliderValueStyle}>{config.primary.lineHeight.toFixed(1)}</span>
                  </div>
                  <input
                    className="deco-slider"
                    type="range"
                    min={0.8}
                    max={3.0}
                    step={0.1}
                    value={config.primary.lineHeight}
                    onChange={(e) => updateConfig("primary", "lineHeight", Number(e.target.value))}
                    style={sliderStyle}
                  />
                </div>
              </div>
            </div>

            <div style={{
              border: `1px solid ${GOLD}33`,
              padding: 20,
              background: `${NAVY_DEEP}cc`,
            }}>
              <div style={{
                fontSize: 10,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: 16,
                textAlign: "center",
                paddingBottom: 10,
                borderBottom: `1px solid ${GOLD}22`,
              }}>
                Secondary Font
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                <div style={sliderContainer}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={labelStyle}>Size</span>
                    <span style={sliderValueStyle}>{config.secondary.size}px</span>
                  </div>
                  <input
                    className="deco-slider"
                    type="range"
                    min={12}
                    max={120}
                    value={config.secondary.size}
                    onChange={(e) => updateConfig("secondary", "size", Number(e.target.value))}
                    style={sliderStyle}
                  />
                </div>
                <div style={sliderContainer}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={labelStyle}>Weight</span>
                    <span style={sliderValueStyle}>{config.secondary.weight}</span>
                  </div>
                  <input
                    className="deco-slider"
                    type="range"
                    min={100}
                    max={900}
                    step={100}
                    value={config.secondary.weight}
                    onChange={(e) => updateConfig("secondary", "weight", Number(e.target.value))}
                    style={sliderStyle}
                  />
                </div>
                <div style={sliderContainer}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={labelStyle}>Line Height</span>
                    <span style={sliderValueStyle}>{config.secondary.lineHeight.toFixed(1)}</span>
                  </div>
                  <input
                    className="deco-slider"
                    type="range"
                    min={0.8}
                    max={3.0}
                    step={0.1}
                    value={config.secondary.lineHeight}
                    onChange={(e) => updateConfig("secondary", "lineHeight", Number(e.target.value))}
                    style={sliderStyle}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="deco-btn"
                onClick={saveSnapshot}
                style={{ ...buttonBase, flex: 1, padding: "10px 16px", border: `2px solid ${GOLD}` }}
              >
                {"◆ "}Save Snapshot
              </button>
              <button
                className="deco-btn"
                onClick={() => setShowSnapshots(!showSnapshots)}
                style={{
                  ...buttonBase,
                  padding: "10px 16px",
                  borderColor: showSnapshots ? GOLD_LIGHT : `${GOLD}66`,
                  color: showSnapshots ? GOLD_LIGHT : GOLD,
                }}
              >
                {snapshots.length > 0 ? `${snapshots.length}` : "0"}
              </button>
            </div>

            {showSnapshots && (
              <div style={{
                border: `1px solid ${GOLD}33`,
                background: `${NAVY_DEEP}ee`,
                maxHeight: 300,
                overflowY: "auto",
              }}>
                <div style={{
                  fontSize: 10,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: GOLD,
                  padding: "12px 16px 8px",
                  borderBottom: `1px solid ${GOLD}22`,
                  textAlign: "center",
                }}>
                  Saved Snapshots
                </div>
                {snapshots.length === 0 && (
                  <div style={{ padding: 20, textAlign: "center", color: `${CHAMPAGNE}66`, fontSize: 12, letterSpacing: 2 }}>
                    No snapshots saved
                  </div>
                )}
                {snapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="deco-snapshot-item"
                    style={{
                      padding: "10px 16px",
                      borderBottom: `1px solid ${GOLD}11`,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "background 0.2s",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: IVORY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {snap.fontPair.primary}
                      </div>
                      <div style={{ fontSize: 10, color: CHAMPAGNE, opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {snap.fontPair.secondary}
                      </div>
                    </div>
                    <button
                      className="deco-btn"
                      onClick={() => loadSnapshot(snap)}
                      style={{ ...buttonBase, padding: "4px 10px", fontSize: 9, letterSpacing: 2 }}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => removeSnapshot(snap.id)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${GOLD}33`,
                        color: `${CHAMPAGNE}88`,
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: 9,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#c0392b";
                        e.currentTarget.style.color = "#e74c3c";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${GOLD}33`;
                        e.currentTarget.style.color = `${CHAMPAGNE}88`;
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer style={{
          textAlign: "center",
          padding: "20px 0 32px",
          borderTop: `1px solid ${GOLD}22`,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}44)` }} />
            <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: `${GOLD}66` }}>
              MCMXX
            </div>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${GOLD}44, transparent)` }} />
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ArtDeco;
