import React, { useState } from "react";
import { useFontMatcher } from "../shared/useFontMatcher";
import { CONTENT_FILLS } from "../shared/contentFills";
import type { LayoutType, ContentFillKey } from "../shared/types";

const GOLD = "#c9a84c";
const GOLD_DIM = "#a8893d";
const GOLD_GLOW = "rgba(201, 168, 76, 0.15)";
const BG_DEEP = "#0d0d0d";
const BG_PANEL = "#141414";
const BG_CARD = "#1a1a1a";
const BORDER = "rgba(201, 168, 76, 0.18)";
const BORDER_SUBTLE = "rgba(255, 255, 255, 0.06)";
const TEXT_PRIMARY = "#f0ece4";
const TEXT_SECONDARY = "rgba(240, 236, 228, 0.55)";
const TEXT_MUTED = "rgba(240, 236, 228, 0.35)";

const LAYOUTS: { key: LayoutType; label: string }[] = [
  { key: "title-subtitle", label: "Title & Subtitle" },
  { key: "title-paragraph", label: "Title & Paragraph" },
  { key: "hero-card", label: "Hero Card" },
  { key: "editorial", label: "Editorial" },
  { key: "split-screen", label: "Split Screen" },
];

const FILLS: ContentFillKey[] = ["fill-1", "fill-2", "fill-3"];

const smallCaps: React.CSSProperties = {
  fontVariant: "all-small-caps",
  letterSpacing: "0.18em",
  fontSize: 11,
  fontWeight: 500,
  color: GOLD_DIM,
  fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
};

