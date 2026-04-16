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
  "Personal roadmap i bardziej miekkie daily loops",
];

const premiumPlans = [
  {
    title: "Monthly",
    badge: "starter premium",
    copy: "Najprostszy sposob, zeby wejsc glebiej w AI, rytual dnia i bardziej luksusowy tryb korzystania.",
  },
  {
    title: "Quarterly",
    badge: "best value",
    copy: "Najlepsza opcja dla budowania prawdziwego nawyku i retencji po pierwszym zachwycie produktem.",
  },
  {
    title: "Boost packs",
    badge: "one-time",
    copy: "Jednorazowe paczki premium preview, waluty i dodatkowych analiz dla mniej zdecydowanych osob.",
  },
];

export default function PremiumPage() {
  const { state } = useApp();

  return (
    <AppShell
      title="Premium"
      subtitle="Premium ma byc naturalnym przedluzeniem wartosci: wiecej glebi, wiecej przestrzeni i bardziej osobisty rytm, a nie agresywny paywall."
      heroCode="PM"
      rightPanel={<SafetyNotice compact />}
    >
      <div className="editorial-grid">
        <div className="editorial-card editorial-card-featured">
          <div className="editorial-kicker">What changes in premium</div>
          <div className="editorial-title">Produkt robi sie bardziej osobisty i bardziej plynny</div>
          <div className="editorial-copy">
            W wersji premium uzytkownik nie kupuje tylko wiekszej liczby funkcji.
            Kupuje wygodniejszy rytm korzystania, glebsze odpowiedzi i poczucie, ze aplikacja lepiej dopasowuje sie do jego dnia.
          </div>
          <div className="soft-list">
            <div className="soft-list-item">Dluzej dziala AI i daje bardziej wartosciowy kontekst.</div>
            <div className="soft-list-item">Sciezki moga prowadzic przez 7, 14 albo 30 dni.</div>
            <div className="soft-list-item">Boosty, waluta i reward loop maja wieksza moc i lepszy sens.</div>
          </div>
        </div>

        <div className="editorial-card">
          <div className="editorial-kicker">Preview status</div>
          <div className="editorial-title">{state.usage.premiumMinutes} minut premium preview</div>
          <div className="editorial-copy">
            Docelowo ten ekran spina upgrade, billing, pakiety premium i dodatkowa walute, ale juz teraz ustawia odpowiedni ton konwersji.
          </div>
        </div>

        <div className="editorial-card">
          <div className="editorial-kicker">Conversion principle</div>
          <div className="editorial-title">Najpierw zaufanie, potem upgrade</div>
          <div className="editorial-copy">
            Free powinno dac ulge i zrozumienie produktu. Premium powinno pojawiac sie wtedy, gdy uzytkownik naprawde chce wiecej.
          </div>
        </div>
      </div>

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

      <div className="cards-grid-3">
        {premiumPlans.map((plan) => (
          <div key={plan.title} className="pricing-card">
            <div className="eyebrow compact">{plan.badge}</div>
            <div className="pricing-title">{plan.title}</div>
            <div className="pricing-copy">{plan.copy}</div>
            <div className="pricing-footer">Prepared for checkout flow</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
