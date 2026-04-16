"use client";

import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const freeFeatures = [
  "Ograniczony chat i analiza",
  "1 test dziennie",
  "1 zadanie dnia",
  "Rewardy, gry i podstawowe boosty",
];

const premiumFeatures = [
  "Wyzszy limit lub nielimitowane AI",
  "Dluzsze analizy i raporty premium",
  "Sciezki 7 / 14 / 30 dni",
  "Wieksza liczba slotow i lepsze boosty",
  "Personal roadmap i mocniejsze daily loops",
];

export default function PremiumPage() {
  const { state } = useApp();

  return (
    <AppShell
      title="Premium"
      subtitle="Monetyzacja ma byc naturalnym rozwinięciem wartosci, nie agresywnym paywallem. Ten ekran ustawia jasny podzial free vs premium i przygotowuje miejsce pod checkout flow."
      heroCode="PR"
      rightPanel={<SafetyNotice compact />}
    >
      <div className="cards-grid-2">
        <div className="profile-panel">
          <div className="section-headline">Free</div>
          <div className="sheet-list">
            {freeFeatures.map((item) => (
              <div key={item} className="sheet-item">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="profile-panel">
          <div className="section-headline">Premium</div>
          <div className="sheet-list">
            {premiumFeatures.map((item) => (
              <div key={item} className="sheet-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="result-box">
        <strong>Stan obecny</strong>
        <p>
          Uzytkownik ma aktywne {state.usage.premiumMinutes} minut premium preview.
          Docelowo ten ekran spina upgrade, billing, pakiety premium i dodatkowa walute.
        </p>
      </div>
    </AppShell>
  );
}
