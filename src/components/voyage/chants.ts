// The chants in reading order (DESIGN §6): each section carries the id and
// `data-chant`; the compass, the index and the routes are built from it.
export const CHANTS = [
  "embarcadere",
  "divinites",
  "epreuves",
  "arsenal",
  "escales",
  "oracle",
  "hermes",
  "ithaque",
] as const;

export type ChantId = (typeof CHANTS)[number];
