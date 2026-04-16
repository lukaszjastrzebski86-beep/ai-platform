"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import FloatingBackground from "./FloatingBackground";
import { useApp } from "@/contexts/AppContext";

type NavSection = "home" | "practice" | "play" | "profile" | "studio";

const primaryNav: Array<{
  href: string;
  label: string;
  section: NavSection;
}> = [
  { href: "/", label: "Home", section: "home" },
  { href: "/practice", label: "Practice", section: "practice" },
  { href: "/play", label: "Play", section: "play" },
  { href: "/profile", label: "Profile", section: "profile" },
  { href: "/admin", label: "Studio", section: "studio" },
];

const sectionLabels: Record<NavSection, string> = {
  home: "Quick routes",
  practice: "Inside practice",
  play: "Inside play",
  profile: "Inside profile",
  studio: "Inside studio",
};

const sectionLinks: Record<NavSection, Array<{ href: string; label: string }>> = {
  home: [
    { href: "/practice", label: "Open Practice" },
    { href: "/play", label: "Open Play" },
    { href: "/profile", label: "Your Profile" },
  ],
  practice: [
    { href: "/chat", label: "AI Chat" },
    { href: "/journal", label: "Journal" },
    { href: "/quiz", label: "Quizy" },
    { href: "/tasks", label: "Sciezki" },
    { href: "/emotions", label: "Emocje" },
    { href: "/relationships", label: "Relacje" },
  ],
  play: [
    { href: "/rewards", label: "Rewardy" },
    { href: "/games", label: "Mini-gry" },
  ],
  profile: [
    { href: "/profile", label: "Profil" },
    { href: "/premium", label: "Premium" },
    { href: "/onboarding", label: "Onboarding" },
  ],
  studio: [
    { href: "/admin", label: "Admin Studio" },
    { href: "/legal", label: "Legal" },
  ],
};

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
  if (pathname.startsWith("/practice")) return "chat";
  if (pathname.startsWith("/play")) return "games";
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
  if (pathname.startsWith("/games")) return "games";
  if (pathname.startsWith("/premium")) return "premium";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/legal")) return "legal";
  return "home";
}

function getNavSection(pathname: string): NavSection {
  if (pathname === "/") return "home";

  if (
    pathname.startsWith("/practice") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/relationships") ||
    pathname.startsWith("/emotions") ||
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/journal")
  ) {
    return "practice";
  }

  if (
    pathname.startsWith("/play") ||
    pathname.startsWith("/rewards") ||
    pathname.startsWith("/games")
  ) {
    return "play";
  }

  if (pathname.startsWith("/admin")) {
    return "studio";
  }

  return "profile";
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
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
  const navSection = getNavSection(pathname);
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
          <div className="topbar-left">
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

            <nav className="top-nav" aria-label="Primary">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`top-nav-link ${navSection === item.section ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
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
              <span>STREAK</span>
              <strong>{state.streak}</strong>
            </div>
            <div className="top-chip">
              <span>LIGHT</span>
              <strong>{state.light}</strong>
            </div>
            <div className="top-chip">
              <span>LEVEL</span>
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
            <div className="sidebar-title">Today</div>

            <div className="sidebar-feature-card">
              <div className="sidebar-feature-label">Suggested next move</div>
              <div className="sidebar-feature-title">
                {state.journalEntries.length < 2 ? "Start with a check-in" : "Open your calm flow"}
              </div>
              <div className="sidebar-feature-copy">
                {state.journalEntries.length < 2
                  ? "Najpierw nazwij stan. Potem przejdz do AI albo quizu."
                  : "Masz juz baze refleksji, wiec dobrym ruchem jest AI albo jedno mikro-zadanie."}
              </div>
            </div>

            <div className="sidebar-metrics">
              <div className="sidebar-metric">
                <span>Analizy</span>
                <strong>{state.usage.analysesLeft}</strong>
              </div>
              <div className="sidebar-metric">
                <span>Testy</span>
                <strong>{state.usage.testsLeft}</strong>
              </div>
              <div className="sidebar-metric">
                <span>Preview</span>
                <strong>{state.usage.premiumMinutes} min</strong>
              </div>
            </div>

            <div className="sidebar-section-label">{sectionLabels[navSection]}</div>
            <div className="nav-sublist">
              {sectionLinks[navSection].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-subitem ${isRouteActive(pathname, item.href) ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="sidebar-note">
              To ma byc portal, do ktorego wraca sie codziennie bez zmeczenia.
              Dlatego hierarchia jest spokojna, a wejscia sa grupowane.
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
                      <span>Calm streak</span>
                      <strong>{state.streak} days</strong>
                    </div>
                    <div className="info-pill">
                      <span>Circle</span>
                      <strong>{state.profile.clan}</strong>
                    </div>
                  </div>
                </div>

                <div className="hero-preview-shell">
                  <div className="hero-preview-glow" />
                  <div className="hero-preview-device">
                    <div className="hero-preview-topline">
                      <div className="hero-preview-title">{heroCode ?? "LM"}</div>
                      <div className="hero-preview-chip">{state.theme.themeName}</div>
                    </div>

                    <div className="hero-preview-card hero-preview-card-primary">
                      <div className="hero-preview-label">Today</div>
                      <strong>{state.journalEntries.length < 2 ? "Quiet check-in" : "Deep clarity"}</strong>
                      <span>
                        {state.journalEntries.length < 2
                          ? "2 min journaling before AI."
                          : "AI + one small action for today."}
                      </span>
                    </div>

                    <div className="hero-preview-card">
                      <div className="hero-preview-label">Reward loop</div>
                      <strong>{derived.dailyReady ? "Daily reward ready" : "Return later today"}</strong>
                      <span>{state.diamonds} diamonds and {state.light} light in your account.</span>
                    </div>

                    <div className="hero-preview-footer">
                      <div className="hero-preview-stat">
                        <span>Mood logs</span>
                        <strong>{state.journalEntries.length}</strong>
                      </div>
                      <div className="hero-preview-stat">
                        <span>Level</span>
                        <strong>{derived.level}</strong>
                      </div>
                      <div className="hero-preview-stat">
                        <span>Streak</span>
                        <strong>{state.streak}</strong>
                      </div>
                    </div>
                  </div>
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
                    Kazdy ekran ma prowadzic do spokojniejszego kolejnego ruchu,
                    a nie tylko pokazywac funkcje.
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