function GoldDivider() {
  return (
    <div style={{ padding: "0 0", margin: "24px 0" }}>
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${GOLD_DIM}, transparent)`,
        }}
      />
    </div>
  );
}

function Luxury() {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const content = CONTENT_FILLS[layout][contentFill];

  const primaryStyle: React.CSSProperties = {
    fontFamily: `"${fontPair.primary}", serif`,
    fontSize: config.primary.size,
    fontWeight: config.primary.weight,
    lineHeight: config.primary.lineHeight,
    color: TEXT_PRIMARY,
    transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
    opacity: fontsReady ? 1 : 0,
  };

  const secondaryStyle: React.CSSProperties = {
    fontFamily: `"${fontPair.secondary}", sans-serif`,
    fontSize: config.secondary.size,
    fontWeight: config.secondary.weight,
    lineHeight: config.secondary.lineHeight,
    color: TEXT_SECONDARY,
    transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
    opacity: fontsReady ? 1 : 0,
  };

  const buttonBase: React.CSSProperties = {
    background: "transparent",
    border: `1px solid ${BORDER}`,
    color: GOLD,
    padding: "10px 24px",
    cursor: "pointer",
    fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
    fontSize: 11,
    fontVariant: "all-small-caps",
    letterSpacing: "0.2em",
    transition: "all 0.35s ease",
  };

  const renderPreview = () => {
    if (layout === "title-subtitle") {
      return (
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <h1 style={{ ...primaryStyle, margin: 0 }}>{content.primary}</h1>
          <div
            style={{
              width: 60,
              height: 1,
              background: GOLD,
              margin: "32px auto",
              opacity: 0.5,
            }}
          />
          <p style={{ ...secondaryStyle, margin: 0 }}>{content.secondary}</p>
        </div>
      );
    }

    if (layout === "title-paragraph") {
      return (
        <div style={{ padding: "60px 48px", maxWidth: 780 }}>
          <h1 style={{ ...primaryStyle, margin: "0 0 40px 0" }}>
            {content.primary}
          </h1>
          <div
            style={{
              width: 40,
              height: 1,
              background: GOLD,
              marginBottom: 32,
              opacity: 0.4,
            }}
          />
          <p style={{ ...secondaryStyle, margin: 0 }}>{content.secondary}</p>
        </div>
      );
    }

    if (layout === "hero-card") {
      return (
        <div style={{ padding: "48px 24px", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              background: `linear-gradient(145deg, ${BG_CARD}, ${BG_PANEL})`,
              border: `1px solid ${BORDER}`,
              padding: "64px 56px",
              maxWidth: 680,
              width: "100%",
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
                height: 1,
                background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              }}
            />
            <h1
              style={{
                ...primaryStyle,
                margin: "0 0 36px 0",
                textAlign: "center",
              }}
            >
              {content.primary}
            </h1>
            <div
              style={{
                width: 24,
                height: 24,
                border: `1px solid ${GOLD_DIM}`,
                transform: "rotate(45deg)",
                margin: "0 auto 36px",
                opacity: 0.4,
              }}
            />
            <p style={{ ...secondaryStyle, margin: 0, textAlign: "center" }}>
              {content.secondary}
            </p>
          </div>
        </div>
      );
    }

    if (layout === "editorial") {
      const firstLetter = content.secondary.charAt(0);
      const rest = content.secondary.slice(1);
      return (
        <div style={{ padding: "60px 48px", maxWidth: 720 }}>
          <p
            style={{
              ...smallCaps,
              fontSize: 10,
              marginBottom: 16,
              color: GOLD,
            }}
          >
            Volume I &mdash; Chapter One
          </p>
          <h1
            style={{
              ...primaryStyle,
              margin: "0 0 40px 0",
              borderBottom: `1px solid ${BORDER}`,
              paddingBottom: 32,
            }}
          >
            {content.primary}
          </h1>
          <p style={{ ...secondaryStyle, margin: 0 }}>
            <span
              style={{
                fontFamily: `"${fontPair.primary}", serif`,
                fontSize: config.secondary.size * 3.2,
                fontWeight: config.primary.weight,
                lineHeight: 0.85,
                float: "left",
                marginRight: 12,
                marginTop: 6,
                color: GOLD,
              }}
            >
              {firstLetter}
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
            minHeight: 400,
          }}
        >
          <div
            style={{
              padding: "60px 48px",
              display: "flex",
              alignItems: "center",
              borderRight: `1px solid ${BORDER}`,
            }}
          >
            <h1 style={{ ...primaryStyle, margin: 0 }}>{content.primary}</h1>
          </div>
          <div
            style={{
              padding: "60px 48px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <p style={{ ...secondaryStyle, margin: 0 }}>{content.secondary}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSlider = (
    label: string,
    which: "primary" | "secondary",
    field: "size" | "weight" | "lineHeight",
    min: number,
    max: number,
    step: number
  ) => {
    const value = config[which][field];
    return (
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={smallCaps}>{label}</span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: TEXT_MUTED,
              letterSpacing: "0.02em",
            }}
          >
            {field === "lineHeight" ? value.toFixed(1) : value}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => updateConfig(which, field, parseFloat(e.target.value))}
          style={{
            width: "100%",
            height: 1,
            appearance: "none",
            WebkitAppearance: "none",
            background: `linear-gradient(to right, ${GOLD_DIM} 0%, ${GOLD_DIM} ${((value - min) / (max - min)) * 100}%, ${BORDER_SUBTLE} ${((value - min) / (max - min)) * 100}%, ${BORDER_SUBTLE} 100%)`,
            outline: "none",
            cursor: "pointer",
            borderRadius: 0,
          }}
        />
      </div>
    );
  };

  const renderSidebar = () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: "32px 28px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <span
          style={{
            ...smallCaps,
            fontSize: 13,
            color: GOLD,
          }}
        >
          Font Atelier
        </span>
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: TEXT_MUTED,
            fontSize: 20,
            cursor: "pointer",
            padding: 4,
            ...(typeof window !== "undefined" && window.innerWidth < 900
              ? { display: "block" }
              : {}),
          }}
          className="mobile-close"
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ ...smallCaps, marginBottom: 14 }}>Current Pair</p>
        <div
          style={{
            padding: "16px 20px",
            background: BG_DEEP,
            border: `1px solid ${BORDER}`,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span style={{ ...smallCaps, fontSize: 9, color: TEXT_MUTED }}>
              Primary
            </span>
            <button
              onClick={() => toggleLock("primary")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: locks.primary ? GOLD : TEXT_MUTED,
                padding: 0,
                transition: "color 0.3s ease",
              }}
              title={locks.primary ? "Unlock primary" : "Lock primary"}
            >
              {locks.primary ? "🔒" : "🔓"}
            </button>
          </div>
          <p
            style={{
              fontFamily: `"${fontPair.primary}", serif`,
              fontSize: 16,
              fontWeight: 500,
              color: TEXT_PRIMARY,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {fontPair.primary}
          </p>
        </div>
        <div
          style={{
            padding: "16px 20px",
            background: BG_DEEP,
            border: `1px solid ${BORDER}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span style={{ ...smallCaps, fontSize: 9, color: TEXT_MUTED }}>
              Secondary
            </span>
            <button
              onClick={() => toggleLock("secondary")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: locks.secondary ? GOLD : TEXT_MUTED,
                padding: 0,
                transition: "color 0.3s ease",
              }}
              title={locks.secondary ? "Unlock secondary" : "Lock secondary"}
            >
              {locks.secondary ? "🔒" : "🔓"}
            </button>
          </div>
          <p
            style={{
              fontFamily: `"${fontPair.secondary}", sans-serif`,
              fontSize: 15,
              fontWeight: 400,
              color: TEXT_PRIMARY,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {fontPair.secondary}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        <button
          onClick={shuffle}
          onMouseEnter={() => setHoveredBtn("shuffle")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            ...buttonBase,
            flex: 1,
            background:
              hoveredBtn === "shuffle"
                ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`
                : "transparent",
            color: hoveredBtn === "shuffle" ? BG_DEEP : GOLD,
            borderColor: GOLD_DIM,
          }}
        >
          Shuffle Fonts
        </button>
        <button
          onClick={saveSnapshot}
          onMouseEnter={() => setHoveredBtn("save")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            ...buttonBase,
            flex: 1,
            background:
              hoveredBtn === "save"
                ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`
                : "transparent",
            color: hoveredBtn === "save" ? BG_DEEP : GOLD,
            borderColor: GOLD_DIM,
          }}
        >
          Save
        </button>
      </div>

      <GoldDivider />

      <div style={{ marginBottom: 28 }}>
        <p style={{ ...smallCaps, marginBottom: 14 }}>Layout</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {LAYOUTS.map((l) => (
            <button
              key={l.key}
              onClick={() => setLayout(l.key)}
              onMouseEnter={() => setHoveredBtn(`layout-${l.key}`)}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                background:
                  layout === l.key
                    ? GOLD_GLOW
                    : hoveredBtn === `layout-${l.key}`
                    ? "rgba(255,255,255,0.02)"
                    : "transparent",
                border: "none",
                borderLeft:
                  layout === l.key
                    ? `2px solid ${GOLD}`
                    : `2px solid transparent`,
                color: layout === l.key ? GOLD : TEXT_SECONDARY,
                padding: "10px 16px",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
                fontSize: 12,
                letterSpacing: "0.04em",
                transition: "all 0.25s ease",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={{ ...smallCaps, marginBottom: 14 }}>Content</p>
        <div style={{ display: "flex", gap: 6 }}>
          {FILLS.map((f, i) => (
            <button
              key={f}
              onClick={() => setContentFill(f)}
              onMouseEnter={() => setHoveredBtn(`fill-${f}`)}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                flex: 1,
                background:
                  contentFill === f
                    ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`
                    : "transparent",
                border: `1px solid ${contentFill === f ? GOLD : BORDER}`,
                color: contentFill === f ? BG_DEEP : TEXT_MUTED,
                padding: "8px 0",
                cursor: "pointer",
                fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
                fontSize: 10,
                fontVariant: "all-small-caps",
                letterSpacing: "0.15em",
                fontWeight: contentFill === f ? 600 : 400,
                transition: "all 0.3s ease",
              }}
            >
              {["I", "II", "III"][i]}
            </button>
          ))}
        </div>
      </div>

      <GoldDivider />

      <div style={{ marginBottom: 28 }}>
        <p style={{ ...smallCaps, marginBottom: 18 }}>Primary Typography</p>
        {renderSlider("Size", "primary", "size", 12, 120, 1)}
        {renderSlider("Weight", "primary", "weight", 100, 900, 100)}
        {renderSlider("Leading", "primary", "lineHeight", 0.8, 3.0, 0.1)}
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={{ ...smallCaps, marginBottom: 18 }}>Secondary Typography</p>
        {renderSlider("Size", "secondary", "size", 12, 120, 1)}
        {renderSlider("Weight", "secondary", "weight", 100, 900, 100)}
        {renderSlider("Leading", "secondary", "lineHeight", 0.8, 3.0, 0.1)}
      </div>

      {snapshots.length > 0 && (
        <>
          <GoldDivider />
          <div>
            <p style={{ ...smallCaps, marginBottom: 14 }}>
              Saved ({snapshots.length})
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: BG_DEEP,
                    border: `1px solid ${BORDER_SUBTLE}`,
                    transition: "border-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = BORDER)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = BORDER_SUBTLE)
                  }
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: `"${snap.fontPair.primary}", serif`,
                        fontSize: 13,
                        fontWeight: 500,
                        color: TEXT_PRIMARY,
                        margin: "0 0 2px 0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {snap.fontPair.primary}
                    </p>
                    <p
                      style={{
                        fontFamily: `"${snap.fontPair.secondary}", sans-serif`,
                        fontSize: 11,
                        color: TEXT_MUTED,
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {snap.fontPair.secondary}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
                    <button
                      onClick={() => loadSnapshot(snap)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${BORDER}`,
                        color: GOLD_DIM,
                        padding: "4px 10px",
                        cursor: "pointer",
                        fontSize: 9,
                        fontVariant: "all-small-caps",
                        letterSpacing: "0.15em",
                        fontFamily:
                          "'Manrope', 'Helvetica Neue', sans-serif",
                        transition: "all 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = GOLD;
                        e.currentTarget.style.color = BG_DEEP;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = GOLD_DIM;
                      }}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => removeSnapshot(snap.id)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${BORDER_SUBTLE}`,
                        color: TEXT_MUTED,
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: 10,
                        fontFamily:
                          "'Manrope', 'Helvetica Neue', sans-serif",
                        transition: "all 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(200,80,80,0.4)";
                        e.currentTarget.style.color = "rgba(200,80,80,0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = BORDER_SUBTLE;
                        e.currentTarget.style.color = TEXT_MUTED;
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG_DEEP,
        color: TEXT_PRIMARY,
        fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
        display: "flex",
        position: "relative",
      }}
    >
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          background: ${GOLD};
          border: none;
          cursor: pointer;
          margin-top: -4px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 10px;
          height: 10px;
          background: ${GOLD};
          border: none;
          border-radius: 0;
          cursor: pointer;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 1px;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-track {
          height: 1px;
          cursor: pointer;
        }
        @media (max-width: 899px) {
          .luxury-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            z-index: 1000 !important;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) !important;
          }
          .luxury-sidebar.open {
            transform: translateX(0) !important;
          }
          .luxury-sidebar .mobile-close {
            display: block !important;
          }
          .luxury-main {
            margin-left: 0 !important;
          }
          .luxury-mobile-toggle {
            display: flex !important;
          }
          .luxury-preview-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 900px) {
          .luxury-mobile-toggle {
            display: none !important;
          }
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: ${BORDER} transparent;
        }
        *::-webkit-scrollbar {
          width: 4px;
        }
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        *::-webkit-scrollbar-thumb {
          background: ${BORDER};
        }
      `}</style>

      <aside
        className={`luxury-sidebar ${sidebarOpen ? "open" : ""}`}
        style={{
          width: 340,
          minWidth: 340,
          maxWidth: 340,
          background: BG_PANEL,
          borderRight: `1px solid ${BORDER}`,
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
          overflowX: "hidden",
          flexShrink: 0,
        }}
      >
        {renderSidebar()}
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 999,
          }}
        />
      )}

      <main
        className="luxury-main"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 32px",
            borderBottom: `1px solid ${BORDER_SUBTLE}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className="luxury-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: `1px solid ${BORDER}`,
                color: GOLD,
                width: 36,
                height: 36,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ☰
            </button>
            <div>
              <p
                style={{
                  margin: 0,
                  fontFamily: `"${fontPair.primary}", serif`,
                  fontSize: 15,
                  fontWeight: 500,
                  color: TEXT_PRIMARY,
                  letterSpacing: "0.02em",
                  transition: "all 0.3s ease",
                  opacity: fontsReady ? 1 : 0,
                }}
              >
                {fontPair.primary}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: `"${fontPair.secondary}", sans-serif`,
                  fontSize: 12,
                  color: TEXT_MUTED,
                  letterSpacing: "0.04em",
                  transition: "all 0.3s ease",
                  opacity: fontsReady ? 1 : 0,
                }}
              >
                {fontPair.secondary}
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: fontsReady ? GOLD : TEXT_MUTED,
                transition: "background 0.4s ease",
              }}
            />
            <span
              style={{
                ...smallCaps,
                fontSize: 9,
                color: fontsReady ? GOLD_DIM : TEXT_MUTED,
              }}
            >
              {fontsReady ? "Ready" : "Loading"}
            </span>
          </div>
        </header>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 960,
              background: BG_CARD,
              border: `1px solid ${BORDER_SUBTLE}`,
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 0 80px rgba(0,0,0,0.3), inset 0 1px 0 ${BORDER}`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -1,
                left: "20%",
                right: "20%",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${GOLD_DIM}, transparent)`,
                opacity: 0.6,
              }}
            />

            <div className={layout === "split-screen" ? "luxury-preview-split" : ""}>
              {renderPreview()}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: -1,
                left: "30%",
                right: "30%",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${GOLD_DIM}, transparent)`,
                opacity: 0.3,
              }}
            />
          </div>
        </div>

        <footer
          style={{
            padding: "16px 32px",
            borderTop: `1px solid ${BORDER_SUBTLE}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ ...smallCaps, fontSize: 9, color: TEXT_MUTED }}>
            Font Pair Matcher &mdash; Luxury Edition
          </span>
        </footer>
      </main>
    </div>
  );
}

export default Luxury;
