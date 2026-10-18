/** Hades' seal on a confidential dossier. Decorative. */
export function Seal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={className ? `line ${className}` : "line"}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="22" cy="22" r="20" pathLength={1} />
      <circle cx="22" cy="22" r="15" pathLength={1} className="fine" />
      <path d="M15 27 L22 13 L29 27 Z" pathLength={1} />
    </svg>
  );
}
