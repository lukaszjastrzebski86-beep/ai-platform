"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

export default function ClickerGame() {
  const { addReward } = useApp();
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(10);

  function handleClick() {
    const points = multiplier;
    setClicks((c) => c + points);
    addReward("light", points);
  }

  function upgrade() {
    if (clicks >= upgradeCost) {
      setClicks((c) => c - upgradeCost);
      setMultiplier((m) => m + 1);
      setUpgradeCost((c) => Math.floor(c * 1.5));
    }
  }

  return (
    <div className="game-shell">
      <div className="cards-grid-3">
        <div className="kpi-card">
          <div className="kpi-label">Kliknięcia</div>
          <div className="kpi-value">{clicks}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Mnożnik</div>
          <div className="kpi-value">x{multiplier}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Światło</div>
          <div className="kpi-value">☀️ {clicks * multiplier}</div>
        </div>
      </div>

      <div className="clicker-wrap">
        <button className="clicker-btn" onClick={handleClick}>
          Kliknij! +{multiplier} ☀️
        </button>

        <div className="button-row">
          <button
            className="action-btn secondary"
            onClick={upgrade}
            disabled={clicks < upgradeCost}
          >
            Upgrade (Koszt: {upgradeCost} kliknięć)
          </button>
        </div>

        <div className="result-box">
          Klikaj przycisk, żeby zbierać światło. Upgrade zwiększa mnożnik za kliknięcie.
        </div>
      </div>
    </div>
  );
}