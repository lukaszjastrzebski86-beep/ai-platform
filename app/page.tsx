import Link from "next/link";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";

export default function HomePage() {
  return (
    <AppShell
      title="Wejdź do świata AI"
      subtitle="To już nie jest jedna długa strona. To portal z osobnymi przestrzeniami: AI, rewardy, tarot, numerologia i gry."
      rightPanel={
        <div className="right-list">
          <div className="kpi-card">
            <div className="kpi-label">Stan</div>
            <div className="kpi-value">Ready</div>
          </div>
          <div className="result-box">
            Każda zakładka prowadzi teraz do osobnej podstrony jak w porządnym
            portalu.
          </div>
        </div>
      }
    >
      <div className="cards-grid-4">
        <Link href="/chat">
          <PortalCard
            title="Chat AI"
            text="Jedno centrum rozmowy i ukryta logika wieloagentowa."
          />
        </Link>
        <Link href="/rewards">
          <PortalCard
            title="Rewardy"
            text="Daily reward, streak, diamenty, bonusy i skrzynki."
          />
        </Link>
        <Link href="/games">
          <PortalCard
            title="Gry"
            text="Przestrzeń pod mini-gry, aktywności i portale interakcji."
          />
        </Link>
        <Link href="/games/snake">
          <PortalCard
            title="Snake"
            text="Prawdziwa mini-gra z planszą, sterowaniem i wynikiem."
          />
        </Link>
      </div>

      <div className="cards-grid-3">
        <Link href="/relationships">
          <PortalCard title="Relacje" text="Analiza sygnałów, granic i dynamiki." />
        </Link>
        <Link href="/emotions">
          <PortalCard title="Emocje" text="Regulacja, napięcie, chaos i jasność." />
        </Link>
        <Link href="/quiz">
          <PortalCard title="Quiz" text="Interaktywne testy i pytania prowadzące." />
        </Link>
      </div>

      <div className="cards-grid-4">
        <Link href="/tasks">
          <PortalCard title="Zadania" text="Challenge, plan minimum i mikro-kroki." />
        </Link>
        <Link href="/tarot">
          <PortalCard title="Tarot" text="Karta dnia i rozkłady 3 kart." />
        </Link>
        <Link href="/horoscope">
          <PortalCard title="Horoskop" text="Dzienna energia dla znaku." />
        </Link>
        <Link href="/numerology">
          <PortalCard title="Numerologia" text="Droga życia i opis energii." />
        </Link>
      </div>

      <div className="cards-grid-2">
        <Link href="/profile">
          <PortalCard
            title="Profil"
            text="Profil użytkownika edytowany komendą, bardziej jak personal hub."
          />
        </Link>
        <Link href="/admin">
          <PortalCard
            title="Admin AI Studio"
            text="Panel do sterowania zmianami strony i live preview."
          />
        </Link>
      </div>
    </AppShell>
  );
}