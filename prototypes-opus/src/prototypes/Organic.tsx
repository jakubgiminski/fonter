import React from "react";
import { useFontMatcher } from "../shared/useFontMatcher";
import { CONTENT_FILLS } from "../shared/contentFills";
import type { LayoutType, ContentFillKey, SavedSnapshot } from "../shared/types";

const LAYOUTS: { key: LayoutType; label: string }[] = [
  { key: "title-subtitle", label: "Title & Subtitle" },
  { key: "title-paragraph", label: "Title & Paragraph" },
  { key: "hero-card", label: "Hero Card" },
  { key: "editorial", label: "Editorial" },
  { key: "split-screen", label: "Split Screen" },
];

const FILLS: { key: ContentFillKey; label: string }[] = [
  { key: "fill-1", label: "I" },
  { key: "fill-2", label: "II" },
  { key: "fill-3", label: "III" },
];

const colors = {
  bg: "#faf7f2",
  bgWarm: "#f5f0e8",
  sage: "#7d8c6e",
  sageDark: "#5e6d52",
  sageLight: "#a8b89a",
  sagePale: "#e8ede4",
  terracotta: "#c17850",
  terracottaDark: "#a8613d",
  terracottaLight: "#d4a088",
  brown: "#8b7355",
  brownLight: "#b5a48e",
  brownDark: "#6b5740",
  text: "#3d3529",
  textMuted: "#7a6e5f",
  white: "#fffdf9",
  border: "#e2dbd0",
  cardShadow: "0 4px 20px rgba(139, 115, 85, 0.08), 0 1px 4px rgba(139, 115, 85, 0.06)",
  softShadow: "0 2px 12px rgba(139, 115, 85, 0.06)",
};

