"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

const tarotDeck = [
  { name: "Głupiec", meaning: "Nowy początek, ruch i odwaga wejścia w nieznane." },
  { name: "Mag", meaning: "Sprawczość, energia i używanie swoich zasobów." },
  { name: "Kapłanka", meaning: "Intuicja, cisza i wewnętrzna prawda." },
  { name: "Słońce", meaning: "Jasność, ulga, prawda i dobry moment na działanie." },
  { name: "Siła", meaning: "Spokojna moc, regulacja energii i wytrwałość." },
];

export default function TarotPage() {
  const [card, setCard] = useState<{ name: string; meaning: string } | null>(null);

  function draw() {
    const random = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    setCard(random);
  }

  return (
    <AppShell
      title="Tarot"
      subtitle="Karta dnia jako osobna przestrzeń, a nie tylko blok na jednej stronie."
    >
      <div className="stack">
        <button className="action-btn" onClick={draw}>
          Losuj kartę dnia
        </button>

        {card && (
          <div className="result-box">
            <strong>{card.name}</strong>
            <div style={{ marginTop: 8 }}>{card.meaning}</div>
          </div>
        )}
      </div>
    </AppShell>
  );
}