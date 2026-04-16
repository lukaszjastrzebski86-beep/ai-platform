"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const games = [
  {
    href: "/games/snake",
    title: "Snake // zbieraj swiatlo",
    text: "Spokojny reskin klasyka z globalnymi rewardami i najlepszym wynikiem.",
    icon: "SN",
    badge: "reflex",
    eyebrow: "light run",
  },
  {
    href: "/games/memory",
    title: "Memory emocji",
    text: "Paruj pozytywne stany i trenuj lagodna uwage zamiast chaosu.",
    icon: "MM",
    badge: "focus",
    eyebrow: "match pairs",
  },
  {
    href: "/games/clicker",
    title: "Laduj energie",
    text: "Najprostsza petla powrotu: klik, combo, boost, upgrade i swiatlo.",
    icon: "CK",
    badge: "idle",
    eyebrow: "charge",
  },
  {
    href: "/games/chaos",
    title: "Rozbij chaos",
    text: "Krotka gra refleksowa do resetu uwagi i szybkiego uspokojenia rytmu.",
    icon: "CH",
    badge: "arcade",
    eyebrow: "burst",
  },
];

export default function GamesPage() {
  const { state } = useApp();

  return (
    <AppShell
      title="Mini-gry"
      subtitle="Gaming-social feel jest tu delikatny, ale skuteczny. Gry daja reset, rewardy i naturalny powod, zeby jeszcze raz otworzyc portal."
      heroCode="GM"
      rightPanel={
        <div className="right-list">
          <div className="kpi-card highlight">
            <div className="kpi-label">Top scores</div>
            <div className="small-note">Snake {state.gameStats.snakeBest}</div>
            <div className="small-note">Clicker {state.gameStats.clickerBest}</div>
            <div className="small-note">Memory {state.gameStats.memoryBest ?? "--"}</div>
            <div className="small-note">Chaos {state.gameStats.chaosBest}</div>
          </div>
          <SafetyNotice compact />
        </div>
      }
    >
      <div className="cards-grid-4">
        {games.map((game) => (
          <Link key={game.href} href={game.href}>
            <PortalCard {...game} />
          </Link>
        ))}
      </div>

      <div className="result-box">
        <strong>Design celu gier</strong>
        <p>
          Te mini-gry nie maja przytlaczac. Ich rola to dodawac lekki ruch,
          rytm i satysfakcje miedzy modulami journal, AI i rewardow.
        </p>
      </div>
    </AppShell>
  );
}
