import type { ReactNode } from "react";

/** Titled block of an admin form, separated by a fine rule. */
export function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 border-t border-border pt-8">
      <h2 className="kicker">{title}</h2>
      {children}
    </section>
  );
}
