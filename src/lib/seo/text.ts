/** Plain text of a field that may hold inline <em>. */
export const plain = (html: string) =>
  html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
