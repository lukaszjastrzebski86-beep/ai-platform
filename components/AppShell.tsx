"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FloatingBackground from "./FloatingBackground";

const navItems = [
  { href: "/", label: "Hub" },
  { href: "/chat", label: "Chat AI" },
  { href: "/relationships", label: "Relacje" },
  { href: "/emotions", label: "Emocje" },
  { href: "/quiz", label: "Quiz" },
  { href: "/tasks", label: "Zadania" },
  { href: "/tarot", label: "Tarot" },
  { href: "/horoscope", label: "Horoskop" },
  { href: "/numerology", label: "Numerologia" },
  { href: "/rewards", label: "Rewardy" },
  { href: "/games", label: "Gry" },
  { href: "/games/snake", label: "Snake" },
  { href: "/profile", label: "Profil" },
  { href: "/admin", label: "Admin AI" },
];

export default function AppShell({
  title,
  subtitle,
  children,
  rightPanel,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="portal-page">
      <FloatingBackground />

      <div className="portal-container">
        <div className="topbar glass">
          <div className="topbar-left">
            <span className="brand-dot" />
            <span>Heavenly AI Portal</span>
          </div>

          <div className="topbar-right">
            <div className="top-chip">LIVE</div>
            <div className="top-chip">3 hidden engines</div>
            <div className="top-chip">daily reward</div>
          </div>
        </div>

        <div className="shell-grid">
          <aside className="sidebar glass">
            <div className="sidebar-title">Nawigacja</div>
            <div className="nav-list">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-item"
                  style={{
                    outline:
                      pathname === item.href
                        ? "2px solid rgba(99, 217, 255, 0.65)"
                        : "none",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </aside>

          <main className="content-panel glass">
            <section className="page-hero glass">
              <div className="hero-banner">
                <div>
                  <h1 className="page-title">{title}</h1>
                  <div className="page-subtitle">{subtitle}</div>
                </div>

                <div className="hero-orb glass">
                  <div className="hero-orb-core">✨</div>
                </div>
              </div>
            </section>

            <div className="portal-grid">{children}</div>
          </main>

          <aside className="rightpanel glass">
            {rightPanel ?? (
              <div className="right-list">
                <div className="kpi-card">
                  <div className="kpi-label">Świat</div>
                  <div className="kpi-value">LIVE</div>
                </div>
                <div className="result-box">
                  Portal jest już przygotowany pod osobne światy: AI, rewardy,
                  gry, tarot, horoskop, profil i admin studio.
                </div>
                <div className="small-note">
                  Ten shell to baza pod dalsze przejścia, animacje i osobne
                  doświadczenia jak w portalu gamingowym.
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}