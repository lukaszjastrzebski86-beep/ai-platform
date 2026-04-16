"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import FloatingBackground from "./FloatingBackground";
import { useApp } from "@/contexts/AppContext";

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
  const { state } = useApp();

  return (
    <motion.div
      className="portal-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FloatingBackground />

      <div className="portal-container">
        <motion.div
          className="topbar glass"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="topbar-left">
            <span className="brand-dot" />
            <span>Heavenly AI Portal</span>
          </div>

          <div className="topbar-right">
            <div className="top-user">
              <span className="top-avatar">{state.profile.avatar}</span>
              <span className="top-name">{state.profile.displayName}</span>
            </div>
            <div className="top-chip">💎 {state.diamonds}</div>
            <div className="top-chip">☀️ {state.light}</div>
            <div className="top-chip">⚡ {state.energy}</div>
            <div className="top-chip">🔥 {state.streak}</div>
            <div className="top-chip">{state.theme.badgeText}</div>
          </div>
        </motion.div>

        <div className="shell-grid">
          <motion.aside
            className="sidebar glass"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
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
          </motion.aside>

          <motion.main
            className="content-panel glass"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <section className="page-hero glass">
              <div className="hero-banner">
                <div>
                  <motion.h1
                    className="page-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  >
                    {title}
                  </motion.h1>
                  <motion.div
                    className="page-subtitle"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    {subtitle}
                  </motion.div>
                </div>

                <motion.div
                  className="hero-orb glass"
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="hero-orb-core">✨</div>
                </motion.div>
              </div>
            </section>

            <motion.div
              className="portal-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {children}
            </motion.div>
          </motion.main>

          <motion.aside
            className="rightpanel glass"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {rightPanel ?? (
              <div className="right-list">
                <div className="kpi-card">
                  <div className="kpi-label">Stan</div>
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
          </motion.aside>
        </div>
      </div>
    </motion.div>
  );
}
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