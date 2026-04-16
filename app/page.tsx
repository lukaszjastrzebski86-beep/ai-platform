"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const mainAreas = [
  {
    href: "/practice",
    title: "Practice",
    text: "AI, journal, quizy, relacje i mikro-sciezki w jednym spokojnym miejscu.",
    icon: "PR",
    badge: "core",
    eyebrow: "daily care",
    cta: "Open practice",
  },
  {
    href: "/play",
    title: "Play",
    text: "Rewardy i mini-gry domykajace dzien bez poczucia chaosu albo infantylizacji.",
    icon: "PL",
    badge: "loop",
    eyebrow: "light return",
    cta: "Open play",
  },
  {
    href: "/profile",
    title: "Profile",
    text: "Twoj osobisty rytm, styl i premium progres zebrane w jednej przestrzeni.",
    icon: "PF",
    badge: "identity",
    eyebrow: "your space",
    cta: "Open profile",
  },
];

export default function HomePage() {
  const { state, derived } = useApp();

  const eveningCard =
    state.energy > 75
      ? {
          href: "/quiz",
          title: "Masz jeszcze energie na lekki wglad",
          copy: "Dzisiaj najlepiej zrobic quiz albo wejsc w jedna relacyjna sciezke, zanim energia opadnie.",
          action: "Open quiz",
        }
      : {
          href: "/games/memory",
          title: "Wieczorem postaw na miekki reset",
          copy: "Pamiec emocji albo journal domkna dzien lepiej niz kolejna dawka bodzcow.",
          action: "Open memory",
        };

  return (
    <AppShell
      title={state.theme.heroTitle}
      subtitle="Luma laczy AI, journal, quizy, relacje i lekkie rewardy w jeden portal premium, ktory pomaga wracac do siebie kazdego dnia."
      heroCode="LM"
      rightPanel={
        <div className="right-list">
          <div className="kpi-card highlight">
            <div className="kpi-label">Today at a glance</div>
            <div className="kpi-value">{state.usage.aiCredits + state.usage.analysesLeft}</div>
            <div className="small-note">
              slotow do wykorzystania spokojnie, bez presji i bez przechodzenia przez chaos funkcji.
            </div>
          </div>

          <div className="editorial-card">
            <div className="editorial-kicker">Return loop</div>
            <div className="editorial-title">
              {derived.dailyReady ? "Skrzynia dnia juz czeka" : "Masz juz swoj rytm na dzisiaj"}
            </div>
            <div className="editorial-copy">
              {derived.dailyReady
                ? "Najlepsze pierwsze klikniecie to reward lub szybki check-in. Produkt powinien witac ulga, nie labiryntem."
                : "Daily jest odebrane, wiec kolejnym najlepszym ruchem jest AI, journal albo jedna lekka gra."}
            </div>
          </div>

          <SafetyNotice compact />
        </div>
      }
    >
      <div className="cards-grid-3">
        {mainAreas.map((area) => (
          <Link key={area.href} href={area.href}>
            <PortalCard {...area} />
          </Link>
        ))}
      </div>

      <div className="editorial-grid">
        <div className="editorial-card editorial-card-featured">
          <div className="editorial-kicker">Daily ritual</div>
          <div className="editorial-title">Jedna piekna sciezka na dzien, nie dziesiec osobnych decyzji</div>
          <div className="editorial-copy">
            Najlepsze produkty wellness nie zasypuja modulami. Prowadza przez prosty rytual:
            check-in, jasnosc, ruch i lekki powrot.
          </div>
          <div className="soft-list">
            <div className="soft-list-item">1. Otworz journal i nazwij stan.</div>
            <div className="soft-list-item">2. Wejdz do AI po jedna klarowna odpowiedz.</div>
            <div className="soft-list-item">3. Domknij mikro-zadanie albo quiz.</div>
            <div className="soft-list-item">4. Zakoncz dzien rewardem albo lekka gra.</div>
          </div>
        </div>

        <Link href={state.journalEntries.length < 2 ? "/journal" : "/chat"} className="editorial-card">
          <div className="editorial-kicker">For you now</div>
          <div className="editorial-title">
            {state.journalEntries.length < 2 ? "Zacznij od lekkiego check-inu" : "Masz juz material na glebsza odpowiedz"}
          </div>
          <div className="editorial-copy">
            {state.journalEntries.length < 2
              ? "Masz malo zapisanych refleksji, wiec journal powinien byc pierwszym ruchem zanim wejdziesz w analize."
              : "Masz juz baze wpisow, wiec AI moze poprowadzic Cie dalej bardziej sensownie i bardziej premium."}
          </div>
          <div className="editorial-cta">
            {state.journalEntries.length < 2 ? "Open journal" : "Open AI"}
          </div>
        </Link>

        <Link href={eveningCard.href} className="editorial-card">
          <div className="editorial-kicker">Tonight</div>
          <div className="editorial-title">{eveningCard.title}</div>
          <div className="editorial-copy">{eveningCard.copy}</div>
          <div className="editorial-cta">{eveningCard.action}</div>
        </Link>
      </div>

      <div className="showcase-banner">
        <div className="showcase-copy">
          <div className="editorial-kicker">Why it feels premium</div>
          <div className="editorial-title">Cieplo, rytm i poczucie postepu zamiast hałasu</div>
          <div className="editorial-copy">
            Luma ma dawac wrazenie dobrze zaprojektowanej aplikacji lifestyle, a nie technicznego narzedzia.
            Dlatego najwazniejsze sa: spokojna hierarchia, piekne karty, jasny nastepny krok i lekki system powrotu.
          </div>
        </div>

        <div className="showcase-badges">
          <div className="showcase-badge">
            <span>Level</span>
            <strong>{derived.level}</strong>
          </div>
          <div className="showcase-badge">
            <span>Streak</span>
            <strong>{state.streak} days</strong>
          </div>
          <div className="showcase-badge">
            <span>Journal</span>
            <strong>{state.journalEntries.length} logs</strong>
          </div>
          <div className="showcase-badge">
            <span>Light</span>
            <strong>{state.light}</strong>
          </div>
        </div>
      </div>

      <div className="cards-grid-2">
        <div className="editorial-card">
          <div className="editorial-kicker">Activity feed</div>
          <div className="soft-list">
            {state.rewardHistory.map((entry) => (
              <div key={entry.id} className="soft-list-item">
                <strong>{entry.title}</strong> // {entry.detail}
              </div>
            ))}
          </div>
        </div>

        <div className="editorial-card">
          <div className="editorial-kicker">Built for return</div>
          <div className="soft-list">
            <div className="soft-list-item">Jeden AI, nie kilka niespojnych helperow.</div>
            <div className="soft-list-item">Journal i quizy dzialaja jak wejscia, nie jak osobne produkty.</div>
            <div className="soft-list-item">Rewardy i gry wspieraja rytm, ale nie dominują psychologii i relacji.</div>
            <div className="soft-list-item">Premium ma wygladac jak naturalny upgrade, nie agresywny paywall.</div>
          </div>
        </div>
      </div>

      <SafetyNotice />
    </AppShell>
  );
}
