"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const coreWorlds = [
  {
    href: "/chat",
    title: "AI Chat",
    text: "Jedno spojne AI do porzadkowania emocji, relacji, przeciążenia i kolejnych krokow.",
    icon: "AI",
    badge: "core",
    eyebrow: "conversation",
  },
  {
    href: "/journal",
    title: "Journal",
    text: "Wpis dnia, nastroj, historia i lekkie trackowanie kierunku bez ciezaru terapii.",
    icon: "JR",
    badge: "daily",
    eyebrow: "mood tracking",
  },
  {
    href: "/quiz",
    title: "Testy i quizy",
    text: "Szybkie testy stanu, relacji, granic i przeciazenia z wynikiem oraz CTA.",
    icon: "QZ",
    badge: "insight",
    eyebrow: "diagnostics",
  },
  {
    href: "/tasks",
    title: "Sciezki i taski",
    text: "Task dnia, plan minimum, wyzwanie 7 dni i mikro-questy pod spokoj.",
    icon: "TS",
    badge: "action",
    eyebrow: "quests",
  },
];

const supportWorlds = [
  {
    href: "/rewards",
    title: "Rewardy i economy",
    text: "Krysztaly, dobra energia, daily chest, streak i rewarded flow, ktory napedza powroty.",
    icon: "RW",
    badge: "loop",
    eyebrow: "retention",
  },
  {
    href: "/games",
    title: "Mini-gry",
    text: "Snake, Memory, Clicker i Rozbij chaos daja lekki gaming-social rytm bez przebodzcowania.",
    icon: "GM",
    badge: "arcade",
    eyebrow: "play",
  },
  {
    href: "/premium",
    title: "Premium",
    text: "Wyrazne rozroznienie free i premium, roadmapa wartosci oraz miejsce na checkout flow.",
    icon: "PR",
    badge: "monetization",
    eyebrow: "plans",
  },
  {
    href: "/profile",
    title: "Profil",
    text: "Osobisty hub z postepem, stylem, tagami i tozsamoscia, do ktorej chce sie wracac.",
    icon: "PF",
    badge: "identity",
    eyebrow: "social layer",
  },
];

export default function HomePage() {
  const { state, derived } = useApp();

  return (
    <AppShell
      title={state.theme.heroTitle}
      subtitle="Premium portal psychoedukacyjny laczy AI, journal, quizy, mikro-zadania, rewardy i mini-gry w jedno spokojne, nowoczesne doswiadczenie, do ktorego chce sie wracac codziennie."
      heroCode="AI"
      rightPanel={
        <div className="right-list">
          <div className="kpi-card highlight">
            <div className="kpi-label">Dzisiaj masz</div>
            <div className="kpi-value">
              {state.usage.aiCredits + state.usage.analysesLeft} slotow
            </div>
            <div className="small-note">
              Free loop: {state.usage.testsLeft} test, {state.usage.analysesLeft} analizy i
              {state.usage.premiumMinutes > 0
                ? ` ${state.usage.premiumMinutes} min premium`
                : " miejsce na rewarded boosty."}
            </div>
          </div>

          <div className="list-panel">
            <div className="section-headline">Dlaczego to wciaga</div>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: "#67d8ff" }} />
                <div>
                  <div className="timeline-title">Natychmiastowa ulga</div>
                  <div className="timeline-copy">
                    Uzytkownik od razu znajduje modul, ktory odpowiada na jego stan.
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: "#ffba6b" }} />
                <div>
                  <div className="timeline-title">Czytelny progres</div>
                  <div className="timeline-copy">
                    Rewardy, questy i poziomy wzmacniaja poczucie ruchu, nie obciazenia.
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: "#7cf0c2" }} />
                <div>
                  <div className="timeline-title">Bezpieczny ton</div>
                  <div className="timeline-copy">
                    To wsparcie psychoedukacyjne z jasnym wordingiem i bez obietnic medycznych.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SafetyNotice compact />
        </div>
      }
    >
      <div className="cards-grid-4">
        {coreWorlds.map((world) => (
          <Link key={world.href} href={world.href}>
            <PortalCard {...world} />
          </Link>
        ))}
      </div>

      <div className="split-grid">
        <div className="list-panel">
          <div className="section-headline">Live app loop</div>
          <div className="metric-row">
            <div className="metric-chip">
              <span>Level</span>
              <strong>{derived.level}</strong>
            </div>
            <div className="metric-chip">
              <span>Streak</span>
              <strong>{state.streak} dni</strong>
            </div>
            <div className="metric-chip">
              <span>Journal</span>
              <strong>{state.journalEntries.length} wpisow</strong>
            </div>
            <div className="metric-chip">
              <span>Pulse</span>
              <strong>{state.socialPulse}%</strong>
            </div>
          </div>

          <div className="result-box">
            <strong>Brand promise</strong>
            <p>
              Brand 1 laczy emocje, relacje, spokoj i rozwoj w formule premium.
              Cieplo, nowoczesnie i bez chaosu, z UX-em bardziej przypominajacym
              najlepsze portale produktowe niz klasyczny self-help landing.
            </p>
          </div>
        </div>

        <div className="list-panel">
          <div className="section-headline">Feed aktywnosci</div>
          <div className="timeline">
            {state.rewardHistory.map((entry) => (
              <div key={entry.id} className="timeline-item">
                <div className="timeline-dot" style={{ background: entry.accent }} />
                <div>
                  <div className="timeline-title">{entry.title}</div>
                  <div className="timeline-copy">{entry.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cards-grid-4">
        {supportWorlds.map((world) => (
          <Link key={world.href} href={world.href}>
            <PortalCard {...world} />
          </Link>
        ))}
      </div>

      <SafetyNotice />
    </AppShell>
  );
}
