import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";

export default function EmotionsPage() {
  return (
    <AppShell
      title="Emocje"
      subtitle="Osobna przestrzeń do regulacji, resetu i rozumienia stanu."
    >
      <div className="cards-grid-3">
        <PortalCard
          title="Reset"
          text="Krótki powrót do równowagi, oddech i obniżenie napięcia."
        />
        <PortalCard
          title="Nazwanie stanu"
          text="Porządkowanie chaosu i lepsze rozumienie tego, co się dzieje."
        />
        <PortalCard
          title="Ruch dalej"
          text="Po zrozumieniu stanu: konkretny kolejny krok."
        />
      </div>
    </AppShell>
  );
}