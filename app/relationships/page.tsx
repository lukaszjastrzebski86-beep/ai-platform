import Link from "next/link";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";
import SafetyNotice from "@/components/SafetyNotice";

export default function RelationshipsPage() {
  return (
    <AppShell
      title="Relacje"
      subtitle="Modul do czytania sygnalow, stawiania granic i porzadkowania dynamiki bez medycznych obietnic, za to z jasnym i bezpiecznym jezykiem."
      heroCode="RL"
      rightPanel={<SafetyNotice compact />}
    >
      <div className="cards-grid-3">
        <PortalCard
          title="Sygaly ostrzegawcze"
          text="Mapa czerwonych flag, sygnalow presji i zachowan, ktore warto nazwac po imieniu."
          icon="RF"
          badge="clarity"
          eyebrow="red flags"
        />
        <PortalCard
          title="Granice"
          text="Mikro-scenariusze rozmowy, nazwanie potrzeb i spokojny jezyk komunikacji."
          icon="BD"
          badge="safety"
          eyebrow="boundaries"
        />
        <PortalCard
          title="Zielone flagi"
          text="Co wzmacnia relacje: konsekwencja, poczucie spokoju, wzajemnosc i szacunek."
          icon="GF"
          badge="healthy"
          eyebrow="green flags"
        />
      </div>

      <div className="detail-grid">
        <div className="list-panel">
          <div className="section-headline">Pytania, ktore porzadkuja relacje</div>
          <div className="sheet-list">
            <div className="sheet-item">
              <span className="sheet-step">1.</span>
              Czy po kontakcie z ta osoba mam wiecej spokoju czy wiecej napiecia?
            </div>
            <div className="sheet-item">
              <span className="sheet-step">2.</span>
              Czy moje granice sa slyszane bez karania cisza, presja albo winą?
            </div>
            <div className="sheet-item">
              <span className="sheet-step">3.</span>
              Czy moge byc soba bez ciaglego dostosowywania sie?
            </div>
          </div>
        </div>

        <div className="result-box">
          <strong>Najlepszy kolejny krok</strong>
          <p>
            Najpierw nazwij fakt, potem emocje, dopiero na koncu interpretacje.
            To zwykle najszybciej zmniejsza chaos i ryzyko nadmiernych zalozen.
          </p>
          <div className="button-row">
            <Link className="action-btn" href="/chat">
              Otworz AI Chat
            </Link>
            <Link className="action-btn secondary" href="/tasks">
              Przejdz do taskow
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
