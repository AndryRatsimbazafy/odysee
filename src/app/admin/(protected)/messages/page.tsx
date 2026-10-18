import { getTranslations } from "next-intl/server";
import { getContactMessages } from "@/lib/data/admin";
import { MessagesList } from "./messages-list";

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminMessagesPage() {
  const [messages, t] = await Promise.all([
    getContactMessages(),
    getTranslations("admin.messages"),
  ]);

  return (
    <main className="gut flex-1 py-12">
      <h1 className="display text-4xl">{t("heading")}</h1>
      <p className="mt-3 mb-10 text-muted-foreground">{t("lead")}</p>
      <MessagesList messages={messages} />
    </main>
  );
}
