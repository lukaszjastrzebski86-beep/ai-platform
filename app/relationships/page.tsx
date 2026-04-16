import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";

export default function RelationshipsPage() {
  return (
    <AppShell
      title="Relacje"
      subtitle="Osobna przestrzeń dla analizy sygnałów, granic, komunikacji i dynamiki."
    >
      <div className="cards-grid-3">
        <PortalCard
          title="Czerwone flagi"
          text="Rozpoznawanie manipulacji, presji i niespójnych zachowań."
        />
        <PortalCard
          title="Granice"
          text="Miejsce pod ćwiczenia i szablony rozmów o granicach."
        />
        <PortalCard
          title="Komunikacja"
          text="Przyszłe rozwinięcie: gotowe ścieżki rozmowy i scenariusze."
        />
      </div>
    </AppShell>
  );
}