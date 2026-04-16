import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import SnakeGame from "@/components/SnakeGame";

export default function SnakePage() {
  return (
    <AppShell
      title="Snake // zbieraj swiatlo"
      subtitle="Reskin klasycznego Snake'a jest tutaj czescia petli codziennego resetu. Szybka sesja daje rewardy i czucie progresu bez przebodzcowania."
      heroCode="SN"
      rightPanel={<SafetyNotice compact />}
    >
      <SnakeGame />
    </AppShell>
  );
}
