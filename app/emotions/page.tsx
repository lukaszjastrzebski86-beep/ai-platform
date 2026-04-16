import Link from "next/link";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";
import SafetyNotice from "@/components/SafetyNotice";

export default function EmotionsPage() {
  return (
    <AppShell
      title="Emocje"
      subtitle="Przestrzen do nazywania stanu, odzyskiwania oddechu i przechodzenia od chaosu do prostego, wykonalnego kolejnego kroku."
      heroCode="EM"
      rightPanel={<SafetyNotice compact />}
    >
      <div className="cards-grid-3">
        <PortalCard
          title="Nazwij stan"
          text="Delikatne uporzadkowanie: co teraz czujesz, gdzie to czujesz i czego potrzebujesz."
          icon="NM"
          badge="clarity"
          eyebrow="labeling"
        />
        <PortalCard
          title="Reset napiecia"
          text="Krotkie rytualy wyciszenia, ktore maja od razu obnizyc tarcie wewnetrzne."
          icon="RS"
          badge="calm"
          eyebrow="regulation"
        />
        <PortalCard
          title="Ruch dalej"
          text="Po rozpoznaniu emocji aplikacja prowadzi do mikro-zadania, nie do kolejnego scrolla."
          icon="NX"
          badge="action"
          eyebrow="next step"
        />
      </div>

      <div className="split-grid">
        <div className="list-panel">
          <div className="section-headline">Mikro-protokol spokoju</div>
          <div className="sheet-list">
            <div className="sheet-item">
              <span className="sheet-step">A.</span>
              Zatrzymaj sie i nazwij jedna emocje bez oceny.
            </div>
            <div className="sheet-item">
              <span className="sheet-step">B.</span>
              Wydluz wydech i sprawdz, czy cialo odpuszcza choc odrobine.
            </div>
            <div className="sheet-item">
              <span className="sheet-step">C.</span>
              Zapisz tylko jeden kolejny ruch, ktory jest realny na dzisiaj.
            </div>
          </div>
        </div>

        <div className="result-box">
          <strong>W tej aplikacji emocje nie sa problemem do naprawy</strong>
          <p>
            Sa informacja. Produkt pomaga je zobaczyc, nazwac i przejsc z nimi
            do lepszego codziennego wyboru.
          </p>
          <div className="button-row">
            <Link className="action-btn" href="/journal">
              Zapisz wpis dnia
            </Link>
            <Link className="action-btn secondary" href="/chat">
              Porozmawiaj z AI
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
