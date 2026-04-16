import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";

export default function TasksPage() {
  return (
    <AppShell
      title="Zadania"
      subtitle="Osobna przestrzeń na misje, wyzwania i daily taski."
    >
      <div className="cards-grid-3">
        <PortalCard title="Task dnia" text="Jedno zadanie, jeden ruch, jeden progres." />
        <PortalCard title="Challenge 7 dni" text="Rozwinięcie na serię wejść i streak." />
        <PortalCard title="Quest relacji" text="Scenariusze pod rozmowy i obserwację." />
      </div>
    </AppShell>
  );
}