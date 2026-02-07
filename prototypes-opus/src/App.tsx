import { Routes, Route, Link, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

const Brutalist = lazy(() => import("./prototypes/Brutalist"));
const Luxury = lazy(() => import("./prototypes/Luxury"));
const RetroFuture = lazy(() => import("./prototypes/RetroFuture"));
const Organic = lazy(() => import("./prototypes/Organic"));
const ArtDeco = lazy(() => import("./prototypes/ArtDeco"));

const prototypes = [
  { path: "/brutalist", name: "Brutalist", tagline: "Raw editorial meets Swiss punk", color: "#ff0000", bg: "#f5f0eb", textColor: "#000" },
  { path: "/luxury", name: "Luxury", tagline: "Refined dark elegance with gold accents", color: "#c9a84c", bg: "#0d0d0d", textColor: "#fff" },
  { path: "/retro-future", name: "Retro Future", tagline: "Synthwave neon sci-fi terminal", color: "#00fff5", bg: "#0a0a14", textColor: "#fff" },
  { path: "/organic", name: "Organic", tagline: "Warm, earthy, handcrafted naturalism", color: "#7d8c6e", bg: "#faf7f2", textColor: "#3d3027" },
  { path: "/art-deco", name: "Art Deco", tagline: "1920s geometric glamour", color: "#d4af37", bg: "#0d1b2a", textColor: "#f5deb3" },
];

function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#eee", fontFamily: "'Manrope', 'Helvetica Neue', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&family=Instrument+Serif&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 64 }}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 400, lineHeight: 1, margin: 0, letterSpacing: "-0.02em" }}>
            Font Match
          </h1>
          <p style={{ fontSize: 18, color: "#888", marginTop: 16, maxWidth: 480, lineHeight: 1.6, fontWeight: 300 }}>
            Five design prototypes for a font pair discovery tool. Each one is a distinct aesthetic interpretation of the same functionality.
          </p>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {prototypes.map((p, i) => (
            <Link
              key={p.path}
              to={p.path}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr auto",
                alignItems: "center",
                gap: 24,
                padding: "24px 32px",
                background: p.bg,
                color: p.textColor,
                textDecoration: "none",
                border: `1px solid ${p.color}33`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = p.color;
                e.currentTarget.style.transform = "translateX(8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${p.color}33`;
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: p.color, opacity: 0.6 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>{p.name}</div>
                <div style={{ fontSize: 14, opacity: 0.6, marginTop: 4, fontWeight: 300 }}>{p.tagline}</div>
              </div>
              <span style={{ fontSize: 24, color: p.color, opacity: 0.4 }}>&rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#666", fontFamily: "monospace", fontSize: 14 }}>
      Loading prototype...
    </div>
  );
}

function BackButton() {
  const location = useLocation();
  if (location.pathname === "/") return null;

  return (
    <Link
      to="/"
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 10000,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        textDecoration: "none",
        padding: "8px 16px",
        fontSize: 13,
        fontFamily: "monospace",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      &larr; All Prototypes
    </Link>
  );
}

export default function App() {
  return (
    <>
      <BackButton />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/brutalist" element={<Brutalist />} />
          <Route path="/luxury" element={<Luxury />} />
          <Route path="/retro-future" element={<RetroFuture />} />
          <Route path="/organic" element={<Organic />} />
          <Route path="/art-deco" element={<ArtDeco />} />
        </Routes>
      </Suspense>
    </>
  );
}
