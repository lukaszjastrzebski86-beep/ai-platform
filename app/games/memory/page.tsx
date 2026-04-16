import AppShell from "@/components/AppShell";
import MemoryGame from "@/components/MemoryGame";
import SafetyNotice from "@/components/SafetyNotice";

export default function MemoryPage() {
  return (
    <AppShell
      title="Memory emocji"
      subtitle="Delikatna gra fokusowa: odkrywasz pary, zapisujesz rytm uwagi i budujesz spokojny progres bez chaosu."
      heroCode="MM"
      rightPanel={<SafetyNotice compact />}
    >
      <MemoryGame />
    </AppShell>
  );
}
