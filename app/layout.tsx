import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}