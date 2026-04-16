"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

const NODE_COUNT = 9;

export default function ChaosBurstGame() {
  const { state, grantRewards, recordGameScore } = useApp();
  const [phase, setPhase] = useState<"idle" | "live" | "over">("idle");
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);

  function start() {
    setPhase("live");
    setActiveNode(Math.floor(Math.random() * NODE_COUNT));
    setScore(0);
    setMisses(0);
    setTimeLeft(25);
    setSubmittedScore(null);
  }

  useEffect(() => {
    if (phase !== "live") {
      return;
    }

    const spawnInterval = window.setInterval(() => {
      setMisses((value) => (activeNode === null ? value : value + 1));
      setActiveNode(Math.floor(Math.random() * NODE_COUNT));
    }, 800);

    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(spawnInterval);
          setPhase("over");
          setActiveNode(null);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(spawnInterval);
      window.clearInterval(timer);
    };
  }, [phase, activeNode]);

  useEffect(() => {
    if (phase !== "over" || submittedScore === score) {
      return;
    }

    recordGameScore("chaos", score);
    grantRewards(
      {
        diamonds: Math.max(1, Math.floor(score / 8)),
        light: score * 2,
        xp: score * 3,
      },
      {
        title: "Chaos breaker session",
        detail: `Wyczyszczono ${score} fal chaosu przy ${misses} pomylkach.`,
        source: "game",
        accent: "#ff8d86",
      }
    );
    setSubmittedScore(score);
  }, [phase, score, submittedScore, misses, grantRewards, recordGameScore]);

  function handleNodeClick(index: number) {
    if (phase !== "live") {
      return;
    }

    if (index === activeNode) {
      setScore((value) => value + 1);
      setActiveNode(Math.floor(Math.random() * NODE_COUNT));
      grantRewards({ light: 2, xp: 2 });
      return;
    }

    setMisses((value) => value + 1);
  }

  return (
    <div className="game-shell">
      <div className="cards-grid-4">
        <div className="kpi-card">
          <div className="kpi-label">Wynik</div>
          <div className="kpi-value">{score}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Czas</div>
          <div className="kpi-value">{timeLeft}s</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Best</div>
          <div className="kpi-value">{Math.max(state.gameStats.chaosBest, score)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pomylki</div>
          <div className="kpi-value">{misses}</div>
        </div>
      </div>

      <div className="memory-toolbar">
        <div className="small-note">
          Klikaj tylko aktywne pole i zamieniaj chaos w skupienie.
        </div>
        <button className="action-btn" onClick={start}>
          {phase === "live" ? "Restart run" : "Start run"}
        </button>
      </div>

      <div className="cards-grid-3">
        {Array.from({ length: NODE_COUNT }).map((_, index) => {
          const active = index === activeNode;

          return (
            <button
              key={index}
              className={`reward-item ${active ? "active" : ""}`}
              onClick={() => handleNodeClick(index)}
              style={{
                minHeight: 110,
                justifyContent: "center",
                textAlign: "center",
                boxShadow: active ? "0 0 36px rgba(255, 186, 107, 0.28)" : "none",
              }}
            >
              <span className="reward-title">{active ? "BREAK" : "CALM"}</span>
              <span className="reward-copy">
                {active ? "Rozbij aktywna fale chaosu" : "Czekaj na kolejna fale"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="result-box">
        Lekka gra refleksowa do resetu uwagi. Krotka sesja ma porzadkowac napiecie
        i dawac szybki, satysfakcjonujacy return loop.
      </div>
    </div>
  );
}
