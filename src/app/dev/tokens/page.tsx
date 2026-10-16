import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";

// Temporary design-token sheet (T02). Delete once the real stops exist.

export const metadata: Metadata = {
  title: "Tokens",
  robots: { index: false, follow: false },
};

const INTERFACE = [
  ["parchemin", "bg-parchemin"],
  ["parchemin-2", "bg-parchemin-2"],
  ["encre", "bg-encre"],
  ["encre-2", "bg-encre-2"],
  ["terre", "bg-terre"],
  ["on-terre", "bg-on-terre"],
  ["or", "bg-or"],
  ["lueur", "bg-lueur"],
  ["eau", "bg-eau"],
  ["bois", "bg-bois"],
] as const;

const OBJECTS = [
  ["tesson", "bg-tesson", "#C9703F"],
  ["figure", "bg-figure", "#1B1612"],
  ["obj-parchemin", "bg-obj-parchemin", "#E8D2A2"],
  ["obj-encre", "bg-obj-encre", "#2A1A0C"],
  ["obj-meandre", "bg-obj-meandre", "#5A3A1E"],
  ["carte", "bg-carte", "#F2E6CC"],
  ["carte-encre", "bg-carte-encre", "#2A2018"],
  ["carte-filet", "bg-carte-filet", "#CDB78F"],
  ["cire", "bg-cire", "#7E2416"],
  ["olive", "bg-olive", "#4E5A2E"],
] as const;

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-mono text-xs tracking-[0.14em] text-encre-2 uppercase">
      {children}
    </h2>
  );
}

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="w-full px-[clamp(16px,5vw,112px)] py-16">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-or pb-6">
        <h1 className="font-display text-[clamp(34px,4.2vw,58px)] leading-none">
          Tokens
        </h1>
        <ThemeSwitch />
      </div>

      <section className="mt-12">
        <Heading>Interface — s&apos;inversent</Heading>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {INTERFACE.map(([name, bg]) => (
            <li key={name}>
              <div className={`${bg} h-16 border border-encre/20`} />
              <p className="mt-2 font-mono text-xs">--{name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <Heading>Objets — constantes</Heading>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {OBJECTS.map(([name, bg, hex]) => (
            <li key={name}>
              <div className={`${bg} h-16 border border-encre/20`} />
              <p className="mt-2 font-mono text-xs">{name}</p>
              <p className="font-mono text-[11px] text-encre-2">{hex}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-4">
          <p className="bg-tesson px-5 py-3 font-display text-lg text-figure">
            Figure noire sur terre cuite
          </p>
          <p className="bg-obj-parchemin px-5 py-3 font-display text-lg text-obj-encre outline-2 -outline-offset-6 outline-obj-meandre">
            Parchemin d&apos;objet
          </p>
          <p className="bg-carte px-5 py-3 font-display text-lg text-carte-encre outline -outline-offset-6 outline-carte-filet">
            Carte postale
          </p>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <Heading>Typographie</Heading>
        <p className="font-display text-[clamp(60px,12vw,176px)] leading-[0.84] font-[420] tracking-[-0.035em] [font-variation-settings:'SOFT'_10,'WONK'_1]">
          Andry
        </p>
        <p className="font-display text-[clamp(26px,3vw,40px)] leading-[1.22] font-[320] italic">
          Narrateur — Fraunces italique 320
        </p>
        <p className="font-display text-[clamp(34px,4.2vw,58px)] leading-none">
          Titre de rive — Fraunces 400
        </p>
        <p className="max-w-[65ch]">
          Corps — Instrument Sans 18 px, interligne 1.6. Le passeur ne rend pas
          la monnaie ; prévoyez une obole exacte.
        </p>
        <p className="font-mono text-[13px] tracking-[0.02em] text-encre-2">
          CHANT I · JetBrains Mono 13 px
        </p>
      </section>

      <section className="mt-12">
        <Heading>Contrôles</Heading>
        <div className="flex flex-wrap items-center gap-8">
          <button
            type="button"
            className="clip-taille inline-flex min-h-[50px] items-center bg-terre px-[26px] font-display text-lg font-medium text-on-terre transition-colors hover:bg-encre hover:text-parchemin"
          >
            Embarquer
          </button>
          <a
            href="#"
            className="font-display text-lg underline decoration-or decoration-[1.5px] underline-offset-4 transition-colors hover:text-terre"
          >
            Lien d&apos;action
          </a>
          <nav className="border border-encre p-1">
            <ul className="flex gap-5 border border-or px-4 py-2 font-mono text-xs">
              <li>Ithaque</li>
              <li>Styx</li>
              <li>Olympe</li>
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
