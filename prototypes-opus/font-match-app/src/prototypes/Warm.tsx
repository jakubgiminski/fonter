import { useFontMatch } from "../hooks/useFontMatch";
import type { LayoutType } from "../hooks/useFontMatch";

const authors = ["Lucas", "Rowling", "Tolkien", "Martin"] as const;
const layouts: LayoutType[] = ["hero", "brief", "essay", "quote"];

function Warm() {
  const {
    primary,
    secondary,
    layout,
    author,
    content,
    shuffle,
    setLayout,
    setAuthor,
  } = useFontMatch();

  const renderHero = () => (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
          fontSize: "clamp(2.8rem, 6vw, 4.2rem)",
          fontWeight: 700,
          color: "#111",
          margin: "0 0 1rem",
          lineHeight: 1.1,
        }}
      >
        {content.title}
      </h1>
      <p
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 400,
          color: "#555",
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {content.subtitle}
      </p>
    </div>
  );

  const renderBrief = () => (
    <div style={{ padding: "3rem 2rem", maxWidth: 700, margin: "0 auto" }}>
      <h1
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
          fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
          fontWeight: 700,
          color: "#111",
          margin: "0 0 0.5rem",
          lineHeight: 1.2,
        }}
      >
        {content.title}
      </h1>
      <h2
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
          fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
          fontWeight: 300,
          color: "#555",
          margin: "0 0 1.5rem",
          lineHeight: 1.2,
        }}
      >
        {content.subtitle}
      </h2>
      <p
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
          fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
          fontWeight: 300,
          color: "#333",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {content.paragraph1}
      </p>
    </div>
  );

  const renderEssay = () => (
    <div style={{ padding: "3rem 2rem", maxWidth: 700, margin: "0 auto" }}>
      <h1
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
          fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
          fontWeight: 300,
          color: "#111",
          margin: "0 0 1.5rem",
          lineHeight: 1.2,
        }}
      >
        {content.title}
      </h1>
      <p
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
          fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
          fontWeight: 300,
          color: "#333",
          margin: "0 0 1.2rem",
          lineHeight: 1.6,
        }}
      >
        {content.paragraph1}
      </p>
      <p
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
          fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
          fontWeight: 300,
          color: "#333",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {content.paragraph2}
      </p>
    </div>
  );

  const renderQuote = () => (
    <div style={{ padding: "4rem 2rem", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
      <p
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
          fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: "#111",
          margin: "0 0 1.5rem",
          lineHeight: 1.3,
        }}
      >
        {content.paragraph1.split(". ")[0]}.
      </p>
      <p
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "#999",
          margin: 0,
          lineHeight: 1.3,
          textTransform: "uppercase" as const,
          letterSpacing: "0.08em",
        }}
      >
        — {content.subtitle}
      </p>
    </div>
  );

  const renderPreview = () => {
    if (layout === "hero") return renderHero();
    if (layout === "brief") return renderBrief();
    if (layout === "essay") return renderEssay();
    if (layout === "quote") return renderQuote();
    return null;
  };

  return (
    <>
      <style>{`
        .warm-root {
          min-height: 100vh;
          background: #F5F5F5;
          font-family: system-ui, -apple-system, sans-serif;
          color: #111;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow-x: hidden;
        }
        .warm-root * {
          box-sizing: border-box;
        }
        .warm-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 780px;
          padding: 2rem 1rem;
        }
        .warm-page {
          width: 100%;
          max-width: 720px;
          height: clamp(200px, calc(100vh - 180px), 500px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .warm-page > div {
          width: 100%;
          max-height: 100%;
        }
        .warm-controls-inner {
          width: 100%;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          margin-top: 0;
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.03);
        }
        .warm-section {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .warm-pill {
          border: none;
          background: transparent;
          color: #999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          padding: 0.35rem 0.8rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .warm-pill:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #111;
        }
        .warm-pill.active {
          background: #111;
          color: #FFF;
        }
        .warm-font-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: #777;
          flex-shrink: 0;
        }
        .warm-font-label {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .warm-lock-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 2px;
          font-size: 0.85rem;
          line-height: 1;
          opacity: 0.4;
          transition: opacity 0.2s ease;
        }
        .warm-lock-btn:hover {
          opacity: 0.8;
        }
        .warm-lock-btn.locked {
          opacity: 1;
        }
        .warm-shuffle {
          border: none;
          background: #111;
          color: #FFF;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.45rem 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          margin-left: auto;
        }
        .warm-shuffle:hover {
          background: #333;
        }
        .warm-shuffle:active {
          transform: scale(0.97);
        }
        .warm-divider {
          width: 1px;
          height: 24px;
          background: rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .warm-root {
            justify-content: flex-start;
          }
          .warm-center {
            flex: 1;
            padding: 1.5rem 0.75rem 0;
          }
          .warm-page {
            height: clamp(180px, calc(100vh - 200px), 420px);
          }
          .warm-controls-wrap {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 10;
            background: #FFFFFF;
            box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.08);
            border-radius: 14px 14px 0 0;
          }
          .warm-controls-inner {
            padding: 0.8rem 1rem;
            gap: 0.6rem;
            margin-top: 0;
          }
          .warm-divider {
            display: none;
          }
          .warm-shuffle {
            width: 100%;
            text-align: center;
            margin-left: 0;
          }
        }
      `}</style>
      <div className="warm-root">
        <div className="warm-center">
          <div className="warm-page">{renderPreview()}</div>

          <div className="warm-controls-wrap">
            <div className="warm-controls-inner">
              <div className="warm-section">
                {layouts.map((l) => (
                  <button
                    key={l}
                    className={`warm-pill${layout === l ? " active" : ""}`}
                    onClick={() => setLayout(l)}
                  >
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>

              <div className="warm-divider" />

              <div className="warm-section">
                {authors.map((a) => (
                  <button
                    key={a}
                    className={`warm-pill${author === a ? " active" : ""}`}
                    onClick={() => setAuthor(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>

              <div className="warm-divider" />

              <button className="warm-shuffle" onClick={shuffle}>
                Shuffle
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Warm;
