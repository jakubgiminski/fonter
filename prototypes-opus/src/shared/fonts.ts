export const GOOGLE_FONTS = [
  "Playfair Display",
  "Lora",
  "Crimson Text",
  "Cormorant Garamond",
  "DM Serif Display",
  "Libre Baskerville",
  "Source Serif 4",
  "Merriweather",
  "Outfit",
  "Sora",
  "Manrope",
  "Space Mono",
  "JetBrains Mono",
  "IBM Plex Sans",
  "Archivo",
  "Instrument Serif",
  "Fraunces",
  "Bricolage Grotesque",
];

const loaded = new Set<string>();

export function loadFont(fontName: string): Promise<void> {
  if (loaded.has(fontName)) return Promise.resolve();
  loaded.add(fontName);

  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap`;
  link.rel = "stylesheet";
  document.head.appendChild(link);

  return new Promise((resolve) => {
    link.onload = () => resolve();
    link.onerror = () => resolve();
  });
}

export function loadFontPair(primary: string, secondary: string): Promise<void[]> {
  return Promise.all([loadFont(primary), loadFont(secondary)]);
}

export function getRandomFont(exclude?: string): string {
  const available = exclude ? GOOGLE_FONTS.filter((f) => f !== exclude) : GOOGLE_FONTS;
  return available[Math.floor(Math.random() * available.length)];
}
