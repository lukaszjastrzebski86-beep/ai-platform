import AppShell from "@/components/AppShell";
import ChaosBurstGame from "@/components/ChaosBurstGame";
import SafetyNotice from "@/components/SafetyNotice";

export default function ChaosPage() {
  return (
    <AppShell
      title="Rozbij chaos"
      subtitle="Szybka gra refleksowa do resetu uwagi. Krotka, czytelna i wystarczajaco angazujaca, by domknac petle aktywnosci bez przebodzcowania."
      heroCode="CH"
      rightPanel={<SafetyNotice compact />}
    >
      <ChaosBurstGame />
    </AppShell>
  );
}
