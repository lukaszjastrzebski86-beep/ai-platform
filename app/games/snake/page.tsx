import AppShell from "@/components/AppShell";
import SnakeGame from "@/components/SnakeGame";

export default function SnakePage() {
  return (
    <AppShell
      title="Snake"
      subtitle="Tu jest już prawdziwa mini-gra, nie tylko napis. To osobna podstrona jak w porządnym portalu."
      rightPanel={
        <div className="right-list">
          <div className="result-box">
            Następny krok po wdrożeniu: dopisać reward system i zapis najlepszego wyniku.
          </div>
        </div>
      }
    >
      <SnakeGame />
    </AppShell>
  );
}