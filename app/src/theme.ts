/**
 * Design tokens ported from the Radio Times "Streamers Hub" web concept
 * (src/styles.css `@theme`). Kept as plain constants so every screen shares
 * one source of truth without a CSS/Tailwind build step.
 */
export const colors = {
  bg: "#060a06", // --color-surface-bg
  card: "#121712", // --color-surface-card
  muted: "#1c221c", // --color-surface-muted
  brand: "#b8ff3d", // --color-brand (lime)
  urgent: "#ff7a3a", // deal-ending accent
  white: "#ffffff",
  black: "#000000",
} as const;

/** White at a given alpha — the web design leans heavily on text-white/NN. */
export const wa = (alpha: number) => `rgba(255,255,255,${alpha})`;

/** Fraunces (italic) — the signature editorial serif. Family names come from
 * the loaded @expo-google-fonts/fraunces exports (see app/_layout.tsx). */
export const serif = {
  medium: "Fraunces_500Medium_Italic",
  semibold: "Fraunces_600SemiBold_Italic",
  bold: "Fraunces_700Bold_Italic",
} as const;

export const radius = {
  lg: 16,
  xl: 20,
  "2xl": 20,
  "3xl": 24,
  full: 999,
} as const;
