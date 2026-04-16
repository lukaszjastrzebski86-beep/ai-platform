"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const taskCards = [
  {
    id: "daily",
    title: "Task dnia",
    description: "Nazwij jedna emocje, jeden fakt i jeden realny ruch na dzis.",
    reward: "+1 analiza",
  },
  {
    id: "minimum",
    title: "Plan minimum",
    description: "Zamien chaos w zadanie, ktore da sie zrobic w mniej niz 10 minut.",
    reward: "+8 diamonds",
  },
  {
    id: "boundaries",
    title: "Quest granic",
    description: "Przygotuj jedno spokojne zdanie, ktore chroni Twoja przestrzen.",
    reward: "+14 light",
  },
];

const sevenDayPath = [
  "Dzien 1 // Nazwij stan",
  "Dzien 2 // Zobacz sygnaly w relacji",
  "Dzien 3 // Odetnij jeden szum",
  "Dzien 4 // Wypisz granice",
  "Dzien 5 // Zrob journal check",
  "Dzien 6 // Zagraj w reset game",
  "Dzien 7 // Podsumuj postep",
];

export default function TasksPage() {
  const { derived, markQuestComplete } = useApp();
  const [completed, setCompleted] = useState<string[]>([]);

  function completeTask(title: string) {
    if (completed.includes(title)) {
      return;
    }

    setCompleted((current) => [...current, title]);
    markQuestComplete(title);
  }

  return (
    <AppShell
      title="Zadania i sciezki"
      subtitle="Mikro-zadania maja dawac poczucie ruchu i kontroli. Zero ogromnych planow, duzo realnych krokow, ktore mozna domknac jeszcze dzis."
      heroCode="TS"
      rightPanel={
        <div className="right-list">
          <div className="list-panel">
            <div className="section-headline">Mission board</div>
            {derived.missions.map((mission) => (
              <div key={mission.id} className="mission-row">
                <strong>{mission.title}</strong>
                <div className="small-note">{mission.detail}</div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(mission.progress / mission.goal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <SafetyNotice compact />
        </div>
      }
    >
      <div className="cards-grid-3">
        {taskCards.map((task) => (
          <div key={task.id} className="profile-panel">
            <div className="section-headline">{task.title}</div>
            <div className="reward-copy">{task.description}</div>
            <div className="status-pill" style={{ marginTop: 16 }}>
              Reward {task.reward}
            </div>
            <div className="button-row" style={{ marginTop: 16 }}>
              <button
                className="action-btn"
                onClick={() => completeTask(task.title)}
                disabled={completed.includes(task.title)}
              >
                {completed.includes(task.title) ? "Zakonczone" : "Oznacz jako zrobione"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="split-grid">
        <div className="list-panel">
          <div className="section-headline">Sciezka 7 dni</div>
          <div className="sheet-list">
            {sevenDayPath.map((item) => (
              <div key={item} className="sheet-item">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="result-box">
          <strong>Dlaczego to dziala</strong>
          <p>
            Zadania nie koncza sie na inspiracji. Kazdy task scala z rewardami,
            journalingiem i AI chatem, dzieki czemu powstaje codzienna petla
            premium zamiast jednorazowej motywacji.
          </p>
          <div className="button-row">
            <Link className="action-btn" href="/journal">
              Otworz journal
            </Link>
            <Link className="action-btn secondary" href="/chat">
              Dopytaj AI
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
