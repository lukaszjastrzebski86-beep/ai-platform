import Link from "next/link";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";

export default function GamesPage() {
  return (
    <AppShell
      title="Games"
      subtitle="Portal gier i mini-aktywności. Tu produkt zaczyna żyć jak świat online."
    >
      <div className="cards-grid-3">
        <Link href="/games/snake">
          <PortalCard
            title="Snake"
            text="Prawdziwa gra z planszą, sterowaniem i wynikiem."
          />
        </Link>
        <Link href="/games/clicker">
          <PortalCard
            title="Clicker"
            text="Prosta gra na klikanie, zbieraj światło i upgrade'uj."
          />
        </Link>
        <PortalCard
          title="Memory"
          text="Miejsce na kolejną grę: odkrywanie kart i rewardy."
        />
      </div>
    </AppShell>
  );
}