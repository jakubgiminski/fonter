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
    locked,
    fonts,
    shuffle,
    setLayout,
    setAuthor,
    toggleLock,
    setPrimary,
    setSecondary,
  } = useFontMatch();

  const renderHero = () => (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1
        className="warm-hero-title"
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
          fontWeight: 700,
          color: "#111",
          margin: "0 0 1rem",
          lineHeight: 1.1,
        }}
      >
        {content.title}
      </h1>
      <p
        className="warm-hero-subtitle"
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
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
        className="warm-brief-title"
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
          fontWeight: 700,
          color: "#111",
          margin: "0 0 0.5rem",
          lineHeight: 1.2,
        }}
      >
        {content.title}
      </h1>
      <h2
        className="warm-brief-subtitle"
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
          fontWeight: 300,
          color: "#555",
          margin: "0 0 1.5rem",
          lineHeight: 1.2,
        }}
      >
        {content.subtitle}
      </h2>
      <p
        className="warm-body-text"
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
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
        className="warm-essay-title"
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
          fontWeight: 300,
          color: "#111",
          margin: "0 0 1.5rem",
          lineHeight: 1.2,
        }}
      >
        {content.title}
      </h1>
      <p
        className="warm-body-text"
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
          fontWeight: 300,
          color: "#333",
          margin: "0 0 1.2rem",
          lineHeight: 1.6,
        }}
      >
        {content.paragraph1}
      </p>
      <p
        className="warm-body-text"
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
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
        className="warm-quote-text"
        style={{
          fontFamily: `"${secondary.family}", ${secondary.category}`,
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
        className="warm-quote-attr"
        style={{
          fontFamily: `"${primary.family}", ${primary.category}`,
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
          max-width: 820px;
          padding: 2rem 1rem;
        }
        .warm-page {
          width: 100%;
          max-width: 820px;
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
          min-width: 780px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
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
          flex-shrink: 0;
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
          height: 36px;
          padding: 0 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
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
        .warm-hero-title {
          font-size: 4.2rem;
        }
        .warm-hero-subtitle {
          font-size: 2.4rem;
        }
        .warm-brief-title {
          font-size: 2.4rem;
        }
        .warm-brief-subtitle {
          font-size: 1.8rem;
        }
        .warm-body-text {
          font-size: 1.25rem;
        }
        .warm-essay-title {
          font-size: 2.4rem;
        }
        .warm-quote-text {
          font-size: 1.8rem;
        }
        .warm-quote-attr {
          font-size: 1.05rem;
        }
        .warm-font-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }
        .warm-font-select {
          flex: 1;
          min-width: 0;
          height: 36px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #111;
          background: #F5F5F5;
          border: none;
          border-radius: 8px;
          padding: 0 1.6rem 0 0.7rem;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.6rem center;
        }
        .warm-font-select:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }
        .warm-lock {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .warm-lock:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        .warm-lock svg {
          width: 14px;
          height: 14px;
          fill: #111;
          transition: fill 0.2s ease;
        }
        .warm-lock.locked {
          background: #111;
        }
        .warm-lock.locked:hover {
          background: #333;
        }
        .warm-lock.locked svg {
          fill: #FFF;
        }
        .warm-divider-h {
          width: 100%;
          height: 1px;
          background: rgba(0, 0, 0, 0.08);
        }
        .warm-bottom-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          width: 100%;
          flex-wrap: nowrap;
        }
        @media (max-width: 780px) {
          .warm-root {
            padding-bottom: 120px;
          }
          .warm-center {
            flex: 1;
            justify-content: center;
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
            min-width: 0;
            padding: 0.8rem 1rem;
            gap: 0.6rem;
            margin-top: 0;
          }
          .warm-bottom-row {
            flex-wrap: wrap;
          }
          .warm-section {
            flex-wrap: wrap;
          }
          .warm-divider {
            display: none;
          }
          .warm-hero-title {
            font-size: 3.15rem;
          }
          .warm-hero-subtitle {
            font-size: 1.8rem;
          }
          .warm-brief-title {
            font-size: 1.8rem;
          }
          .warm-brief-subtitle {
            font-size: 1.35rem;
          }
          .warm-body-text {
            font-size: 0.9375rem;
          }
          .warm-essay-title {
            font-size: 1.8rem;
          }
          .warm-quote-text {
            font-size: 1.35rem;
          }
          .warm-quote-attr {
            font-size: 0.7875rem;
          }
        }
      `}</style>
      <div className="warm-root">
        <div className="warm-center">
          <div className="warm-page">{renderPreview()}</div>

          <div className="warm-controls-wrap">
            <div className="warm-controls-inner">
              <div className="warm-font-row">
                <select
                  className="warm-font-select"
                  value={primary.family}
                  onChange={(e) => setPrimary(e.target.value)}
                >
                  {fonts.map((f) => (
                    <option key={f.family} value={f.family}>
                      {f.family}
                    </option>
                  ))}
                </select>
                <button
                  className={`warm-lock${locked === "primary" ? " locked" : ""}`}
                  onClick={() => toggleLock("primary")}
                >
                  {locked === "primary" ? (
                    <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                  )}
                </button>
                <button className="warm-shuffle" onClick={shuffle}>
                  Shuffle Fonts
                </button>
                <button
                  className={`warm-lock${locked === "secondary" ? " locked" : ""}`}
                  onClick={() => toggleLock("secondary")}
                >
                  {locked === "secondary" ? (
                    <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                  )}
                </button>
                <select
                  className="warm-font-select"
                  value={secondary.family}
                  onChange={(e) => setSecondary(e.target.value)}
                >
                  {fonts.map((f) => (
                    <option key={f.family} value={f.family}>
                      {f.family}
                    </option>
                  ))}
                </select>
              </div>

              <div className="warm-divider-h" />

              <div className="warm-bottom-row">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Warm;
