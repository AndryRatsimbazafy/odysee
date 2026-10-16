import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";

// Temporary design-token sheet (T04a). Delete once the real chants exist.

export const metadata: Metadata = {
  title: "Tokens",
  robots: { index: false, follow: false },
};

// Mirror of globals.css (DESIGN.md §2): [token, night, ivory, usage].
const TOKENS = [
  ["nuit", "#101723", "#EAE2D2", "Fond de page"],
  ["nuit-2", "#151E2C", "#E2D8C5", "Surfaces légères"],
  ["nuit-3", "#1B2534", "#D9CDB6", "Emplacements d'image, survols"],
  ["regle", "#1D2737", "#DCD1BC", "Réglures de fond"],
  ["filet", "#2B3647", "#C3B497", "Filets, bordures"],
  ["ivoire", "#EAE2D2", "#131A26", "Texte principal"],
  ["cendre", "#B7BEC9", "#434D5C", "Texte secondaire"],
  ["ardoise", "#949FB0", "#4F5A6A", "Annotations, légendes"],
  ["or", "#B79A65", "#7A5F2E", "Seul accent"],
  ["or-clair", "#D2B985", "#6A5226", "Survol, focus, exergue"],
  ["todo", "#C99872", "#8E4F2A", "[à fournir]"],
] as const;

const NUIT = { dark: TOKENS[0][1], light: TOKENS[0][2] };

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function Ratio({ fg, bg }: { fg: string; bg: string }) {
  if (fg === bg) return <span className="text-ardoise">—</span>;
  const ratio = contrast(fg, bg);
  return (
    <span className={ratio >= 4.5 ? "text-ivoire" : "text-ardoise"}>
      {ratio.toFixed(2)}
      {ratio >= 4.5 ? " AA" : ratio >= 3 ? " AA large" : ""}
    </span>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="kicker mb-6">{children}</h2>;
}

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="gut w-full py-16">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-filet pb-6">
        <h1 className="display text-[clamp(44px,6vw,92px)]">Tokens</h1>
        <ThemeSwitch />
      </div>

      <section className="mt-12">
        <Heading>Couleurs · contraste sur --nuit</Heading>
        <table className="w-full border-collapse text-left">
          <thead className="mono text-ardoise">
            <tr className="border-b border-filet">
              <th className="py-3 pr-4 font-normal">Token</th>
              <th className="py-3 pr-4 font-normal">Nuit</th>
              <th className="py-3 pr-4 font-normal">Ivoire</th>
              <th className="hidden py-3 font-normal md:table-cell">Usage</th>
            </tr>
          </thead>
          <tbody>
            {TOKENS.map(([name, dark, light, usage]) => (
              <tr key={name} className="border-b border-regle">
                <td className="py-3 pr-4">
                  <span className="flex items-center gap-3">
                    <span
                      className="size-8 shrink-0 border border-filet"
                      style={{ background: `var(--${name})` }}
                    />
                    <span className="mono text-ivoire">--{name}</span>
                  </span>
                </td>
                <td className="mono py-3 pr-4">
                  {dark} · <Ratio fg={dark} bg={NUIT.dark} />
                </td>
                <td className="mono py-3 pr-4">
                  {light} · <Ratio fg={light} bg={NUIT.light} />
                </td>
                <td className="hidden py-3 text-cendre md:table-cell">
                  {usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-16 space-y-5">
        <Heading>Typographie</Heading>
        <p className="display text-[clamp(64px,11vw,168px)]">Andry</p>
        <p className="display text-[clamp(44px,6vw,92px)]">
          Titre de chant —{" "}
          <em className="font-normal text-or-clair">Cormorant</em> 500
        </p>
        <p className="max-w-[65ch] text-cendre">
          Corps — Instrument Sans 17 px, interligne 1.65. Un portulan de nuit,
          relié en planches, chaque chant avec sa marge annotée.
        </p>
        <p className="mono">Annotation — JetBrains Mono 12 px</p>
        <p className="kicker">Chant I · Kicker 11 px</p>
        <p>
          Contenu manquant : <span className="todo">[à fournir]</span>
        </p>
      </section>

      <section className="mt-16">
        <Heading>Grille et marge</Heading>
        <div className="grid-12 border-y border-regle py-6">
          <aside className="marg">
            <span className="kicker">Chant I</span>
            <span className="folio">folio ii</span>
            <p className="note mono">Marge annotée, colonnes 1–3.</p>
          </aside>
          <div className="col-span-12 min-[821px]:col-[4/-1]">
            <div className="grid-12 h-24">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="bg-nuit-3" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <Heading>Contrôles</Heading>
        <div className="flex flex-wrap items-center gap-6">
          <button type="button" className="btn">
            Embarquer
          </button>
          <button type="button" className="btn ghost">
            Lire les archives
          </button>
          <a href="#" className="btn" aria-disabled="true">
            Désactivé
          </a>
          <svg viewBox="0 0 120 60" className="line h-16 w-32" aria-hidden>
            <path d="M6 50 Q60 -10 114 50" />
            <path className="fine" d="M6 54 H114" />
            <path className="soft" d="M20 40 L100 40" />
            <circle className="dot" cx="60" cy="20" r="3" />
          </svg>
        </div>
      </section>
    </main>
  );
}
