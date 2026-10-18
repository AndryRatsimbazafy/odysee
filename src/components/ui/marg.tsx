import type { ReactNode } from "react";
import { Folio } from "./folio";

type MargProps = {
  /** Chant label, e.g. "Chant II" (voyage.chants.*.n). */
  chant: string;
  /** Page number of the chant in the voyage. */
  folio: number;
  /** Epigraph or note, ruled above; hidden below 820 px. */
  note?: ReactNode;
  children?: ReactNode;
};

/** Annotated margin of a chant (grid columns 1–3, above the composition on mobile). */
export function Marg({ chant, folio, note, children }: MargProps) {
  return (
    <aside className="marg">
      <span className="kicker">{chant}</span>
      <Folio n={folio} />
      {note ? <p className="note mono">{note}</p> : null}
      {children}
    </aside>
  );
}
