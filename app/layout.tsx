import "./globals.css";
import type { Metadata } from "next";
import { AppProvider } from "@/contexts/AppContext";
import { AnimatePresence } from "framer-motion";

export const metadata: Metadata = {
  title: "Heavenly AI Portal",
  description:
    "AI portal for relationships, emotions, quizzes, rewards and games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <AnimatePresence mode="wait">
          <AppProvider>
            {children}
          </AppProvider>
        </AnimatePresence>
      </body>
    </html>
  );
}