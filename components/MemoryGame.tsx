"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

type MemoryCard = {
  id: string;
  label: string;
  flipped: boolean;
  matched: boolean;
};

const emotions = ["SPOKOJ", "ODWAGA", "ULGA", "GRANICE", "NADZIEJA", "RESET"];

function shuffleDeck() {
  return emotions
    .flatMap((label) => [
      { id: `${label}-a`, label, flipped: false, matched: false },
      { id: `${label}-b`, label, flipped: false, matched: false },
    ])
    .sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const { state, grantRewards, recordGameScore } = useApp();
  const [cards, setCards] = useState<MemoryCard[]>(shuffleDeck);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [phase, setPhase] = useState<"idle" | "live" | "done">("idle");

  const matchedPairs = cards.filter((card) => card.matched).length / 2;

  function reset() {
    setCards(shuffleDeck());
    setFlippedIndices([]);
    setMoves(0);
    setLocked(false);
    setPhase("idle");
  }

  function flipCard(index: number) {
    const card = cards[index];

    if (locked || card.flipped || card.matched) {
      return;
    }

    if (phase === "idle") {
      setPhase("live");
    }

    const nextFlipped = [...flippedIndices, index];
    const nextCards = cards.map((item, itemIndex) =>
      itemIndex === index ? { ...item, flipped: true } : item
    );

    setCards(nextCards);
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length !== 2) {
      return;
    }

    setLocked(true);
    setMoves((value) => value + 1);

    const [firstIndex, secondIndex] = nextFlipped;
    const first = nextCards[firstIndex];
    const second = nextCards[secondIndex];

    window.setTimeout(() => {
      if (first.label === second.label) {
        setCards((current) =>
          current.map((item, itemIndex) =>
            itemIndex === firstIndex || itemIndex === secondIndex
              ? { ...item, matched: true }
              : item
          )
        );

        grantRewards({
          light: 5,
          xp: 6,
        });
      } else {
        setCards((current) =>
          current.map((item, itemIndex) =>
            itemIndex === firstIndex || itemIndex === secondIndex
              ? { ...item, flipped: false }
              : item
          )
        );
      }

      setFlippedIndices([]);
      setLocked(false);
    }, 650);
  }

  useEffect(() => {
    if (cards.length === 0 || cards.some((card) => !card.matched) || phase === "done") {
      return;
    }

    setPhase("done");
    recordGameScore("memory", moves);
    grantRewards(
      {
        diamonds: Math.max(2, Math.floor((28 - moves) / 4)),
        light: 20,
        xp: 26,
      },
      {
        title: "Memory emotions complete",
        detail: `Plansza zostala wyczyszczona w ${moves} ruchach.`,
        source: "game",
        accent: "#7cf0c2",
      }
    );
  }, [cards, phase, moves, grantRewards, recordGameScore]);

  return (
    <div className="game-shell">
      <div className="cards-grid-4">
        <div className="kpi-card">
          <div className="kpi-label">Pary</div>
          <div className="kpi-value">{matchedPairs}/6</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Ruchy</div>
          <div className="kpi-value">{moves}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Best</div>
          <div className="kpi-value">
            {state.gameStats.memoryBest === null ? "--" : state.gameStats.memoryBest}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Tryb</div>
          <div className="kpi-value">{phase === "done" ? "CLEAR" : "FOCUS"}</div>
        </div>
      </div>

      <div className="memory-toolbar">
        <div className="small-note">
          Odkrywaj pary pozytywnych stanow i buduj spokojny rytm uwagi.
        </div>
        <button className="action-btn secondary" onClick={reset}>
          Tasuj plansze
        </button>
      </div>

      <div className="memory-grid">
        {cards.map((card, index) => (
          <button
            key={card.id}
            className={`memory-card ${card.flipped ? "flipped" : ""} ${
              card.matched ? "matched" : ""
            }`}
            onClick={() => flipCard(index)}
            disabled={locked}
          >
            {card.flipped || card.matched ? card.label : "FLOW"}
          </button>
        ))}
      </div>

      <div className="result-box">
        Memory jest lekkim treningiem skupienia i rozpoznawania pozytywnych
        kotwic. Bez presji, za to z czytelnym reward loopem.
      </div>
    </div>
  );
}
