"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const goals = ["Spokoj", "Relacje", "Lepsze granice", "Mniej chaosu"];
const rhythms = ["Wieczorne wyciszenie", "Szybki reset w pracy", "Codzienny journaling", "Delikatna grywalizacja"];
const tones = [
  { id: "soft", label: "Cieply", colors: ["#67d8ff", "#ffba6b"] },
  { id: "focus", label: "Skupiony", colors: ["#67d8ff", "#7cf0c2"] },
  { id: "glow", label: "Swietlisty", colors: ["#ffba6b", "#ff8d86"] },
];

export default function OnboardingPage() {
  const { updateProfile, updateTheme, markQuestComplete } = useApp();
  const [goal, setGoal] = useState(goals[0]);
  const [rhythm, setRhythm] = useState(rhythms[0]);
  const [tone, setTone] = useState(tones[0]);
  const [saved, setSaved] = useState(false);

  const previewLine = `${goal} // ${rhythm} // ${tone.label.toLowerCase()} flow`;

  function saveSetup() {
    updateProfile({
      statusLine: previewLine,
      tags: [goal.toLowerCase(), rhythm.toLowerCase(), "premium support"],
    });
    updateTheme({
      badgeText: `Live mode // ${goal}`,
      accentFrom: tone.colors[0],
      accentTo: tone.colors[1],
    });
    markQuestComplete("Onboarding complete");
    setSaved(true);
  }

  return (
    <AppShell
      title="Start"
      subtitle="Wejscie do produktu ma od razu ustawic spokoj, ton i osobisty kierunek. Ten ekran buduje poczucie, ze aplikacja jest dla mnie, a nie dla wszystkich naraz."
      heroCode="GO"
      rightPanel={
        <div className="right-list">
          <div className="kpi-card highlight">
            <div className="kpi-label">Preview linii</div>
            <div className="kpi-value">{tone.label}</div>
            <div className="small-note">{previewLine}</div>
          </div>
          <SafetyNotice compact />
        </div>
      }
    >
      <div className="daily-grid">
        <div className="profile-panel">
          <div className="section-headline">1. Co chcesz zyskac?</div>
          <div className="cards-grid-2">
            {goals.map((item) => (
              <button
                key={item}
                className={`reward-item ${goal === item ? "active" : ""}`}
                onClick={() => setGoal(item)}
              >
                <span className="reward-title">{item}</span>
                <span className="reward-copy">
                  Ustaw glowny powod codziennego powrotu.
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="profile-panel">
          <div className="section-headline">2. Jak ma pracowac aplikacja?</div>
          <div className="cards-grid-2">
            {rhythms.map((item) => (
              <button
                key={item}
                className={`reward-item ${rhythm === item ? "active" : ""}`}
                onClick={() => setRhythm(item)}
              >
                <span className="reward-title">{item}</span>
                <span className="reward-copy">
                  Dopasowujemy styl sesji do rytmu dnia.
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-panel">
        <div className="section-headline">3. Jaki klimat wybierasz?</div>
        <div className="cards-grid-3">
          {tones.map((item) => (
            <button
              key={item.id}
              className={`reward-item ${tone.id === item.id ? "active" : ""}`}
              onClick={() => setTone(item)}
            >
              <span className="reward-title">{item.label}</span>
              <span className="reward-copy">
                Paleta ustawi badge, akcenty i tempo calego portalu.
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="result-box">
        <strong>Twoj start</strong>
        <p>{previewLine}</p>
        <div className="button-row">
          <button className="action-btn" onClick={saveSetup}>
            Zapisz onboarding
          </button>
          {saved ? <span className="status-pill">Gotowe i zapisane</span> : null}
        </div>
      </div>
    </AppShell>
  );
}
