"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import FloatingBackground from "./FloatingBackground";
import { useApp } from "@/contexts/AppContext";

const navItems = [
  { href: "/", label: "Hub", meta: "overview" },
  { href: "/onboarding", label: "Start", meta: "setup" },
  { href: "/chat", label: "Chat AI", meta: "conversations" },
  { href: "/relationships", label: "Relacje", meta: "signals" },
  { href: "/emotions", label: "Emocje", meta: "regulation" },
  { href: "/quiz", label: "Quiz", meta: "diagnostics" },
  { href: "/tasks", label: "Zadania", meta: "quests" },
  { href: "/journal", label: "Journal", meta: "mood log" },
  { href: "/rewards", label: "Rewardy", meta: "loot" },
  { href: "/games", label: "Gry", meta: "arcade" },
  { href: "/games/snake", label: "Snake", meta: "reflex" },
  { href: "/games/clicker", label: "Clicker", meta: "idle rush" },
  { href: "/games/memory", label: "Memory", meta: "focus" },
  { href: "/games/chaos", label: "Chaos", meta: "calm reflex" },
  { href: "/premium", label: "Premium", meta: "plans" },
  { href: "/profile", label: "Profil", meta: "identity" },
  { href: "/admin", label: "Admin Studio", meta: "live edit" },
  { href: "/legal", label: "Legal", meta: "safe copy" },
];

type AppShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  eyebrow?: string;
  heroCode?: string;
};

function getThemeClass(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/onboarding")) return "onboarding";
  if (pathname.startsWith("/chat")) return "chat";
  if (pathname.startsWith("/relationships")) return "relationships";
  if (pathname.startsWith("/emotions")) return "emotions";
  if (pathname.startsWith("/quiz")) return "quiz";
  if (pathname.startsWith("/tasks")) return "tasks";
  if (pathname.startsWith("/journal")) return "journal";
  if (pathname.startsWith("/rewards")) return "rewards";
  if (pathname.startsWith("/games/snake")) return "snake";
  if (pathname.startsWith("/games/clicker")) return "clicker";
  if (pathname.startsWith("/games/memory")) return "memory";
  if (pathname.startsWith("/games/chaos")) return "games";
  if (pathname.startsWith("/games")) return "games";
  if (pathname.startsWith("/premium")) return "premium";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/legal")) return "legal";
  return "home";
}

export default function AppShell({
  title,
  subtitle,
  children,
  rightPanel,
  eyebrow,
  heroCode,
}: AppShellProps) {
  const pathname = usePathname();
  const themeClass = getThemeClass(pathname);
  const { state, derived } = useApp();

  return (
    <motion.div
      className={`portal-page theme-${themeClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <FloatingBackground tone={themeClass} />

      <div className="portal-container">
        <motion.header
          className="topbar glass"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div className="brand-pill">
            <div
              className="brand-mark"
              style={{
                background: `linear-gradient(135deg, ${state.theme.accentFrom}, ${state.theme.accentTo})`,
              }}
            />
            <div>
              <div className="brand-label">{state.theme.themeName}</div>
              <div className="brand-subtitle">{state.theme.notice}</div>
            </div>
          </div>

          <div className="topbar-right">
            <div className="top-chip wide">{state.theme.badgeText}</div>
            <div className="top-user">
              <div
                className="top-user-avatar"
                style={{ borderColor: `${state.profile.accent}66` }}
              >
                {state.profile.avatar}
              </div>
              <div>
                <div className="top-user-name">{state.profile.displayName}</div>
                <div className="top-user-role">{state.profile.title}</div>
              </div>
            </div>
            <div className="top-chip">
              <span>DX</span>
              <strong>{state.diamonds}</strong>
            </div>
            <div className="top-chip">
              <span>LT</span>
              <strong>{state.light}</strong>
            </div>
            <div className="top-chip">
              <span>EN</span>
              <strong>{state.energy}</strong>
            </div>
            <div className="top-chip">
              <span>LV</span>
              <strong>{derived.level}</strong>
            </div>
          </div>
        </motion.header>

        <div className="shell-grid">
          <motion.aside
            className="sidebar glass"
            initial={{ x: -18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className="sidebar-title">World map</div>
            <div className="nav-list">
              {navItems.map((item, index) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${active ? "active" : ""}`}
                  >
                    <div className="nav-code">{String(index + 1).padStart(2, "0")}</div>
                    <div className="nav-copy">
                      <div className="nav-label">{item.label}</div>
                      <div className="nav-meta">{item.meta}</div>
                    </div>
                    <div className="nav-arrow">/</div>
                  </Link>
                );
              })}
            </div>
          </motion.aside>

          <motion.main
            className="content-panel glass"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <section className="page-hero glass">
              <div className="hero-banner">
                <div className="hero-copy">
                  <div className="eyebrow">{eyebrow ?? state.theme.seasonLabel}</div>
                  <h1 className="page-title">{title}</h1>
                  <p className="page-subtitle">{subtitle}</p>

                  <div className="pill-row">
                    <div className="info-pill">
                      <span>XP</span>
                      <strong>
                        {derived.xpIntoLevel}/{derived.xpIntoLevel + derived.xpToNextLevel}
                      </strong>
                    </div>
                    <div className="info-pill">
                      <span>Streak</span>
                      <strong>{state.streak} days</strong>
                    </div>
                    <div className="info-pill">
                      <span>Clan</span>
                      <strong>{state.profile.clan}</strong>
                    </div>
                  </div>
                </div>

                <div className="hero-orb">
                  <div className="hero-orb-glow" />
                  <div className="hero-orb-ring hero-orb-ring-large" />
                  <div className="hero-orb-ring hero-orb-ring-small" />
                  <div className="hero-orb-core">{heroCode ?? title.slice(0, 2).toUpperCase()}</div>
                  <div className="hero-orb-caption">{state.profile.statusLine}</div>
                </div>
              </div>
            </section>

            <motion.div
              className="portal-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              {children}
            </motion.div>
          </motion.main>

          <motion.aside
            className="rightpanel glass"
            initial={{ x: 18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            {rightPanel ?? (
              <div className="right-list">
                <div className="kpi-card highlight">
                  <div className="kpi-label">Live level</div>
                  <div className="kpi-value">LV {derived.level}</div>
                  <div className="small-note">
                    Do kolejnego poziomu brakuje {derived.xpToNextLevel} XP.
                  </div>
                </div>

                <div className="result-box">
                  <strong>{state.theme.notice}</strong>
                  <p>
                    Spina to feed aktywnosci, rewardy, gry i czat w jedno
                    doswiadczenie premium.
                  </p>
                </div>

                <div className="list-panel">
                  <div className="section-headline">Recent feed</div>
                  <div className="timeline">
                    {state.rewardHistory.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="timeline-item">
                        <div
                          className="timeline-dot"
                          style={{ background: entry.accent }}
                        />
                        <div>
                          <div className="timeline-title">{entry.title}</div>
                          <div className="timeline-copy">{entry.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">Mission status</div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.round(
                          (derived.achievements.filter((item) => item.unlocked).length /
                            derived.achievements.length) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="small-note">
                    Odblokowane achievementy:{" "}
                    {derived.achievements.filter((item) => item.unlocked).length}/
                    {derived.achievements.length}
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </motion.div>
  );
}
