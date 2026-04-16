import "./globals.css";
import type { Metadata } from "next";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "Luma | emocje, relacje i spokoj premium",
  description:
    "Premium portal psychoedukacyjny do emocji, relacji, journalingu, quizow i codziennych rytualow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
