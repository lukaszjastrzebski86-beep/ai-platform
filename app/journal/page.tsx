"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const moods = [
  "Spokoj",
  "Wdziecznosc",
  "Napiecie",
  "Chaos",
  "Ulga",
  "Motywacja",
];

export default function JournalPage() {
  const { state, addJournalEntry } = useApp();
  const [mood, setMood] = useState(moods[0]);
  const [focus, setFocus] = useState("odzyskac spokoj");
  const [note, setNote] = useState("");
  const [energy, setEnergy] = useState(70);

  function saveEntry() {
    if (!note.trim()) {
      return;
    }

    addJournalEntry({
      mood,
      note,
      focus,
      energy,
    });
    setNote("");
  }

  return (
    <AppShell
      title="Journal i mood tracking"
      subtitle="Wpis dnia laczy refleksje, wybor nastroju i lekki tracking. To bardziej premium check-in niz klasyczny notes."
      heroCode="JR"
      rightPanel={
        <div className="right-list">
          <div className="kpi-card highlight">
            <div className="kpi-label">Historia</div>
            <div className="kpi-value">{state.journalEntries.length}</div>
            <div className="small-note">
              Kazdy wpis doklada light, XP i lepsza orientacje w sobie.
            </div>
          </div>
          <SafetyNotice compact />
        </div>
      }
    >
      <div className="daily-grid">
        <div className="profile-panel">
          <div className="section-headline">Nowy wpis</div>
          <div className="quick-prompt-row">
            {moods.map((item) => (
              <button
                key={item}
                className={`quick-prompt-chip ${mood === item ? "active" : ""}`}
                onClick={() => setMood(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="stack" style={{ marginTop: 16 }}>
            <input
              className="input"
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
              placeholder="Na czym chcesz sie dzis skupic?"
            />
            <textarea
              className="textarea"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Co sie wydarzylo, co czujesz i jaki jest jeden kolejny krok?"
            />
            <label className="small-note">Poziom energii: {energy}</label>
            <input
              type="range"
              min={0}
              max={100}
              value={energy}
              onChange={(event) => setEnergy(Number(event.target.value))}
            />
            <div className="button-row">
              <button className="action-btn" onClick={saveEntry}>
                Zapisz wpis
              </button>
            </div>
          </div>
        </div>

        <div className="profile-panel">
          <div className="section-headline">Historia</div>
          <div className="sheet-list">
            {state.journalEntries.map((entry) => (
              <div key={entry.id} className="sheet-item">
                <span className="sheet-step">
                  {entry.createdAt} // {entry.mood}
                </span>
                <div className="reward-copy">{entry.note}</div>
                <div className="small-note">
                  Fokus: {entry.focus} // energia {entry.energy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
