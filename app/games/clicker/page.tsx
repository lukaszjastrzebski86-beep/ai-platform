import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import ClickerGame from "@/components/ClickerGame";

export default function ClickerPage() {
  return (
    <AppShell
      title="Laduj energie"
      subtitle="Clicker jest najprostsza petla wzmacniania sprawczosci. Kilka klikniec, wyrazny feedback i szybki zastrzyk wspolnych rewardow."
      heroCode="CK"
      rightPanel={<SafetyNotice compact />}
    >
      <ClickerGame />
    </AppShell>
  );
}
