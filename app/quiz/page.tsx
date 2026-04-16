import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";

export default function QuizPage() {
  return (
    <AppShell
      title="Quizy"
      subtitle="Miejsce pod szybkie diagnozy, testy osobowości i ścieżki wejścia."
    >
      <div className="cards-grid-4">
        <PortalCard
          title="Relacja"
          text="Czy ta relacja Cię wzmacnia czy osłabia?"
        />
        <PortalCard
          title="Emocje"
          text="Jaki jest Twój aktualny stan?"
        />
        <PortalCard
          title="Granice"
          text="Na ile umiesz stawiać granice?"
        />
        <PortalCard
          title="Energia"
          text="Czy jesteś w przeciążeniu czy w ruchu?"
        />
      </div>
    </AppShell>
  );
}