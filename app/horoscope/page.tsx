"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

const zodiacSigns = [
  "Baran",
  "Byk",
  "Bliźnięta",
  "Rak",
  "Lew",
  "Panna",
  "Waga",
  "Skorpion",
  "Strzelec",
  "Koziorożec",
  "Wodnik",
  "Ryby",
];

const horoscopeMap: Record<string, string> = {
  Baran: "Dziś energia pcha Cię do działania. Uważaj tylko na zbyt szybki impuls.",
  Byk: "To dobry dzień na porządkowanie i odzyskanie stabilności.",
  Bliźnięta: "Myśli będzie dużo. Najwięcej zyskasz, gdy wybierzesz jedną rzecz.",
  Rak: "Dziś bardziej czuć emocje. To dobry moment na miękkość i prawdę.",
  Lew: "Masz potencjał przyciągania energii i uwagi. Użyj go świadomie.",
  Panna: "Prosty ruch da dziś więcej niż próba idealnej kontroli.",
  Waga: "Relacje i balans będą dziś ważne. Zobacz, gdzie tracisz siebie.",
  Skorpion: "Dziś wyczuwasz więcej pod powierzchnią. Użyj tego do prawdy.",
  Strzelec: "Szukaj kierunku, nie tylko ruchu. Sens wygra z rozproszeniem.",
  Koziorożec: "Konkrety są dobre, ale nie kosztem własnej energii.",
  Wodnik: "Świeże spojrzenie może dziś dać najlepszy efekt.",
  Ryby: "Intuicja jest mocna. Zatrzymaj się przy tym, co czujesz naprawdę.",
};

export default function HoroscopePage() {
  const [zodiac, setZodiac] = useState("Waga");

  return (
    <AppShell
      title="Horoskop"
      subtitle="Dzienna energia znaku jako osobna zakładka jak w portalu lifestyle/gaming."
    >
      <div className="stack">
        <select
          className="select"
          value={zodiac}
          onChange={(e) => setZodiac(e.target.value)}
        >
          {zodiacSigns.map((sign) => (
            <option key={sign} value={sign}>
              {sign}
            </option>
          ))}
        </select>

        <div className="result-box">{horoscopeMap[zodiac]}</div>
      </div>
    </AppShell>
  );
}