const s = {
  container: {
    minHeight: "100vh",
    background: colors.bg,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: colors.text,
    padding: "0",
  } as React.CSSProperties,

  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 24px",
  } as React.CSSProperties,

  header: {
    textAlign: "center" as const,
    marginBottom: "40px",
  } as React.CSSProperties,

  title: {
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
    color: colors.sage,
    marginBottom: "8px",
  } as React.CSSProperties,

  subtitle: {
    fontSize: "12px",
    color: colors.textMuted,
    letterSpacing: "1px",
  } as React.CSSProperties,

  fontNames: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap" as const,
    marginBottom: "32px",
  } as React.CSSProperties,

  fontNamePrimary: {
    fontSize: "28px",
    fontWeight: 600,
    color: colors.brownDark,
    letterSpacing: "-0.5px",
  } as React.CSSProperties,

  fontNameDivider: {
    fontSize: "20px",
    color: colors.brownLight,
    fontWeight: 300,
  } as React.CSSProperties,

  fontNameSecondary: {
    fontSize: "22px",
    fontWeight: 400,
    color: colors.sage,
  } as React.CSSProperties,

  controlsRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap" as const,
    marginBottom: "20px",
  } as React.CSSProperties,

  pill: (active: boolean) =>
    ({
      padding: "8px 18px",
      borderRadius: "100px",
      border: `1.5px solid ${active ? colors.sage : colors.border}`,
      background: active ? colors.sagePale : colors.white,
      color: active ? colors.sageDark : colors.textMuted,
      fontSize: "13px",
      fontWeight: active ? 600 : 400,
      cursor: "pointer",
      transition: "all 0.25s ease",
      letterSpacing: "0.3px",
      fontFamily: "inherit",
    }) as React.CSSProperties,

  fillPill: (active: boolean) =>
    ({
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: `1.5px solid ${active ? colors.terracotta : colors.border}`,
      background: active ? colors.terracottaLight + "33" : colors.white,
      color: active ? colors.terracottaDark : colors.textMuted,
      fontSize: "12px",
      fontWeight: active ? 700 : 400,
      cursor: "pointer",
      transition: "all 0.25s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "inherit",
    }) as React.CSSProperties,

  previewCard: {
    background: colors.white,
    borderRadius: "20px",
    padding: "48px",
    boxShadow: colors.cardShadow,
    border: `1px solid ${colors.border}`,
    marginBottom: "32px",
    minHeight: "300px",
    transition: "opacity 0.3s ease",
  } as React.CSSProperties,

  actionRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap" as const,
    marginBottom: "32px",
  } as React.CSSProperties,

  shuffleBtn: {
    padding: "12px 32px",
    borderRadius: "100px",
    border: "none",
    background: colors.terracotta,
    color: colors.white,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.25s ease",
    letterSpacing: "0.5px",
    fontFamily: "inherit",
    boxShadow: "0 2px 8px rgba(193, 120, 80, 0.25)",
  } as React.CSSProperties,

  saveBtn: {
    padding: "12px 28px",
    borderRadius: "100px",
    border: `1.5px solid ${colors.sage}`,
    background: "transparent",
    color: colors.sage,
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.25s ease",
    letterSpacing: "0.5px",
    fontFamily: "inherit",
  } as React.CSSProperties,

  lockBtn: (locked: boolean) =>
    ({
      padding: "10px 20px",
      borderRadius: "100px",
      border: `1.5px solid ${locked ? colors.brown : colors.border}`,
      background: locked ? colors.brownLight + "22" : colors.white,
      color: locked ? colors.brownDark : colors.textMuted,
      fontSize: "13px",
      cursor: "pointer",
      transition: "all 0.25s ease",
      fontFamily: "inherit",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    }) as React.CSSProperties,

  configSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "40px",
  } as React.CSSProperties,

  configSectionMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
    marginBottom: "40px",
  } as React.CSSProperties,

  configCard: {
    background: colors.white,
    borderRadius: "16px",
    padding: "24px",
    boxShadow: colors.softShadow,
    border: `1px solid ${colors.border}`,
  } as React.CSSProperties,

  configTitle: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: colors.textMuted,
    marginBottom: "20px",
  } as React.CSSProperties,

  sliderGroup: {
    marginBottom: "16px",
  } as React.CSSProperties,

  sliderLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
    fontSize: "12px",
    color: colors.textMuted,
  } as React.CSSProperties,

  sliderValue: {
    fontSize: "12px",
    fontWeight: 600,
    color: colors.brown,
    fontVariantNumeric: "tabular-nums",
  } as React.CSSProperties,

  slider: (accent: string) =>
    ({
      width: "100%",
      height: "4px",
      borderRadius: "2px",
      appearance: "none" as const,
      WebkitAppearance: "none" as const,
      background: colors.border,
      outline: "none",
      cursor: "pointer",
      accentColor: accent,
    }) as React.CSSProperties,

  snapshotsSection: {
    marginBottom: "40px",
  } as React.CSSProperties,

  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: colors.textMuted,
    marginBottom: "16px",
    textAlign: "center" as const,
  } as React.CSSProperties,

  snapshotCard: {
    background: colors.white,
    borderRadius: "14px",
    padding: "16px 20px",
    boxShadow: colors.softShadow,
    border: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "10px",
    transition: "all 0.2s ease",
  } as React.CSSProperties,

  snapshotFonts: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,

  snapshotPrimary: {
    fontSize: "14px",
    fontWeight: 600,
    color: colors.brownDark,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,

  snapshotSecondary: {
    fontSize: "12px",
    color: colors.textMuted,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,

  snapshotMeta: {
    fontSize: "10px",
    color: colors.brownLight,
    letterSpacing: "0.5px",
  } as React.CSSProperties,

  snapshotActions: {
    display: "flex",
    gap: "6px",
    flexShrink: 0,
  } as React.CSSProperties,

  smallBtn: (variant: "load" | "remove") =>
    ({
      padding: "6px 14px",
      borderRadius: "100px",
      border: `1px solid ${variant === "load" ? colors.sage : colors.terracottaLight}`,
      background: "transparent",
      color: variant === "load" ? colors.sage : colors.terracottaLight,
      fontSize: "11px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
    }) as React.CSSProperties,

  splitContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    alignItems: "center",
  } as React.CSSProperties,

  splitContainerMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
  } as React.CSSProperties,

  heroCardInner: {
    background: colors.bgWarm,
    borderRadius: "16px",
    padding: "40px",
    border: `1px solid ${colors.border}`,
  } as React.CSSProperties,

  dropCap: {
    float: "left" as const,
    fontSize: "3.2em",
    lineHeight: "0.8",
    paddingRight: "8px",
    paddingTop: "6px",
    color: colors.terracotta,
    fontWeight: 700,
  } as React.CSSProperties,

  decorLine: {
    width: "48px",
    height: "2px",
    background: colors.terracottaLight,
    borderRadius: "1px",
    margin: "16px 0",
  } as React.CSSProperties,

  leaf: {
    display: "inline-block",
    color: colors.sageLight,
    fontSize: "16px",
    marginRight: "8px",
  } as React.CSSProperties,
};

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function LayoutPreview({
  layout,
  primaryText,
  secondaryText,
  primaryFont,
  secondaryFont,
  config,
  isMobile,
}: {
  layout: LayoutType;
  primaryText: string;
  secondaryText: string;
  primaryFont: string;
  secondaryFont: string;
  config: { primary: { size: number; weight: number; lineHeight: number }; secondary: { size: number; weight: number; lineHeight: number } };
  isMobile: boolean;
}) {
  const pStyle: React.CSSProperties = {
    fontFamily: `${primaryFont}, serif`,
    fontSize: `${config.primary.size}px`,
    fontWeight: config.primary.weight,
    lineHeight: config.primary.lineHeight,
    color: colors.brownDark,
    margin: 0,
    wordBreak: "break-word",
  };

  const sStyle: React.CSSProperties = {
    fontFamily: `${secondaryFont}, sans-serif`,
    fontSize: `${config.secondary.size}px`,
    fontWeight: config.secondary.weight,
    lineHeight: config.secondary.lineHeight,
    color: colors.textMuted,
    margin: 0,
    wordBreak: "break-word",
  };

  if (layout === "title-subtitle") {
    return (
      <div style={{ textAlign: "center" }}>
        <h1 style={pStyle}>{primaryText}</h1>
        <div style={s.decorLine} />
        <p style={{ ...sStyle, marginTop: "12px" }}>{secondaryText}</p>
      </div>
    );
  }

  if (layout === "title-paragraph") {
    return (
      <div>
        <h1 style={pStyle}>{primaryText}</h1>
        <div style={s.decorLine} />
        <p style={{ ...sStyle, marginTop: "16px" }}>{secondaryText}</p>
      </div>
    );
  }

  if (layout === "hero-card") {
    return (
      <div>
        <h1 style={{ ...pStyle, textAlign: "center", marginBottom: "24px" }}>{primaryText}</h1>
        <div style={s.heroCardInner}>
          <p style={sStyle}>{secondaryText}</p>
        </div>
      </div>
    );
  }

  if (layout === "editorial") {
    const firstChar = secondaryText.charAt(0);
    const rest = secondaryText.slice(1);
    return (
      <div>
        <h1 style={{ ...pStyle, borderBottom: `1.5px solid ${colors.border}`, paddingBottom: "16px", marginBottom: "20px" }}>
          {primaryText}
        </h1>
        <p style={sStyle}>
          <span style={{ ...s.dropCap, fontFamily: `${primaryFont}, serif` }}>{firstChar}</span>
          {rest}
        </p>
      </div>
    );
  }

  if (layout === "split-screen") {
    return (
      <div style={isMobile ? s.splitContainerMobile : s.splitContainer}>
        <div>
          <h1 style={pStyle}>{primaryText}</h1>
          <div style={s.decorLine} />
        </div>
        <div>
          <p style={sStyle}>{secondaryText}</p>
        </div>
      </div>
    );
  }

  return null;
}

