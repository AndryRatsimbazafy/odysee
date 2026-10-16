import { ThemeProvider } from "@/components/voyage/theme-provider";
import { fontVariables } from "../fonts";
import "../globals.css";

// Root layout for internal dev sheets, outside the i18n tree.
export default function DevLayout({ children }: LayoutProps<"/dev">) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
