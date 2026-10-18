"use client";

import { useTranslations, type Locale } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { Clock } from "@/components/chants/embarcadere/clock";
import { WeaponMedallion } from "@/components/engravings/weapons";
import { sendContactMessage } from "@/lib/actions/contact";
import {
  CONTACT_SUBJECTS,
  type ContactField,
  type ContactState,
} from "@/lib/validation/contact";

const INITIAL: ContactState = { status: "idle" };
// Same caps as the schema, so a letter can't be refused for its length.
const MAX = { name: 120, email: 254, message: 5000 } as const;
// DOM order: focus goes to the first field in error.
const ORDER: ContactField[] = ["subject", "message", "name", "email"];

type Props = {
  locale: Locale;
  /** "Andry · Antananarivo, Madagascar", the letter's addressee. */
  recipient: string;
  /** Public address, named in the failure message; null until provided. */
  email: string | null;
};

/**
 * The letter to Hermès. Each letter is its own form: once sealed, "write
 * another" starts a fresh one (and a fresh action state).
 */
export function HermesForm(props: Props) {
  const [round, setRound] = useState(0);
  return (
    <Letter key={round} {...props} onAnother={() => setRound((r) => r + 1)} />
  );
}

function Letter({
  locale,
  recipient,
  email,
  onAnother,
}: Props & { onAnother: () => void }) {
  const t = useTranslations("hermes");
  const th = useTranslations("hero.identity");
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    INITIAL,
  );
  // When the letter appeared: the action refuses letters written in < 3 s.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // After each answer: focus the first field in error (its label and
  // message are read), or the sealed letter's title.
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const first = ORDER.find((f) => state.fieldErrors?.[f]);
    const target =
      state.status === "success"
        ? "#hermes-sealed"
        : first === "subject"
          ? "[name=subject]"
          : first && `#hermes-${first}`;
    if (target) root.current?.querySelector<HTMLElement>(target)?.focus();
  }, [state]);

  const submit = (formData: FormData) => {
    // The button stays focusable while sending: ignore a second press.
    if (pending) return;
    formData.set("startedAt", String(startedAt.current));
    formAction(formData);
  };

  const invalid = (name: ContactField) =>
    state.fieldErrors?.[name] ? true : undefined;
  const field = (name: Exclude<ContactField, "subject">) => ({
    id: `hermes-${name}`,
    name,
    required: true,
    maxLength: MAX[name],
    defaultValue: state.values?.[name] ?? "",
    "aria-invalid": invalid(name),
    "aria-describedby": `hermes-${name}-err`,
  });
  const error = (name: ContactField) => (
    <span className="err" id={`hermes-${name}-err`}>
      {state.fieldErrors?.[name]
        ? t(`errors.${state.fieldErrors[name]}`)
        : null}
    </span>
  );

  const notice =
    state.error && state.error !== "invalid"
      ? state.error === "failed"
        ? email
          ? t("form.failure", { email })
          : t("form.failureNoEmail")
        : t(`errors.${state.error}`)
      : null;

  return (
    <div className="letter-main" ref={root}>
      <p className="letter-head mono">
        <span>{t("letter.to")}</span> {recipient}
        <span className="whitespace-nowrap">
          {" "}
          · <Clock /> {th("timezone")}
        </span>
      </p>

      {state.status === "success" ? (
        <div className="sealed">
          <WeaponMedallion weapon="caducee" className="hermes-seal" />
          <div className="sealed-text">
            <h3 id="hermes-sealed" className="display" tabIndex={-1}>
              {t("sent.title")}
            </h3>
            <p>{t("sent.text", { email: state.sentTo ?? "" })}</p>
            <button className="btn ghost" type="button" onClick={onAnother}>
              {t("sent.another")}
            </button>
          </div>
        </div>
      ) : (
        <form
          className="letter-form"
          action={submit}
          noValidate
          aria-describedby="hermes-help"
        >
          <p id="hermes-help" className="mono">
            {t("form.help")}
          </p>
          <input type="hidden" name="locale" value={locale} />
          <div className="hp" aria-hidden="true">
            <label htmlFor="hermes-website">{t("form.honeypot")}</label>
            <input
              id="hermes-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <fieldset className="field choices">
            <legend id="hermes-subject-legend">{t("form.subject")}</legend>
            <div
              role="radiogroup"
              aria-labelledby="hermes-subject-legend"
              aria-describedby="hermes-subject-err"
              aria-required="true"
              aria-invalid={invalid("subject")}
            >
              {CONTACT_SUBJECTS.map((s) => (
                <label key={s} className="choice">
                  <input
                    type="radio"
                    name="subject"
                    value={s}
                    required
                    defaultChecked={state.values?.subject === s}
                  />
                  {t(`form.subjects.${s}`)}
                </label>
              ))}
            </div>
            {error("subject")}
          </fieldset>

          <div className="field">
            <label htmlFor="hermes-message">{t("form.message")}</label>
            <textarea
              {...field("message")}
              aria-describedby="hermes-message-hint hermes-message-err"
            />
            {/* The rule, until the error repeats it. */}
            {invalid("message") ? null : (
              <span className="hint mono" id="hermes-message-hint">
                {t("form.hint")}
              </span>
            )}
            {error("message")}
          </div>

          <fieldset className="signature">
            <legend>{t("letter.signed")}</legend>
            <div className="field">
              <label htmlFor="hermes-name">{t("form.name")}</label>
              <input {...field("name")} autoComplete="name" />
              {error("name")}
            </div>
            <div className="field">
              <label htmlFor="hermes-email">{t("form.email")}</label>
              <input {...field("email")} type="email" autoComplete="email" />
              {error("email")}
            </div>
          </fieldset>

          <div className="letter-send">
            <button className="btn" type="submit" aria-disabled={pending}>
              {pending ? t("form.sending") : t("form.submit")}
            </button>
            <p className="mono">{t("form.reply")}</p>
          </div>
        </form>
      )}

      {/* Always in the DOM: a live region that appears with its text is
          often not announced. */}
      <p className="notice" role="status">
        {notice}
      </p>
    </div>
  );
}
