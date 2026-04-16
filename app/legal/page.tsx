import AppShell from "@/components/AppShell";

export default function LegalPage() {
  return (
    <AppShell
      title="Legal i wording"
      subtitle="Produkt ma brzmiec bezpiecznie, premium i wspierajaco. Dlatego obietnica jest psychoedukacyjna, a nie medyczna."
      heroCode="LG"
    >
      <div className="cards-grid-3">
        <div className="profile-panel">
          <div className="section-headline">Pozycjonowanie</div>
          <div className="reward-copy">
            Produkt wspiera rozumienie emocji, relacji i codziennych wzorcow.
            Nie obiecuje leczenia, terapii ani diagnostyki.
          </div>
        </div>
        <div className="profile-panel">
          <div className="section-headline">Disclaimery</div>
          <div className="reward-copy">
            To produkt edukacyjny i psychoedukacyjny. Nie zastępuje specjalisty
            i nie sluzy do diagnozy.
          </div>
        </div>
        <div className="profile-panel">
          <div className="section-headline">Pilne sytuacje</div>
          <div className="reward-copy">
            W stanach zagrozenia lub gdy potrzebny jest pilny kontakt z czlowiekiem,
            produkt kieruje do realnej pomocy: zaufanych osob, specjalistow i lokalnych sluzb.
          </div>
        </div>
      </div>

      <div className="result-box">
        <strong>Copy principle</strong>
        <p>
          Mowimy o spokoju, jasnosci, regulacji, refleksji, granicach i rozwoju.
          Nie budujemy glownej obietnicy na jezyku medycznym ani kryzysowym.
        </p>
      </div>
    </AppShell>
  );
}
