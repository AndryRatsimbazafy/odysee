import { Fragment } from "react";

/** Hyphenated words ("front-end") never break at their hyphen. */
function keepHyphens(text: string) {
  return text.split(/(\S+-\S+)/g).map((part, i) =>
    i % 2 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * Text from the database that may carry inline <em> (tagline, titles).
 * Only <em> is honoured; everything else stays plain text (no innerHTML).
 */
export function RichEm({ text }: { text: string }) {
  return text
    .split(/<em>(.*?)<\/em>/g)
    .map((part, i) =>
      i % 2 ? (
        <em key={i}>{keepHyphens(part)}</em>
      ) : (
        <Fragment key={i}>{keepHyphens(part)}</Fragment>
      ),
    );
}
