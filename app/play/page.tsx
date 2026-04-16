"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const playCards = [
  {
    href: "/rewards",
    title: "Rewardy",
    text: "Daily chest, krysztaly, streak i premium preview zebrane w jednym spokojnym loopie.",
    icon: "RW",
    badge: "loop",
    eyebrow: "daily return",
    cta: "Open rewards",
  },
  {
    href: "/games",
    title: "Mini-gry",
    text: "Krótka rozrywka, ktora resetuje uwage i wzmacnia przyjemnosc wracania do produktu.",
    icon: "GM",
    badge: "arcade",
    eyebrow: "soft play",
    cta: "Open games",
  },
];

export default function PlayPage() {
  const { state, derived } = useApp();

  return (
    <AppShell
      title="Play"
      subtitle="Ta strefa trzyma reward economy i mini-gry razem, zeby rozrywka byla lekka, premium i sensownie wpleciona w caly produkt."
      heroCode="PL"
      rightPanel={
        <div className="right-list">
          <div className="kpi-card highlight">
            <div className="kpi-label">Play stats</div>
            <div className="small-note">Snake {state.gameStats.snakeBest}</div>
            <div className="small-note">Clicker {state.gameStats.clickerBest}</div>
            <div className="small-note">Memory {state.gameStats.memoryBest ?? "--"}</div>
            <div className="small-note">Chaos {state.gameStats.chaosBest}</div>
          </div>
          <SafetyNotice compact />
        </div>
      }
    >
      <div className="cards-grid-2">
        {playCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <PortalCard {...card} />
          </Link>
        ))}
      </div>

      <div className="editorial-grid">
        <div className="editorial-card editorial-card-featured">
          <div className="editorial-kicker">A better return loop</div>
          <div className="editorial-title">Rozrywka ma wspierac spokoj, nie odwracac uwagi od sensu aplikacji</div>
          <div className="editorial-copy">
            W najlepszych produktach lekka zabawa nie konkuruje z glownej wartoscia. Ona daje rytm,
            satysfakcje i powod, zeby wejsc jeszcze raz bez poczucia przesytu.
          </div>
          <div className="soft-list">
            <div className="soft-list-item">Daily reward daje mile pierwsze klikniecie.</div>
            <div className="soft-list-item">Rewarded flow przedluza sesje bez agresji.</div>
            <div className="soft-list-item">Mini-gry domykaja dzien bardziej jak ritual niz jak chaos.</div>
          </div>
        </div>

        <div className="editorial-card">
          <div className="editorial-kicker">Today</div>
          <div className="editorial-title">
            {derived.dailyReady ? "Skrzynia dnia podniesie wejscie" : "Dzisiaj postaw na lekki reset"}
          </div>
          <div className="editorial-copy">
            {derived.dailyReady
              ? "Odbior rewardu to najprostszy start sesji i najlepszy pretekst do dalszego ruchu."
              : "Daily jest juz zamkniete, wiec sensowniejszy bedzie Memory, Snake albo szybkie kolo nagrod."}
          </div>
          <div className="editorial-cta">
            {derived.dailyReady ? "Open rewards" : "Open games"}
          </div>
        </div>

        <div className="editorial-card">
          <div className="editorial-kicker">Mood of play</div>
          <div className="editorial-title">Lekko, pieknie, bez tandety</div>
          <div className="editorial-copy">
            Tutaj nie robimy taniego arcade. To ma byc subtelna warstwa premium,
            ktora daje przyjemnosc i reset, ale nadal pasuje do psychologii i self-helpu.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