function ConfigPanel({
  which,
  label,
  config,
  accent,
  updateConfig,
}: {
  which: "primary" | "secondary";
  label: string;
  config: { size: number; weight: number; lineHeight: number };
  accent: string;
  updateConfig: (which: "primary" | "secondary", field: "size" | "weight" | "lineHeight", value: number) => void;
}) {
  return (
    <div style={s.configCard}>
      <div style={s.configTitle}>
        <span style={s.leaf}>\u2E3B</span> {label}
      </div>
      <div style={s.sliderGroup}>
        <div style={s.sliderLabel}>
          <span>Size</span>
          <span style={s.sliderValue}>{config.size}px</span>
        </div>
        <input
          type="range"
          min={12}
          max={120}
          value={config.size}
          onChange={(e) => updateConfig(which, "size", Number(e.target.value))}
          style={s.slider(accent)}
        />
      </div>
      <div style={s.sliderGroup}>
        <div style={s.sliderLabel}>
          <span>Weight</span>
          <span style={s.sliderValue}>{config.weight}</span>
        </div>
        <input
          type="range"
          min={100}
          max={900}
          step={100}
          value={config.weight}
          onChange={(e) => updateConfig(which, "weight", Number(e.target.value))}
          style={s.slider(accent)}
        />
      </div>
      <div style={s.sliderGroup}>
        <div style={s.sliderLabel}>
          <span>Line Height</span>
          <span style={s.sliderValue}>{config.lineHeight.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min={0.8}
          max={3.0}
          step={0.1}
          value={config.lineHeight}
          onChange={(e) => updateConfig(which, "lineHeight", Number(e.target.value))}
          style={s.slider(accent)}
        />
      </div>
    </div>
  );
}

function SnapshotItem({
  snapshot,
  onLoad,
  onRemove,
}: {
  snapshot: SavedSnapshot;
  onLoad: () => void;
  onRemove: () => void;
}) {
  return (
    <div style={s.snapshotCard}>
      <div style={s.snapshotFonts}>
        <div style={s.snapshotPrimary}>{snapshot.fontPair.primary}</div>
        <div style={s.snapshotSecondary}>{snapshot.fontPair.secondary}</div>
        <div style={s.snapshotMeta}>{snapshot.layout}</div>
      </div>
      <div style={s.snapshotActions}>
        <button style={s.smallBtn("load")} onClick={onLoad}>
          Load
        </button>
        <button style={s.smallBtn("remove")} onClick={onRemove}>
          \u00D7
        </button>
      </div>
    </div>
  );
}

export default function Organic() {
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

  const isMobile = useIsMobile();

  const content = CONTENT_FILLS[layout][contentFill];

  return (
    <div style={s.container}>
      <div style={{ ...s.inner, padding: isMobile ? "24px 16px" : "40px 24px" }}>
        <div style={s.header}>
          <div style={s.title}>Font Pair Matcher</div>
          <div style={s.subtitle}>Discover harmonious type pairings</div>
        </div>

        <div style={s.fontNames}>
          <span style={{ ...s.fontNamePrimary, fontFamily: `${fontPair.primary}, serif` }}>
            {fontPair.primary}
          </span>
          <span style={s.fontNameDivider}>&</span>
          <span style={{ ...s.fontNameSecondary, fontFamily: `${fontPair.secondary}, sans-serif` }}>
            {fontPair.secondary}
          </span>
        </div>

        <div style={s.controlsRow}>
          {LAYOUTS.map((l) => (
            <button key={l.key} style={s.pill(layout === l.key)} onClick={() => setLayout(l.key)}>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ ...s.controlsRow, marginBottom: "28px" }}>
          <span style={{ fontSize: "11px", color: colors.textMuted, letterSpacing: "1px", textTransform: "uppercase" as const, marginRight: "4px" }}>
            Content
          </span>
          {FILLS.map((f) => (
            <button key={f.key} style={s.fillPill(contentFill === f.key)} onClick={() => setContentFill(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ ...s.previewCard, opacity: fontsReady ? 1 : 0.4, padding: isMobile ? "28px 20px" : "48px" }}>
          <LayoutPreview
            layout={layout}
            primaryText={content.primary}
            secondaryText={content.secondary}
            primaryFont={fontPair.primary}
            secondaryFont={fontPair.secondary}
            config={config}
            isMobile={isMobile}
          />
        </div>

        <div style={s.actionRow}>
          <button style={s.lockBtn(locks.primary)} onClick={() => toggleLock("primary")}>
            {locks.primary ? "\uD83D\uDD12" : "\uD83D\uDD13"} Primary
          </button>
          <button
            style={s.shuffleBtn}
            onClick={shuffle}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = colors.terracottaDark;
              (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = colors.terracotta;
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Shuffle Fonts
          </button>
          <button style={s.lockBtn(locks.secondary)} onClick={() => toggleLock("secondary")}>
            {locks.secondary ? "\uD83D\uDD12" : "\uD83D\uDD13"} Secondary
          </button>
        </div>

        <div style={s.actionRow}>
          <button
            style={s.saveBtn}
            onClick={saveSnapshot}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = colors.sagePale;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "transparent";
            }}
          >
            Save Snapshot
          </button>
        </div>

        <div style={isMobile ? s.configSectionMobile : s.configSection}>
          <ConfigPanel
            which="primary"
            label="Primary Font"
            config={config.primary}
            accent={colors.brown}
            updateConfig={updateConfig}
          />
          <ConfigPanel
            which="secondary"
            label="Secondary Font"
            config={config.secondary}
            accent={colors.sage}
            updateConfig={updateConfig}
          />
        </div>

        {snapshots.length > 0 && (
          <div style={s.snapshotsSection}>
            <div style={s.sectionLabel}>Saved Snapshots</div>
            {snapshots.map((snap) => (
              <SnapshotItem
                key={snap.id}
                snapshot={snap}
                onLoad={() => loadSnapshot(snap)}
                onRemove={() => removeSnapshot(snap.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
