import { Cormorant_Garamond, Instrument_Sans, JetBrains_Mono } from "next/font/google";

// Only latin is preloaded; latin-ext still loads on demand through
// unicode-range (T25: half the preloaded bytes, French needs no more).
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Font CSS variables, shared by every root layout. */
export const fontVariables = `${cormorant.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`;
