"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/contexts/AppContext";

export default function ClickerGame() {
  const { state, grantRewards, recordGameScore } = useApp();
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(10);
  const [combo, setCombo] = useState(0);
  const [surgeTicks, setSurgeTicks] = useState(0);
  const [pulseGain, setPulseGain] = useState(0);
  const lastClickAt = useRef(0);

  function handleClick() {
    const now = Date.now();
    const nextCombo = now - lastClickAt.current < 900 ? combo + 1 : 1;
    lastClickAt.current = now;
    setCombo(nextCombo);

    const comboBonus = Math.min(4, nextCombo - 1);
    const surgeBonus = surgeTicks > 0 ? multiplier : 0;
    const points = multiplier + comboBonus + surgeBonus;
    const nextClicks = clicks + points;

    setClicks(nextClicks);
    setPulseGain(points);

    if (surgeTicks > 0) {
      setSurgeTicks((value) => Math.max(0, value - 1));
    }

    grantRewards({
      light: Math.max(1, Math.ceil(points / 3)),
      xp: 1,
      diamonds: nextClicks % 65 < points ? 1 : 0,
    });
  }

  function upgrade() {
    if (clicks < upgradeCost) {
      return;
    }

    setClicks((value) => value - upgradeCost);
    setMultiplier((value) => value + 1);
    setUpgradeCost((value) => Math.floor(value * 1.5));
    grantRewards(
      { xp: 10, energy: 4 },
      {
        title: "Clicker upgrade",
        detail: "Mnoznik energii zostal podniesiony o kolejny poziom.",
        source: "game",
        accent: "#ff8d86",
      }
    );
  }

  function activateSurge() {
    if (clicks < 40 || surgeTicks > 0) {
      return;
    }

    setClicks((value) => value - 40);
    setSurgeTicks(12);
    grantRewards(
      { xp: 12, energy: 6 },
      {
        title: "Charge surge",
        detail: "Aktywowano chwilowy tryb przyspieszenia klikniec.",
        source: "game",
        accent: "#67d8ff",
      }
    );
  }

  useEffect(() => {
    if (clicks > state.gameStats.clickerBest) {
      recordGameScore("clicker", clicks);
    }
  }, [clicks, state.gameStats.clickerBest, recordGameScore]);

  return (
    <div className="game-shell">
      <div className="cards-grid-4">
        <div className="kpi-card">
          <div className="kpi-label">Energia</div>
          <div className="kpi-value">{clicks}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Mnoznik</div>
          <div className="kpi-value">x{multiplier}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Combo</div>
          <div className="kpi-value">{combo}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Best</div>
          <div className="kpi-value">{Math.max(clicks, state.gameStats.clickerBest)}</div>
        </div>
      </div>

      <div className="clicker-wrap">
        <div className="clicker-zone">
          <button className="clicker-btn" onClick={handleClick}>
            Ladowanie energii
            <div className="clicker-value">+{pulseGain || multiplier}</div>
          </button>
          <div className="small-note">
            Rytmiczne klikniecia buduja combo. Burst mode podwaja puls przez 12 tapniec.
          </div>
        </div>

        <div className="button-row">
          <button
            className="action-btn secondary"
            onClick={upgrade}
            disabled={clicks < upgradeCost}
          >
            Upgrade x{multiplier + 1} ({upgradeCost})
          </button>
          <button
            className="action-btn"
            onClick={activateSurge}
            disabled={clicks < 40 || surgeTicks > 0}
          >
            {surgeTicks > 0 ? `Burst x2 // ${surgeTicks}` : "Burst // 40"}
          </button>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, (combo / 8) * 100)}%` }}
          />
        </div>

        <div className="result-box">
          Ladowanie energii daje wspolne swiatlo i XP. To najprostsza petla
          powrotu: jedno klikniecie, szybki progres i wyczuwalny upgrade.
        </div>
      </div>
    </div>
  );
}
