import { Suspense } from "react";
import { DossierOverlay } from "@/components/archives/dossier-overlay";

// The dialog shell outlives a change of slug: previous / next swaps the
// dossier inside it, the page behind stays frozen and no curtain replays.
// The Suspense is already revealed by then, so a dossier still loading keeps
// the current one on screen instead of emptying the dialog.
export default function DossierLayout({
  children,
}: LayoutProps<"/[locale]/projects">) {
  return (
    <DossierOverlay>
      <Suspense>{children}</Suspense>
    </DossierOverlay>
  );
}
