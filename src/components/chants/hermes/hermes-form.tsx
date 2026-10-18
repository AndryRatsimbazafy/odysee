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

  const submit = (formData: FormData) => {
    formData.set("startedAt", String(startedAt.current));
    formAction(formData);
  };

  const field = (name: ContactField) => {
    const error = state.fieldErrors?.[name];
    return {
      id: `hermes-${name}`,
      name,
      defaultValue: state.values?.[name] ?? "",
      "aria-invalid": error ? true : undefined,
      "aria-describedby": `hermes-${name}-err`,
    } as const;
  };
  const error = (name: ContactField) => (
    <span className="err" id={`hermes-${name}-err`} aria-live="polite">
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
        <button className="btn" type="submit" disabled={pending}>
          {pending ? t("form.sending") : t("form.submit")}
        </button>
      </div>
      <p
        className="notice"
        data-state={state.status}
        role="status"
        hidden={!notice}
      >
        {notice}
      </p>
    </form>
  );
}
