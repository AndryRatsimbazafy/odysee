"use client";

import { useTranslations, type Locale } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { sendContactMessage } from "@/lib/actions/contact";
import {
  CONTACT_SUBJECTS,
  type ContactField,
  type ContactState,
} from "@/lib/validation/contact";

const INITIAL: ContactState = { status: "idle" };
// Same caps as the schema, so a letter can't be refused for its length.
const MAX: Record<ContactField, number> = {
  name: 120,
  email: 254,
  subject: 20,
  message: 5000,
};
// DOM order: focus goes to the first field in error.
const ORDER: ContactField[] = ["name", "email", "subject", "message"];

/** The letter to Hermès: real sending, inline errors, honeypot and delay. */
export function HermesForm({ locale }: { locale: Locale }) {
  const t = useTranslations("hermes");
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    INITIAL,
  );
  // When the form appeared: the action refuses letters written in < 3 s.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // After each answer: focus the first field in error, so its label and
  // message are read; other outcomes are announced by the status line.
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const first = ORDER.find((f) => state.fieldErrors?.[f]);
    if (first)
      form.current?.querySelector<HTMLElement>(`#hermes-${first}`)?.focus();
  }, [state]);

  const submit = (formData: FormData) => {
    // The button stays focusable while sending: ignore a second press.
    if (pending) return;
    formData.set("startedAt", String(startedAt.current));
    formAction(formData);
  };

  const field = (name: ContactField) => {
    const error = state.fieldErrors?.[name];
    return {
      id: `hermes-${name}`,
      name,
      required: true,
      maxLength: MAX[name],
      defaultValue: state.values?.[name] ?? "",
      "aria-invalid": error ? true : undefined,
      "aria-describedby": `hermes-${name}-err`,
    } as const;
  };
  const error = (name: ContactField) => (
    <span className="err" id={`hermes-${name}-err`}>
      {state.fieldErrors?.[name]
        ? t(`errors.${state.fieldErrors[name]}`)
        : null}
    </span>
  );

  const notice =
    state.status === "success"
      ? t("form.success")
      : state.error && state.error !== "invalid"
        ? state.error === "failed"
          ? t("form.failure")
          : t(`errors.${state.error}`)
        : null;

  return (
    <form
      ref={form}
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
      <div className="field">
        <label htmlFor="hermes-subject">{t("form.subject")}</label>
        <select {...field("subject")}>
          <option value="" disabled />
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {t(`form.subjects.${s}`)}
            </option>
          ))}
        </select>
        {error("subject")}
      </div>
      <div className="field">
        <label htmlFor="hermes-message">{t("form.message")}</label>
        <textarea {...field("message")} />
        {error("message")}
      </div>

      <div>
        <button className="btn" type="submit" aria-disabled={pending}>
          {pending ? t("form.sending") : t("form.submit")}
        </button>
      </div>
      {/* Always in the DOM: a live region that appears with its text is
          often not announced. */}
      <p className="notice" data-state={state.status} role="status">
        {notice}
      </p>
    </form>
  );
}
