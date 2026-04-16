import "./globals.css";
import type { Metadata } from "next";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "Pulse Rift Portal",
  description:
    "Premium gaming-social AI portal with chat, rewards, profiles, admin studio and arcade loops.",
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
