"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";

function calcLifePath(dateStr: string) {
  if (!dateStr) return null;
  const digits = dateStr.replaceAll("-", "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum)
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }

  return sum;
}

function meaning(value: number | null) {
  if (value === null) return "";
  const map: Record<number, string> = {
    1: "Liczba 1: niezależność, inicjatywa i własna ścieżka.",
    2: "Liczba 2: relacje, współpraca i wyczucie energii innych.",
    3: "Liczba 3: ekspresja, kreatywność i komunikacja.",
    4: "Liczba 4: struktura, dyscyplina i budowanie stabilności.",
    5: "Liczba 5: zmiana, ruch i wolność.",
    6: "Liczba 6: troska, bliskość i odpowiedzialność.",
    7: "Liczba 7: refleksja, intuicja i głębia.",
    8: "Liczba 8: sprawczość, wynik i wpływ.",
    9: "Liczba 9: sens, empatia i większa perspektywa.",
    11: "Liczba 11: silna intuicja i inspiracja.",
    22: "Liczba 22: wielka wizja połączona z wykonaniem.",
    33: "Liczba 33: energia przewodnika i świadomego wsparcia.",
  };
  return map[value] || "";
}

export default function NumerologyPage() {
  const [birthDate, setBirthDate] = useState("");
  const path = useMemo(() => calcLifePath(birthDate), [birthDate]);

  return (
    <AppShell
      title="Numerologia"
      subtitle="Osobna przestrzeń pod obliczenia i interpretacje numerologiczne."
    >
      <div className="stack">
        <input
          className="input"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        {path !== null && (
          <div className="result-box">
            <strong>Twoja liczba drogi życia: {path}</strong>
            <div style={{ marginTop: 8 }}>{meaning(path)}</div>
          </div>
        )}
      </div>
    </AppShell>
  );
}