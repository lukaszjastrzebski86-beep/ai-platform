"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

const wheelRewards = [
  "💎 +10 diamentów",
  "☀️ +20 światła",
  "⚡ +8 energii",
  "🎁 bonus dnia",
  "🔥 +1 do streaka",
  "🌈 super boost",
];

export default function RewardsPage() {
  const [daily, setDaily] = useState(false);
  const [wheel, setWheel] = useState("");

  function claim() {
    setDaily(true);
  }

  function spin() {
    setWheel(wheelRewards[Math.floor(Math.random() * wheelRewards.length)]);
  }

  return (
    <AppShell
      title="Rewardy"
      subtitle="Osobna strefa nagród, streaków, bonusów i mechanik powrotu."
    >
      <div className="cards-grid-2">
        <div className="portal-card glass">
          <div className="portal-card-title">Daily reward</div>
          <div className="portal-card-text">
            Odbierz codzienny bonus i utrzymaj ciągłość.
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="action-btn" onClick={claim}>
              {daily ? "Odebrane ✅" : "Odbierz"}
            </button>
          </div>
        </div>

        <div className="portal-card glass">
          <div className="portal-card-title">Koło fortuny</div>
          <div className="portal-card-text">
            Jedno kliknięcie, szybka nagroda, klimat gry online.
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="action-btn" onClick={spin}>
              Zakręć
            </button>
          </div>
          {wheel && <div className="result-box" style={{ marginTop: 14 }}>{wheel}</div>}
        </div>
      </div>
    </AppShell>
  );
}