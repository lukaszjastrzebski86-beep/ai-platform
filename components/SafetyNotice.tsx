import Link from "next/link";

export default function SafetyNotice({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="result-box">
      <strong>Wazne</strong>
      {compact ? (
        <p>
          To produkt psychoedukacyjny i wspierajacy. Nie zastepuje specjalisty
          i nie sluzy do diagnozy.
        </p>
      ) : (
        <>
          <p>
            To produkt psychoedukacyjny i wspierajacy. Pomaga porzadkowac
            emocje, relacje oraz codzienne nawyki, ale nie zastepuje specjalisty
            i nie sluzy do diagnozy.
          </p>
          <p>
            Jesli czujesz, ze potrzebujesz pilnego kontaktu z czlowiekiem lub
            Twoje bezpieczenstwo jest zagrozone, skorzystaj z realnego wsparcia
            zaufanej osoby, lokalnych sluzb albo specjalisty.
          </p>
          <p>
            Pelny wording i zasady znajdziesz w <Link href="/legal">sekcji legal</Link>.
          </p>
        </>
      )}
    </div>
  );
}
