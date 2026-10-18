"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/admin/button";
import { deleteMessage, setMessageStatus } from "@/lib/actions/messages";
import type { ContactMessage } from "@/lib/data/admin";

/** Messages received through Hermès (F-ADM-10): read state and deletion. */
export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const t = useTranslations("admin.messages");
  const format = useFormatter();
  const [items, setItems] = useState(messages);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function toggle(message: ContactMessage) {
    const status = message.status === "read" ? "unread" : "read";
    startTransition(async () => {
      const result = await setMessageStatus(message.id, status);
      setFailed(!result.ok);
      if (result.ok) {
        setItems((list) =>
          list.map((m) => (m.id === message.id ? { ...m, status } : m)),
        );
      }
    });
  }

  function remove(message: ContactMessage) {
    if (!window.confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      const result = await deleteMessage(message.id);
      setFailed(!result.ok);
      if (result.ok)
        setItems((list) => list.filter((m) => m.id !== message.id));
    });
  }

  if (!items.length)
    return <p className="text-muted-foreground">{t("empty")}</p>;

  return (
    <div className="grid gap-6">
      <p aria-live="polite" className="text-sm text-destructive">
        {failed ? t("failed") : ""}
      </p>
      <ol className="grid">
        {items.map((message) => {
          const unread = message.status === "unread";
          return (
            <li
              key={message.id}
              className="grid gap-3 border-t border-border py-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2
                  className={unread ? "font-medium" : "text-muted-foreground"}
                >
                  {message.subject || t("noSubject")}
                </h2>
                <p className="mono text-muted-foreground">
                  {unread && (
                    <span className="mr-3 text-or-clair">{t("unread")}</span>
                  )}
                  {t("meta", {
                    date: format.dateTime(new Date(message.createdAt), {
                      dateStyle: "medium",
                      timeStyle: "short",
                      // Fixed zone: same text on the server and in the browser.
                      timeZone: "Indian/Antananarivo",
                    }),
                    locale: message.locale.toUpperCase(),
                  })}
                </p>
              </div>
              <p className="text-sm">
                {message.name} ·{" "}
                <a
                  href={`mailto:${message.email}`}
                  className="underline underline-offset-4 hover:text-or-clair"
                >
                  {message.email}
                </a>
              </p>
              <p className="max-w-prose text-sm break-words whitespace-pre-line">
                {message.message}
              </p>
              {!message.emailSent && (
                <p className="mono text-todo">{t("emailFailed")}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(
                      `Re: ${message.subject}`,
                    )}`}
                  >
                    {t("reply")}
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => toggle(message)}
                >
                  {unread ? t("markRead") : t("markUnread")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  disabled={pending}
                  onClick={() => remove(message)}
                >
                  {t("delete")}
                </Button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
