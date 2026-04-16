"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const primaryCards = [
  {
    href: "/chat",
    title: "AI Chat",
    text: "Jedna inteligentna rozmowa, ktora porzadkuje emocje, relacje i przeciążenie bez lania wody.",
    icon: "AI",
    badge: "core",
    eyebrow: "clarity",
    cta: "Talk with AI",
  },
  {
    href: "/journal",
    title: "Journal",
    text: "Najlzejszy sposob, zeby zaczac dzien od refleksji zamiast od chaosu.",
    icon: "JR",
    badge: "daily",
    eyebrow: "check-in",
    cta: "Open journal",
  },
  {
    href: "/quiz",
    title: "Quizy",
    text: "Krotkie testy, ktore szybko pokazuja wzorzec i podpowiadaja kolejny ruch.",
    icon: "QZ",
    badge: "insight",
    eyebrow: "guided",
    cta: "Open quizzes",
  },
];

const specialistModes = [
  {
    title: "Emocje",
    copy: "Tryb do regulacji, nazwania stanu i schodzenia z napiecia do prostszego kontaktu ze soba.",
    href: "/emotions",
    action: "Open emotions mode",
  },
  {
    title: "Relacje",
    copy: "Tryb do sygnalow, granic i uporzadkowania tego, co sie dzieje miedzy Toba a druga osoba.",
    href: "/relationships",
    action: "Open relationships mode",
  },
];

export default function PracticePage() {
  const { state } = useApp();

  return (
    <AppShell
      title="Practice"
      subtitle="To glowna strefa pracy ze soba. Zamiast wielu rozproszonych zakladek zbiera najwazniejsze wejscia w jeden premium rytm."
      heroCode="PC"
      rightPanel={
        <div className="right-list">
          <div className="kpi-card highlight">
            <div className="kpi-label">Practice today</div>
            <div className="small-note">AI analizy: {state.usage.analysesLeft}</div>
            <div className="small-note">Quizy: {state.usage.testsLeft}</div>
            <div className="small-note">Taski: {state.usage.aiCredits}</div>
          </div>
          <SafetyNotice compact />
        </div>
      }
    >
      <div className="cards-grid-3">
        {primaryCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <PortalCard {...card} />
          </Link>
        ))}
      </div>

      <div className="editorial-grid">
        <div className="editorial-card editorial-card-featured">
          <div className="editorial-kicker">Suggested route</div>
          <div className="editorial-title">Najpierw zlap kontakt ze soba, dopiero potem wchodz glebiej</div>
          <div className="editorial-copy">
            W praktyce najlepszy efekt daje prosta kolejnosc: journal, AI, jedno zadanie albo quiz.
            To porzadkuje dzien bez przebodzcowania i bez poczucia, ze trzeba "zrobic wszystko".
          </div>
          <div className="soft-list">
            <div className="soft-list-item">Check-in: nazwij nastroj i energie.</div>
            <div className="soft-list-item">AI: popros o krotsza albo glebsza odpowiedz.</div>
            <div className="soft-list-item">Task: wybierz jeden maly ruch na dzisiaj.</div>
          </div>
        </div>

        {specialistModes.map((mode) => (
          <Link key={mode.title} href={mode.href} className="editorial-card">
            <div className="editorial-kicker">Special mode</div>
            <div className="editorial-title">{mode.title}</div>
            <div className="editorial-copy">{mode.copy}</div>
            <div className="editorial-cta">{mode.action}</div>
          </Link>
        ))}
      </div>

      <div className="showcase-banner">
        <div className="showcase-copy">
          <div className="editorial-kicker">Why this section works</div>
          <div className="editorial-title">Mniej decyzji, lepsza jakosc wejscia</div>
          <div className="editorial-copy">
            Uzytkownik widzi jeden obszar Practice zamiast wielu rownorzednych modulow.
            To daje profesjonalny, spokojny UX i wyzsza szanse, ze rzeczywiscie zacznie korzystac.
          </div>
        </div>

        <div className="showcase-badges">
          <div className="showcase-badge">
            <span>Chat</span>
            <strong>AI</strong>
          </div>
          <div className="showcase-badge">
            <span>Journal</span>
            <strong>Daily</strong>
          </div>
          <div className="showcase-badge">
            <span>Quiz</span>
            <strong>Fast</strong>
          </div>
          <div className="showcase-badge">
            <span>Task</span>
            <strong>One step</strong>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
