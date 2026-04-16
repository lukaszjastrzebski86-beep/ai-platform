import AppShell from "@/components/AppShell";
import ClickerGame from "@/components/ClickerGame";

export default function ClickerPage() {
  return (
    <AppShell
      title="Clicker Game"
      subtitle="Zbieraj światło klikając. Upgrade'uj mnożnik i zwiększaj efektywność."
      rightPanel={
        <div className="right-list">
          <div className="result-box">
            Prosta mechanika grywalizacji. Każdy klik dodaje światło do globalnego stanu.
          </div>
        </div>
      }
    >
      <ClickerGame />
    </AppShell>
  );
}