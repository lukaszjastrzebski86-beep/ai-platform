"use client";

import { useEffect, useMemo, useState } from "react";

type ModuleType =
  | "general"
  | "relationships"
  | "emotions"
  | "quiz"
  | "task";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
};

type QuizPayload = {
  title: string;
  intro: string;
  questions: QuizQuestion[];
  resultGuide: {
    mostlyA: string;
    mostlyB: string;
    mostlyC: string;
  };
};

type TaskPayload = {
  title: string;
  goal: string;
  duration: string;
  steps: string[];
  minimumVersion: string;
  reward: string;
};

type TextMessage = {
  id: string;
  kind: "text";
  role: "user" | "assistant";
  content: string;
};

type QuizMessage = {
  id: string;
  kind: "quiz";
  role: "assistant";
  quiz: QuizPayload;
};

type TaskMessage = {
  id: string;
  kind: "task";
  role: "assistant";
  task: TaskPayload;
};

type ChatMessage = TextMessage | QuizMessage | TaskMessage;

type SiteConfig = {
  themeName: string;
  heroTitle: string;
  heroSubtitle: string;
  notice: string;
  accentFrom: string;
  accentTo: string;
  badgeText: string;
};

type ProfileConfig = {
  displayName: string;
  title: string;
  aura: string;
  accent: string;
  avatar: string;
  badge: string;
  bio: string;
};

const defaultSiteConfig: SiteConfig = {
  themeName: "Heaven",
  heroTitle: "Jedno AI.\nWięcej światła,\nmniej chaosu.",
  heroSubtitle:
    "Relacje, emocje, quizy, zadania, tarot, horoskop, numerologia, gra i panel admina do zmian na żywo — wszystko w jednym, pięknym interfejsie.",
  notice:
    "Dziś: odbierz bonus dnia, sprawdź kartę, uruchom quiz lub edytuj stronę w panelu admina.",
  accentFrom: "#6be0ff",
  accentTo: "#a4f1ff",
  badgeText: "Heavenly AI Engine • LIVE",
};

const defaultProfileConfig: ProfileConfig = {
  displayName: "Luq",
  title: "Pilot Światła",
  aura: "Spokojna, skupiona, nastawiona na kierunek i rozwój",
  accent: "#63d9ff",
  avatar: "🪽",
  badge: "Pierwszy lot",
  bio: "Badam relacje, emocje i nowe ścieżki rozwoju z pomocą AI.",
};

const modules: {
  key: ModuleType;
  title: string;
  desc: string;
  emoji: string;
}[] = [
  {
    key: "relationships",
    title: "Relacje",
    desc: "Sygnały, komunikacja, granice i dynamika",
    emoji: "🤍",
  },
  {
    key: "emotions",
    title: "Emocje",
    desc: "Nazwanie stanu, regulacja, odzyskanie spokoju",
    emoji: "🫀",
  },
  {
    key: "quiz",
    title: "Quiz",
    desc: "Krótka diagnostyka i pytania prowadzące",
    emoji: "🧠",
  },
  {
    key: "task",
    title: "Zadanie",
    desc: "Mikro-akcje, plan minimum i następny krok",
    emoji: "⚡",
  },
];

const quickPrompts: Record<ModuleType, string[]> = {
  general: [
    "Mam chaos w głowie i chcę to uporządkować",
    "Pomóż mi podjąć decyzję",
    "Nie wiem, od czego zacząć",
  ],
  relationships: [
    "Pomóż mi zrozumieć tę relację",
    "Czy tu są czerwone flagi?",
    "Nie wiem czy ta osoba mnie manipuluje",
  ],
  emotions: [
    "Nie ogarniam swoich emocji",
    "Czuję napięcie i chaos",
    "Pomóż mi nazwać, co się ze mną dzieje",
  ],
  quiz: [
    "Daj mi krótki quiz o moim stanie",
    "Zrób mi quiz o relacji",
    "Sprawdź mnie krótkim testem",
  ],
  task: [
    "Daj mi zadanie na dziś",
    "Potrzebuję prostego planu minimum",
    "Jaki jest mój następny krok?",
  ],
};

const zodiacSigns = [
  "Baran",
  "Byk",
  "Bliźnięta",
  "Rak",
  "Lew",
  "Panna",
  "Waga",
  "Skorpion",
  "Strzelec",
  "Koziorożec",
  "Wodnik",
  "Ryby",
];

const horoscopeMap: Record<string, string> = {
  Baran:
    "Dziś energia pcha Cię do działania. Uważaj tylko, żeby nie pomylić impulsu z prawdziwym kierunkiem.",
  Byk:
    "To dobry dzień na porządkowanie spraw, które od dawna wiszą nad Tobą. Stabilność da Ci siłę.",
  "Bliźnięta":
    "Pojawi się więcej myśli niż zwykle. Kluczem będzie wybranie jednej rzeczy, która naprawdę ma znaczenie.",
  Rak:
    "Emocje mogą dziś mocniej dochodzić do głosu. To dobry moment, by dać sobie więcej czułości i jasności.",
  Lew:
    "Masz dziś potencjał przyciągania uwagi i energii. Najwięcej zyskasz, gdy połączysz odwagę z autentycznością.",
  Panna:
    "Dzień sprzyja analizie, ale nie przesadź z kontrolą. Czasem prosty ruch daje więcej niż idealny plan.",
  Waga:
    "Relacje i balans będą dziś ważne. Zobacz, gdzie za dużo dopasowujesz się kosztem siebie.",
  Skorpion:
    "Dziś łatwiej wyczuć ukryte napięcia. Użyj tej głębi do prawdy, a nie do nakręcania się.",
  Strzelec:
    "Masz dziś potrzebę ruchu i sensu. Dobrze zrobi Ci coś, co da kierunek, a nie tylko rozproszenie.",
  Koziorożec:
    "To dobry dzień na konkrety, ale nie zapomnij o własnej energii. Dyscyplina działa najlepiej, gdy nie jest przemocą.",
  Wodnik:
    "Pojawi się potrzeba świeżości i spojrzenia z innej strony. Dziś nietypowe myślenie może dać najlepszy efekt.",
  Ryby:
    "Intuicja jest dziś mocna. Jeśli coś Cię ciągnie albo odpycha, zatrzymaj się i sprawdź, co naprawdę czujesz.",
};

const tarotDeck = [
  {
    name: "Głupiec",
    meaning:
      "Nowy początek, odwaga wejścia w nieznane, świeżość i ruch.",
  },
  {
    name: "Mag",
    meaning:
      "Sprawczość, kierowanie energią, używanie swoich zasobów świadomie.",
  },
  {
    name: "Kapłanka",
    meaning:
      "Intuicja, cisza, wewnętrzna prawda i to, co jeszcze nie zostało wypowiedziane.",
  },
  {
    name: "Cesarzowa",
    meaning:
      "Obfitość, opieka, wzrost, przyjmowanie życia i jego rytmu.",
  },
  {
    name: "Cesarz",
    meaning:
      "Struktura, granice, decyzja i odzyskanie kontroli tam, gdzie jej brakuje.",
  },
  {
    name: "Kochankowie",
    meaning:
      "Relacja, wybór serca, zgodność albo napięcie między wartościami.",
  },
  {
    name: "Rydwan",
    meaning:
      "Ruch do przodu, siła woli, wybór kierunku i przekuwanie chaosu w działanie.",
  },
  {
    name: "Sprawiedliwość",
    meaning:
      "Prawda, równowaga, konsekwencja i zobaczenie rzeczy takimi, jakie są.",
  },
  {
    name: "Pustelnik",
    meaning:
      "Potrzeba zatrzymania, refleksji i własnego światła zamiast hałasu.",
  },
  {
    name: "Koło Fortuny",
    meaning:
      "Zwrot, zmiana cyklu, nowy etap i nieoczekiwane przesunięcia.",
  },
  {
    name: "Siła",
    meaning:
      "Spokojna moc, cierpliwość, regulacja energii i wewnętrzna odwaga.",
  },
  {
    name: "Słońce",
    meaning:
      "Jasność, ulga, prawda, wzrost i dobry moment na działanie.",
  },
];

const wheelRewards = [
  { label: "+10 diamentów", diamonds: 10, light: 0, energy: 0 },
  { label: "+20 światła", diamonds: 0, light: 20, energy: 0 },
  { label: "+8 energii", diamonds: 0, light: 0, energy: 8 },
  { label: "+5 diamentów i +5 światła", diamonds: 5, light: 5, energy: 0 },
  { label: "+12 światła i +4 energii", diamonds: 0, light: 12, energy: 4 },
  { label: "Super bonus +15 diamentów", diamonds: 15, light: 0, energy: 0 },
];

function id() {
  return Math.random().toString(36).slice(2, 10);
}

function calcLifePath(dateStr: string) {
  if (!dateStr) return null;
  const digits = dateStr.replaceAll("-", "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum)
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }

  return sum;
}

function lifePathMeaning(value: number | null) {
  if (value === null) return "";
  const map: Record<number, string> = {
    1: "Liczba 1: niezależność, inicjatywa, potrzeba działania i własnej ścieżki.",
    2: "Liczba 2: relacje, współpraca, czułość, wyczucie energii innych.",
    3: "Liczba 3: ekspresja, kreatywność, komunikacja i lekkość.",
    4: "Liczba 4: struktura, dyscyplina, budowanie stabilności.",
    5: "Liczba 5: zmiana, ruch, wolność, doświadczenie.",
    6: "Liczba 6: troska, odpowiedzialność, bliskość i harmonia.",
    7: "Liczba 7: refleksja, głębia, intuicja i analiza.",
    8: "Liczba 8: moc, wpływ, sprawczość, materia i wynik.",
    9: "Liczba 9: empatia, domykanie cykli, sens i większa perspektywa.",
    11: "Liczba 11: silna intuicja, inspiracja, duchowe napięcie i wrażliwość.",
    22: "Liczba 22: wielka budowa, wizja połączona z wykonaniem.",
    33: "Liczba 33: energia przewodnika, wsparcia i świadomej obecności.",
  };
  return map[value] || "To liczba o niestandardowej energii.";
}

export default function HomePage() {
  const [activeModule, setActiveModule] = useState<ModuleType>("general");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [diamonds, setDiamonds] = useState(128);
  const [light, setLight] = useState(264);
  const [energy, setEnergy] = useState(84);
  const [streak, setStreak] = useState(7);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [dailyChestOpened, setDailyChestOpened] = useState(false);

  const [zodiac, setZodiac] = useState("Waga");

  const [tarotCard, setTarotCard] = useState<(typeof tarotDeck)[number] | null>(
    null
  );
  const [tarotSpread, setTarotSpread] = useState<
    (typeof tarotDeck)[number][]
  >([]);

  const [birthDate, setBirthDate] = useState("");
  const lifePath = calcLifePath(birthDate);

  const [wheelResult, setWheelResult] = useState("");
  const [wheelSpinning, setWheelSpinning] = useState(false);

  const [gameRunning, setGameRunning] = useState(false);
  const [gameTime, setGameTime] = useState(20);
  const [gameScore, setGameScore] = useState(0);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [adminPrompt, setAdminPrompt] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [pendingSiteConfig, setPendingSiteConfig] =
    useState<Partial<SiteConfig> | null>(null);
  const [adminExplanation, setAdminExplanation] = useState("");
  const [previewAdminChanges, setPreviewAdminChanges] = useState(false);

  const [profileConfig, setProfileConfig] =
    useState<ProfileConfig>(defaultProfileConfig);
  const [profilePrompt, setProfilePrompt] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [pendingProfileConfig, setPendingProfileConfig] =
    useState<Partial<ProfileConfig> | null>(null);
  const [profileExplanation, setProfileExplanation] = useState("");
  const [previewProfileChanges, setPreviewProfileChanges] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: id(),
      kind: "text",
      role: "assistant",
      content:
        "Witaj. Jestem Twoim AI. Pomagam odzyskać jasność, spokój i kierunek w relacjach, emocjach i decyzjach. Wybierz moduł albo napisz, z czym mam Ci pomóc.",
    },
  ]);

  useEffect(() => {
    try {
      const savedSite = localStorage.getItem("heaven-site-config");
      const savedProfile = localStorage.getItem("heaven-profile-config");

      if (savedSite) {
        setSiteConfig(JSON.parse(savedSite));
      }

      if (savedProfile) {
        setProfileConfig(JSON.parse(savedProfile));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("heaven-site-config", JSON.stringify(siteConfig));
    } catch {}
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "heaven-profile-config",
        JSON.stringify(profileConfig)
      );
    } catch {}
  }, [profileConfig]);

  useEffect(() => {
    if (!gameRunning) return;

    if (gameTime <= 0) {
      setGameRunning(false);
      setDiamonds((d) => d + gameScore);
      setLight((l) => l + Math.floor(gameScore / 2));
      return;
    }

    const timer = setTimeout(() => {
      setGameTime((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameRunning, gameTime, gameScore]);

  const currentQuickPrompts = useMemo(
    () => quickPrompts[activeModule] || quickPrompts.general,
    [activeModule]
  );

  const effectiveSiteConfig =
    previewAdminChanges && pendingSiteConfig
      ? { ...siteConfig, ...pendingSiteConfig }
      : siteConfig;

  const effectiveProfileConfig =
    previewProfileChanges && pendingProfileConfig
      ? { ...profileConfig, ...pendingProfileConfig }
      : profileConfig;

  const themeVars = {
    ["--accentFrom" as any]: effectiveSiteConfig.accentFrom,
    ["--accentTo" as any]: effectiveSiteConfig.accentTo,
    ["--accentShadow" as any]: effectiveSiteConfig.accentFrom,
  };

  const achievements = [
    {
      icon: "🔥",
      label: "Streak",
      text: streak >= 7 ? "7+ dni ciągłości" : "Budujesz ciągłość",
      active: streak >= 7,
    },
    {
      icon: "💎",
      label: "Zbieracz światła",
      text: diamonds >= 150 ? "Masz 150+ diamentów" : "Zbieraj diamenty",
      active: diamonds >= 150,
    },
    {
      icon: "🎁",
      label: "Daily reward",
      text: dailyClaimed ? "Odebrany dziś" : "Czeka na Ciebie",
      active: dailyClaimed,
    },
  ];

  function claimDailyReward() {
    if (dailyClaimed) return;
    setDiamonds((d) => d + 25);
    setLight((l) => l + 18);
    setEnergy((e) => Math.min(100, e + 10));
    setStreak((s) => s + 1);
    setDailyClaimed(true);
  }

  function openDailyChest() {
    if (dailyChestOpened) return;
    setDiamonds((d) => d + 12);
    setLight((l) => l + 14);
    setEnergy((e) => Math.min(100, e + 6));
    setDailyChestOpened(true);
  }

  function drawTarotCard() {
    const random = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    setTarotCard(random);
    setLight((l) => l + 3);
  }

  function drawTarotSpread() {
    const shuffled = [...tarotDeck]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setTarotSpread(shuffled);
    setLight((l) => l + 5);
  }

  function spinWheel() {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelResult("");

    setTimeout(() => {
      const reward =
        wheelRewards[Math.floor(Math.random() * wheelRewards.length)];
      setDiamonds((d) => d + reward.diamonds);
      setLight((l) => l + reward.light);
      setEnergy((e) => Math.min(100, e + reward.energy));
      setWheelResult(reward.label);
      setWheelSpinning(false);
    }, 1400);
  }

  function startLightGame() {
    setGameRunning(true);
    setGameTime(20);
    setGameScore(0);
  }

  function collectLight() {
    if (!gameRunning) return;
    setGameScore((s) => s + 1);
  }

  async function sendMessage(customText?: string) {
    const content = (customText ?? input).trim();
    if (!content || loading) return;

    const userMessage: TextMessage = {
      id: id(),
      kind: "text",
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "chat",
          message: content,
          module: activeModule,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: id(),
            kind: "text",
            role: "assistant",
            content: `Błąd: ${data?.error || "Nieznany błąd"}${
              data?.details ? ` — ${data.details}` : ""
            }`,
          },
        ]);
        return;
      }

      if (data.type === "quiz" && data.quiz) {
        setMessages((prev) => [
          ...prev,
          {
            id: id(),
            kind: "quiz",
            role: "assistant",
            quiz: data.quiz,
          },
        ]);
        setLight((l) => l + 8);
        return;
      }

      if (data.type === "task" && data.task) {
        setMessages((prev) => [
          ...prev,
          {
            id: id(),
            kind: "task",
            role: "assistant",
            task: data.task,
          },
        ]);
        setLight((l) => l + 6);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: id(),
          kind: "text",
          role: "assistant",
          content: data.reply || "Brak odpowiedzi",
        },
      ]);
      setLight((l) => l + 4);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: id(),
          kind: "text",
          role: "assistant",
          content: `Błąd połączenia: ${error?.message || "Unknown error"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function runAdminPreview() {
    if (!adminPrompt.trim()) return;
    setAdminLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "admin",
          prompt: adminPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        alert(data?.details || data?.error || "Błąd panelu admina.");
        return;
      }

      setPendingSiteConfig(data.preview || null);
      setAdminExplanation(data.explanation || "");
      setPreviewAdminChanges(true);
    } catch (error: any) {
      alert(error?.message || "Błąd połączenia.");
    } finally {
      setAdminLoading(false);
    }
  }

  function acceptAdminPreview() {
    if (!pendingSiteConfig) return;
    setSiteConfig((prev) => ({
      ...prev,
      ...pendingSiteConfig,
    }));
    setPendingSiteConfig(null);
    setAdminExplanation("");
    setPreviewAdminChanges(false);
  }

  function discardAdminPreview() {
    setPendingSiteConfig(null);
    setAdminExplanation("");
    setPreviewAdminChanges(false);
  }

  async function runProfilePreview() {
    if (!profilePrompt.trim()) return;
    setProfileLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "profile",
          prompt: profilePrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        alert(data?.details || data?.error || "Błąd edytora profilu.");
        return;
      }

      setPendingProfileConfig(data.preview || null);
      setProfileExplanation(data.explanation || "");
      setPreviewProfileChanges(true);
    } catch (error: any) {
      alert(error?.message || "Błąd połączenia.");
    } finally {
      setProfileLoading(false);
    }
  }

  function acceptProfilePreview() {
    if (!pendingProfileConfig) return;
    setProfileConfig((prev) => ({
      ...prev,
      ...pendingProfileConfig,
    }));
    setPendingProfileConfig(null);
    setProfileExplanation("");
    setPreviewProfileChanges(false);
  }

  function discardProfilePreview() {
    setPendingProfileConfig(null);
    setProfileExplanation("");
    setPreviewProfileChanges(false);
  }

  function onEnter(
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="page" style={themeVars as React.CSSProperties}>
      <div className="background-layer" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="sparkles" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="glow glow-3" />

      <div className="container">
        <div className="top-notice glass">
          <div className="top-notice-left">
            <span className="live-dot" />
            <span>{effectiveSiteConfig.badgeText}</span>
          </div>
          <div className="top-notice-right">{effectiveSiteConfig.notice}</div>
        </div>

        <section className="hero glass">
          <div className="hero-left">
            <div className="hero-chip">☁️ {effectiveSiteConfig.themeName}</div>

            <h1>
              {effectiveSiteConfig.heroTitle.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h1>

            <p className="hero-text">{effectiveSiteConfig.heroSubtitle}</p>

            <div className="hero-actions">
              <button
                className="primary-btn"
                onClick={() => {
                  const el = document.getElementById("chat-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Wejdź do AI
              </button>

              <button
                className="secondary-btn"
                onClick={() => {
                  const el = document.getElementById("admin-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Panel admina
              </button>
            </div>

            <div className="hero-mini-grid">
              <MiniStat label="Diamenty" value={String(diamonds)} icon="💎" />
              <MiniStat label="Światło" value={String(light)} icon="☀️" />
              <MiniStat label="Energia" value={`${energy}%`} icon="⚡" />
              <MiniStat label="Streak" value={String(streak)} icon="🔥" />
            </div>
          </div>

          <div className="hero-right">
            <div className="orbital">
              <div className="orbital-ring ring-1" />
              <div className="orbital-ring ring-2" />
              <div className="orbital-ring ring-3" />
              <div className="orbital-core">
                <div className="orbital-core-inner">✨</div>
              </div>

              <div className="orbit-bubble orbit-1">
                <div className="bubble-label">Karta dnia</div>
                <div className="bubble-value">
                  {tarotCard ? tarotCard.name : "—"}
                </div>
              </div>

              <div className="orbit-bubble orbit-2">
                <div className="bubble-label">Znak</div>
                <div className="bubble-value">{zodiac}</div>
              </div>

              <div className="orbit-bubble orbit-3">
                <div className="bubble-label">Profil</div>
                <div className="bubble-value">
                  {effectiveProfileConfig.displayName}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="reward-grid">
          <RewardCard icon="💎" label="Diamenty" value={String(diamonds)} />
          <RewardCard icon="☀️" label="Światło" value={String(light)} />
          <RewardCard icon="⚡" label="Energia" value={`${energy}%`} />
          <RewardCard icon="🔥" label="Streak" value={`${streak}`} />
        </section>

        <section className="daily-grid">
          <div className="daily-card glass">
            <div className="card-head">
              <div className="section-title small">Daily Reward</div>
              <div className="tag">+25 💎</div>
            </div>
            <div className="section-text">
              Odbierz bonus dnia i zwiększ swój streak.
            </div>
            <button
              className="action-btn"
              onClick={claimDailyReward}
              disabled={dailyClaimed}
              style={{
                marginTop: 14,
                opacity: dailyClaimed ? 0.55 : 1,
                cursor: dailyClaimed ? "not-allowed" : "pointer",
              }}
            >
              {dailyClaimed ? "Odebrane ✅" : "Odbierz"}
            </button>
          </div>

          <div className="daily-card glass">
            <div className="card-head">
              <div className="section-title small">Skrzynia dnia</div>
              <div className="tag">🎁</div>
            </div>
            <div className="section-text">
              Otwórz skrzynię i zgarnij diamenty oraz światło.
            </div>
            <button
              className="action-btn"
              onClick={openDailyChest}
              disabled={dailyChestOpened}
              style={{
                marginTop: 14,
                opacity: dailyChestOpened ? 0.55 : 1,
                cursor: dailyChestOpened ? "not-allowed" : "pointer",
              }}
            >
              {dailyChestOpened ? "Otwarta ✅" : "Otwórz"}
            </button>
          </div>

          <div className="daily-card glass">
            <div className="card-head">
              <div className="section-title small">Koło fortuny</div>
              <div className="tag">🎡</div>
            </div>
            <div className="section-text">
              Jedno kliknięcie, szybka nagroda, trochę losu.
            </div>
            <button
              className="action-btn"
              onClick={spinWheel}
              disabled={wheelSpinning}
              style={{ marginTop: 14 }}
            >
              {wheelSpinning ? "Kręci się..." : "Zakręć"}
            </button>
            {wheelResult && <div className="result-box">{wheelResult}</div>}
          </div>

          <div className="daily-card glass">
            <div className="card-head">
              <div className="section-title small">Twoje odznaki</div>
              <div className="tag">🏅</div>
            </div>
            <div className="achievement-list">
              {achievements.map((item) => (
                <div
                  key={item.label}
                  className={`achievement ${item.active ? "active" : ""}`}
                >
                  <span className="achievement-icon">{item.icon}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <div>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="modules-grid">
          {modules.map((mod) => {
            const active = activeModule === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => setActiveModule(mod.key)}
                className={`module-card glass ${active ? "active" : ""}`}
              >
                <div className="module-icon">{mod.emoji}</div>
                <div className="module-title">{mod.title}</div>
                <div className="module-desc">{mod.desc}</div>
                {active && <div className="module-active-badge">Aktywny</div>}
              </button>
            );
          })}
        </section>

        <section id="chat-section" className="chat-area">
          <div className="chat-panel glass">
            <div className="chat-top">
              <div>
                <div className="section-title">Centrum rozmowy</div>
                <div className="section-subtitle">
                  Jedno AI. Trzy ukryte silniki. Jedna klarowna odpowiedź.
                </div>
              </div>

              <div className={`status-pill ${loading ? "thinking" : ""}`}>
                {loading ? "AI pracuje..." : "Gotowe"}
              </div>
            </div>

            <div className="module-pills">
              <button
                onClick={() => setActiveModule("general")}
                className={`pill ${activeModule === "general" ? "active" : ""}`}
              >
                ✨ Ogólne
              </button>

              {modules.map((mod) => (
                <button
                  key={mod.key}
                  onClick={() => setActiveModule(mod.key)}
                  className={`pill ${activeModule === mod.key ? "active" : ""}`}
                >
                  {mod.emoji} {mod.title}
                </button>
              ))}
            </div>

            <div className="quick-pills">
              {currentQuickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="quick-pill"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="messages-box">
              {messages.map((msg) => {
                if (msg.kind === "text") {
                  return (
                    <div key={msg.id} className={`message-row ${msg.role}`}>
                      <div className={`message-bubble ${msg.role}`}>
                        <div className="message-label">
                          {msg.role === "user" ? "Ty" : "AI"}
                        </div>
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                if (msg.kind === "quiz") {
                  return (
                    <div key={msg.id} className="message-row assistant">
                      <QuizCard
                        quiz={msg.quiz}
                        onReward={(d, l) => {
                          setDiamonds((x) => x + d);
                          setLight((x) => x + l);
                        }}
                      />
                    </div>
                  );
                }

                if (msg.kind === "task") {
                  return (
                    <div key={msg.id} className="message-row assistant">
                      <TaskCard
                        task={msg.task}
                        onDone={() => {
                          setDiamonds((x) => x + 8);
                          setLight((x) => x + 10);
                          setEnergy((x) => Math.min(100, x + 5));
                        }}
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>

            <div className="input-wrap">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onEnter}
                placeholder="Napisz, z czym mam Ci pomóc..."
                rows={4}
                className="chat-input"
              />

              <div className="input-bottom">
                <div className="active-module">
                  Aktywny moduł: <strong>{activeModule}</strong>
                </div>

                <button
                  onClick={() => sendMessage()}
                  disabled={loading}
                  className="send-btn"
                >
                  {loading ? "Myślę..." : "Wyślij"}
                </button>
              </div>
            </div>
          </div>

          <div className="side-panel">
            <div className="sticky-stack">
              <div className="side-card glass">
                <div className="section-title small">Horoskop dnia</div>
                <div className="field-row">
                  <select
                    value={zodiac}
                    onChange={(e) => setZodiac(e.target.value)}
                    className="select"
                  >
                    {zodiacSigns.map((sign) => (
                      <option key={sign} value={sign}>
                        {sign}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="result-box">{horoscopeMap[zodiac]}</div>
              </div>

              <div className="side-card glass">
                <div className="section-title small">Karta dnia</div>
                <div className="button-row">
                  <button className="action-btn" onClick={drawTarotCard}>
                    Losuj
                  </button>
                  <button className="action-btn secondary" onClick={drawTarotSpread}>
                    3 karty
                  </button>
                </div>

                {tarotCard && (
                  <div className="result-box">
                    <strong>{tarotCard.name}</strong>
                    <div style={{ marginTop: 8 }}>{tarotCard.meaning}</div>
                  </div>
                )}

                {tarotSpread.length > 0 && (
                  <div className="spread-grid">
                    {tarotSpread.map((card, index) => (
                      <div key={`${card.name}-${index}`} className="mini-panel">
                        <div className="task-label">
                          {index === 0
                            ? "Przeszłość"
                            : index === 1
                            ? "Teraźniejszość"
                            : "Przyszłość"}
                        </div>
                        <strong>{card.name}</strong>
                        <div style={{ marginTop: 6 }}>{card.meaning}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="side-card glass">
                <div className="section-title small">Numerologia</div>
                <div className="field-row">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="date-input"
                  />
                </div>

                {lifePath !== null && (
                  <div className="result-box">
                    <strong>Twoja liczba drogi życia: {lifePath}</strong>
                    <div style={{ marginTop: 8 }}>
                      {lifePathMeaning(lifePath)}
                    </div>
                  </div>
                )}
              </div>

              <div className="side-card glass">
                <div className="section-title small">
                  Mini gra: zbieranie światła
                </div>
                <div className="section-text">
                  Klikaj światło przez 20 sekund. Zdobyte punkty zamienią się na
                  diamenty.
                </div>

                <div className="button-row">
                  <button className="action-btn" onClick={startLightGame}>
                    Start
                  </button>
                </div>

                <div className="game-panel">
                  <div className="game-stats">
                    <div className="mini-panel">
                      <div className="task-label">Czas</div>
                      <strong>{gameTime}s</strong>
                    </div>
                    <div className="mini-panel">
                      <div className="task-label">Punkty</div>
                      <strong>{gameScore}</strong>
                    </div>
                  </div>

                  <button
                    className={`light-orb-btn ${gameRunning ? "live" : ""}`}
                    onClick={collectLight}
                  >
                    ✨
                  </button>

                  <div className="section-text" style={{ marginTop: 10 }}>
                    {gameRunning
                      ? "Klikaj szybko, zbieraj światło."
                      : "Kliknij Start, żeby zacząć."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-admin-grid">
          <div className="profile-card glass">
            <div className="section-title">Twój profil</div>
            <div className="section-subtitle">
              Każdy użytkownik może zmieniać wygląd i styl swojego profilu komendą.
            </div>

            <div
              className="profile-preview"
              style={{
                borderColor: effectiveProfileConfig.accent,
                boxShadow: `0 20px 50px ${effectiveProfileConfig.accent}30`,
              }}
            >
              <div
                className="profile-avatar"
                style={{
                  boxShadow: `0 0 28px ${effectiveProfileConfig.accent}`,
                }}
              >
                {effectiveProfileConfig.avatar}
              </div>

              <div className="profile-info">
                <div className="profile-name">
                  {effectiveProfileConfig.displayName}
                </div>
                <div className="profile-title">
                  {effectiveProfileConfig.title}
                </div>
                <div className="profile-aura">{effectiveProfileConfig.aura}</div>

                <div className="profile-badges">
                  <span
                    className="profile-badge"
                    style={{
                      background: `${effectiveProfileConfig.accent}22`,
                      borderColor: `${effectiveProfileConfig.accent}66`,
                    }}
                  >
                    {effectiveProfileConfig.badge}
                  </span>
                </div>

                <p className="profile-bio">{effectiveProfileConfig.bio}</p>
              </div>
            </div>

            <div className="editor-box">
              <div className="section-title small">Edytor profilu komendą</div>
              <div className="section-text">
                Np. „Ustaw mój profil na złoto‑niebieski, nadaj mi tytuł
                Kapitan Światła, dodaj orła jako avatar i bardziej bojowy
                klimat.”
              </div>

              <textarea
                value={profilePrompt}
                onChange={(e) => setProfilePrompt(e.target.value)}
                className="editor-input"
                rows={4}
                placeholder="Napisz jak ma wyglądać Twój profil..."
              />

              <div className="button-row">
                <button
                  className="action-btn"
                  onClick={runProfilePreview}
                  disabled={profileLoading}
                >
                  {profileLoading ? "AI projektuje..." : "Stwórz podgląd"}
                </button>

                {pendingProfileConfig && (
                  <>
                    <button
                      className="action-btn secondary"
                      onClick={acceptProfilePreview}
                    >
                      Akceptuję
                    </button>
                    <button
                      className="action-btn secondary"
                      onClick={discardProfilePreview}
                    >
                      Odrzuć
                    </button>
                  </>
                )}
              </div>

              {profileExplanation && (
                <div className="result-box">{profileExplanation}</div>
              )}
            </div>
          </div>

          <div id="admin-section" className="admin-card glass">
            <div className="section-title">Panel admina • AI Studio</div>
            <div className="section-subtitle">
              Wpisz polecenie zmiany strony. AI przygotuje podgląd, a Ty
              akceptujesz albo odrzucasz.
            </div>

            <div className="editor-box">
              <div className="section-text">
                Np. „Zmień tytuł na ‘Świątynia Światła’, dodaj bardziej złoty
                klimat, inny komunikat górny i badge ‘Aurora Release’.”
              </div>

              <textarea
                value={adminPrompt}
                onChange={(e) => setAdminPrompt(e.target.value)}
                className="editor-input"
                rows={5}
                placeholder="Napisz polecenie zmiany strony..."
              />

              <div className="button-row">
                <button
                  className="action-btn"
                  onClick={runAdminPreview}
                  disabled={adminLoading}
                >
                  {adminLoading ? "AI tworzy podgląd..." : "Stwórz podgląd"}
                </button>

                {pendingSiteConfig && (
                  <>
                    <button
                      className="action-btn secondary"
                      onClick={acceptAdminPreview}
                    >
                      Akceptuję zmiany
                    </button>
                    <button
                      className="action-btn secondary"
                      onClick={discardAdminPreview}
                    >
                      Odrzuć
                    </button>
                  </>
                )}
              </div>

              {adminExplanation && (
                <div className="result-box">{adminExplanation}</div>
              )}
            </div>

            <div className="admin-help-grid">
              <div className="mini-panel">
                <div className="task-label">Możesz zmienić</div>
                <div>tytuł, podtytuł, kolory akcentu, badge i górny komunikat</div>
              </div>
              <div className="mini-panel">
                <div className="task-label">Działa jako</div>
                <div>live preview w przeglądarce z akceptacją lub odrzuceniem</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: #123a63;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, Segoe UI, sans-serif;
          background:
            radial-gradient(circle at 50% -20%, rgba(255,255,255,0.98), transparent 24%),
            linear-gradient(
              180deg,
              #ecfbff 0%,
              #d6f3ff 20%,
              #a8e3ff 52%,
              #8ad2ff 78%,
              #75c9ff 100%
            );
        }

        .background-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 12% 18%, rgba(255,255,255,0.85), transparent 16%),
            radial-gradient(circle at 88% 14%, rgba(255,255,255,0.78), transparent 16%),
            radial-gradient(circle at 30% 76%, rgba(255,255,255,0.32), transparent 20%),
            radial-gradient(circle at 78% 72%, rgba(255,255,255,0.26), transparent 22%);
        }

        .cloud {
          position: fixed;
          z-index: 0;
          filter: blur(10px);
          opacity: 0.55;
          pointer-events: none;
          background:
            radial-gradient(circle at 30% 50%, rgba(255,255,255,0.95), transparent 22%),
            radial-gradient(circle at 48% 38%, rgba(255,255,255,0.95), transparent 22%),
            radial-gradient(circle at 62% 52%, rgba(255,255,255,0.95), transparent 24%),
            radial-gradient(circle at 50% 64%, rgba(255,255,255,0.95), transparent 24%);
          animation: drift 32s linear infinite;
        }

        .cloud-1 {
          width: 240px;
          height: 130px;
          top: 80px;
          left: -80px;
        }

        .cloud-2 {
          width: 300px;
          height: 150px;
          top: 160px;
          right: -110px;
          animation-duration: 42s;
        }

        .cloud-3 {
          width: 220px;
          height: 110px;
          top: 520px;
          left: 8%;
          animation-duration: 38s;
        }

        .sparkles {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 12% 20%, rgba(255,255,255,0.95) 0 1.5px, transparent 2px),
            radial-gradient(circle at 34% 12%, rgba(255,255,255,0.95) 0 1px, transparent 2px),
            radial-gradient(circle at 57% 22%, rgba(255,255,255,0.95) 0 1.5px, transparent 2px),
            radial-gradient(circle at 84% 26%, rgba(255,255,255,0.95) 0 1px, transparent 2px),
            radial-gradient(circle at 18% 70%, rgba(255,255,255,0.95) 0 1px, transparent 2px),
            radial-gradient(circle at 66% 72%, rgba(255,255,255,0.95) 0 1px, transparent 2px),
            radial-gradient(circle at 87% 62%, rgba(255,255,255,0.95) 0 1px, transparent 2px);
          opacity: 0.88;
        }

        .glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .glow-1 {
          width: 360px;
          height: 360px;
          top: -100px;
          left: -90px;
          background: rgba(255,255,255,0.52);
        }

        .glow-2 {
          width: 360px;
          height: 360px;
          right: -120px;
          top: 140px;
          background: color-mix(in srgb, var(--accentFrom) 26%, transparent);
        }

        .glow-3 {
          width: 440px;
          height: 440px;
          bottom: -160px;
          left: 34%;
          background: color-mix(in srgb, var(--accentTo) 25%, transparent);
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1360px;
          margin: 0 auto;
          padding: 22px 18px 56px;
        }

        .glass {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.7),
            rgba(255,255,255,0.38)
          );
          border: 1px solid rgba(255,255,255,0.82);
          box-shadow:
            0 22px 60px color-mix(in srgb, var(--accentFrom) 16%, transparent),
            inset 0 1px 0 rgba(255,255,255,0.98);
          backdrop-filter: blur(16px);
        }

        .top-notice {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          border-radius: 18px;
          padding: 12px 16px;
          margin-bottom: 18px;
        }

        .top-notice-left {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          color: #1e6c9a;
        }

        .top-notice-right {
          color: #40739d;
          font-size: 14px;
          line-height: 1.5;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2fe17d;
          box-shadow: 0 0 0 6px rgba(47, 225, 125, 0.18);
        }

        .hero {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 28px;
          padding: 34px 30px;
          border-radius: 34px;
        }

        .hero-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.74);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 12px 34px color-mix(in srgb, var(--accentFrom) 16%, transparent);
          font-weight: 900;
          color: #216897;
          font-size: 14px;
          margin-bottom: 18px;
        }

        .hero-left h1 {
          margin: 0;
          font-size: clamp(44px, 7vw, 86px);
          line-height: 0.94;
          letter-spacing: -0.05em;
          font-weight: 900;
          color: #155486;
          text-shadow:
            0 0 16px rgba(255,255,255,0.82),
            0 0 34px color-mix(in srgb, var(--accentTo) 38%, transparent);
        }

        .hero-text {
          margin-top: 18px;
          max-width: 680px;
          font-size: 18px;
          line-height: 1.7;
          color: #40739d;
        }

        .hero-actions,
        .button-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 22px;
        }

        .primary-btn,
        .secondary-btn,
        .action-btn,
        .send-btn,
        .pill,
        .quick-pill,
        .module-card,
        .quiz-submit,
        .quiz-option,
        .light-orb-btn {
          transition: transform 0.18s ease, box-shadow 0.18s ease,
            border-color 0.18s ease, background 0.18s ease;
        }

        .primary-btn:hover,
        .secondary-btn:hover,
        .action-btn:hover,
        .send-btn:hover,
        .pill:hover,
        .quick-pill:hover,
        .module-card:hover,
        .quiz-submit:hover,
        .quiz-option:hover,
        .light-orb-btn:hover {
          transform: translateY(-2px);
        }

        .primary-btn,
        .action-btn,
        .send-btn,
        .quiz-submit {
          border: none;
          border-radius: 999px;
          padding: 13px 20px;
          font-weight: 900;
          cursor: pointer;
          color: #07355d;
          background: linear-gradient(
            135deg,
            var(--accentFrom),
            var(--accentTo)
          );
          box-shadow: 0 18px 38px color-mix(in srgb, var(--accentFrom) 26%, transparent);
        }

        .secondary-btn,
        .action-btn.secondary {
          border-radius: 999px;
          padding: 13px 20px;
          font-weight: 900;
          cursor: pointer;
          border: 1px solid color-mix(in srgb, var(--accentFrom) 38%, white);
          background: rgba(255,255,255,0.86);
          color: #296c9b;
          box-shadow: 0 14px 30px color-mix(in srgb, var(--accentFrom) 14%, transparent);
        }

        .hero-mini-grid,
        .reward-grid,
        .daily-grid,
        .modules-grid {
          display: grid;
          gap: 16px;
        }

        .hero-mini-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 24px;
        }

        .reward-grid {
          margin-top: 24px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .daily-grid {
          margin-top: 24px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .modules-grid {
          margin-top: 24px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .orbital {
          position: relative;
          width: 360px;
          height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orbital-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.75);
          box-shadow: 0 0 42px color-mix(in srgb, var(--accentFrom) 28%, transparent);
        }

        .ring-1 {
          width: 320px;
          height: 320px;
          animation: spin 22s linear infinite;
        }

        .ring-2 {
          width: 246px;
          height: 246px;
          border-style: dashed;
          animation: spin 18s linear infinite reverse;
        }

        .ring-3 {
          width: 166px;
          height: 166px;
          animation: spin 26s linear infinite;
        }

        .orbital-core {
          width: 126px;
          height: 126px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 36% 35%, #ffffff 0%, #f2fcff 34%, var(--accentTo) 62%, var(--accentFrom) 100%);
          box-shadow:
            0 0 38px rgba(255,255,255,0.95),
            0 0 96px color-mix(in srgb, var(--accentFrom) 42%, transparent),
            0 0 120px color-mix(in srgb, var(--accentTo) 30%, transparent);
        }

        .orbital-core-inner {
          font-size: 36px;
        }

        .orbit-bubble {
          position: absolute;
          min-width: 110px;
          padding: 12px 14px;
          border-radius: 18px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.88),
            rgba(235,249,255,0.56)
          );
          border: 1px solid rgba(255,255,255,0.82);
          box-shadow: 0 14px 34px color-mix(in srgb, var(--accentFrom) 14%, transparent);
          animation: float 4s ease-in-out infinite;
        }

        .orbit-1 {
          top: 18px;
          left: -6px;
        }

        .orbit-2 {
          top: 74px;
          right: -10px;
          animation-delay: 0.6s;
        }

        .orbit-3 {
          bottom: 28px;
          left: 12px;
          animation-delay: 1.2s;
        }

        .bubble-label {
          font-size: 12px;
          color: #5a88af;
          font-weight: 700;
        }

        .bubble-value {
          margin-top: 6px;
          font-size: 18px;
          font-weight: 900;
          color: #20669d;
        }

        .mini-stat {
          border-radius: 20px;
          padding: 16px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.88),
            rgba(232,247,255,0.62)
          );
          border: 1px solid rgba(255,255,255,0.86);
          box-shadow: 0 14px 28px color-mix(in srgb, var(--accentFrom) 14%, transparent);
        }

        .mini-stat-top {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5c8bb2;
          font-weight: 800;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .mini-stat-value {
          font-size: 26px;
          font-weight: 900;
          color: #195e90;
        }

        .reward-card {
          border-radius: 22px;
          padding: 16px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.88),
            rgba(230,247,255,0.7)
          );
          border: 1px solid rgba(255,255,255,0.86);
          box-shadow: 0 14px 30px color-mix(in srgb, var(--accentFrom) 14%, transparent);
        }

        .reward-top {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5d8cb2;
          font-weight: 800;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .reward-value {
          font-size: 30px;
          font-weight: 900;
          color: #175c8d;
        }

        .daily-card {
          border-radius: 28px;
          padding: 18px;
        }

        .card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(255,255,255,0.92);
          font-size: 12px;
          font-weight: 900;
          color: #286c9a;
        }

        .achievement-list {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        .achievement {
          display: flex;
          gap: 10px;
          padding: 12px;
          border-radius: 16px;
          background: rgba(255,255,255,0.66);
          border: 1px solid rgba(255,255,255,0.78);
          color: #507da2;
        }

        .achievement.active {
          border-color: color-mix(in srgb, var(--accentFrom) 46%, white);
          box-shadow: 0 10px 24px color-mix(in srgb, var(--accentFrom) 14%, transparent);
        }

        .achievement-icon {
          font-size: 20px;
          line-height: 1;
          margin-top: 2px;
        }

        .section-title {
          font-size: 34px;
          font-weight: 900;
          color: #195c8f;
          line-height: 1.05;
        }

        .section-title.small {
          font-size: 22px;
        }

        .section-subtitle {
          margin-top: 6px;
          color: #4a79a1;
          font-size: 15px;
          line-height: 1.55;
        }

        .section-text {
          color: #4f7da4;
          line-height: 1.65;
        }

        .modules-grid {
          margin-top: 24px;
        }

        .module-card {
          text-align: left;
          cursor: pointer;
          border-radius: 28px;
          padding: 22px 18px;
          position: relative;
          overflow: hidden;
        }

        .module-card.active {
          transform: translateY(-2px);
          box-shadow:
            0 26px 60px color-mix(in srgb, var(--accentFrom) 28%, transparent),
            inset 0 1px 0 rgba(255,255,255,0.98);
          border-color: color-mix(in srgb, var(--accentFrom) 80%, white);
        }

        .module-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          font-size: 28px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.98), rgba(212,246,255,0.88));
          box-shadow: 0 12px 30px color-mix(in srgb, var(--accentFrom) 14%, transparent);
          margin-bottom: 16px;
        }

        .module-title {
          font-size: 22px;
          font-weight: 900;
          color: #20669c;
          margin-bottom: 6px;
        }

        .module-desc {
          color: #4c7ba2;
          font-size: 14px;
          line-height: 1.55;
        }

        .module-active-badge {
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 8px 12px;
          background: color-mix(in srgb, var(--accentFrom) 12%, white);
          color: #1d6ea8;
          font-size: 13px;
          font-weight: 900;
          border: 1px solid color-mix(in srgb, var(--accentFrom) 40%, white);
        }

        .chat-area {
          margin-top: 26px;
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) 380px;
          gap: 22px;
          align-items: start;
        }

        .chat-panel,
        .side-card,
        .profile-card,
        .admin-card {
          border-radius: 30px;
          padding: 20px;
        }

        .chat-panel {
          min-height: 780px;
          display: flex;
          flex-direction: column;
        }

        .sticky-stack {
          position: sticky;
          top: 16px;
          display: grid;
          gap: 16px;
        }

        .chat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .status-pill {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(255,255,255,0.9);
          color: #2e6f9d;
          font-weight: 900;
          box-shadow: 0 12px 28px color-mix(in srgb, var(--accentFrom) 14%, transparent);
        }

        .status-pill.thinking {
          background: linear-gradient(
            135deg,
            var(--accentFrom),
            var(--accentTo)
          );
          color: #07355d;
        }

        .module-pills,
        .quick-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 14px;
        }

        .pill,
        .quick-pill,
        .quiz-option,
        .select,
        .date-input {
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
          color: #2b6c9a;
          background: rgba(255,255,255,0.84);
          border: 1px solid rgba(255,255,255,0.92);
          box-shadow: 0 10px 22px color-mix(in srgb, var(--accentFrom) 12%, transparent);
        }

        .pill.active {
          border: 2px solid color-mix(in srgb, var(--accentFrom) 84%, white);
          background: linear-gradient(
            135deg,
            rgba(255,255,255,1),
            color-mix(in srgb, var(--accentTo) 26%, white)
          );
        }

        .messages-box {
          flex: 1;
          overflow-y: auto;
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.92);
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.82),
              rgba(231,247,255,0.62)
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.98),
            0 22px 44px color-mix(in srgb, var(--accentFrom) 14%, transparent);
          padding: 16px;
        }

        .message-row {
          display: flex;
          margin-bottom: 14px;
        }

        .message-row.user {
          justify-content: flex-end;
        }

        .message-row.assistant {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 86%;
          border-radius: 24px;
          padding: 15px 16px;
          white-space: pre-wrap;
          line-height: 1.7;
          box-shadow: 0 16px 32px color-mix(in srgb, var(--accentFrom) 12%, transparent);
        }

        .message-bubble.user {
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accentFrom) 90%, white),
            color-mix(in srgb, var(--accentTo) 90%, white)
          );
          border: 1px solid color-mix(in srgb, var(--accentFrom) 70%, white);
          color: #063a66;
        }

        .message-bubble.assistant {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.97),
            rgba(232,247,255,0.92)
          );
          border: 1px solid rgba(255,255,255,0.92);
          color: #2a638e;
        }

        .message-label,
        .task-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.72;
          margin-bottom: 8px;
          font-weight: 900;
          color: #5b8ab0;
        }

        .card-bubble {
          width: min(100%, 760px);
          border-radius: 26px;
          padding: 18px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.97),
            rgba(232,247,255,0.92)
          );
          border: 1px solid rgba(255,255,255,0.92);
          color: #2a638e;
          box-shadow: 0 16px 32px color-mix(in srgb, var(--accentFrom) 12%, transparent);
        }

        .card-title {
          font-size: 24px;
          font-weight: 900;
          color: #1f6498;
          margin-bottom: 6px;
        }

        .card-intro {
          color: #4a7ba2;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .quiz-question {
          margin-bottom: 18px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.88);
        }

        .quiz-question-title {
          font-weight: 800;
          margin-bottom: 12px;
          color: #2a638e;
          line-height: 1.5;
        }

        .quiz-options,
        .task-steps,
        .field-row,
        .game-stats,
        .spread-grid,
        .admin-help-grid,
        .achievement-list {
          display: grid;
          gap: 10px;
        }

        .quiz-option {
          text-align: left;
          border-radius: 14px;
          padding: 10px 12px;
          white-space: normal;
        }

        .quiz-option.active {
          border: 2px solid color-mix(in srgb, var(--accentFrom) 84%, white);
          background: linear-gradient(
            135deg,
            rgba(255,255,255,1),
            color-mix(in srgb, var(--accentTo) 26%, white)
          );
        }

        .quiz-result,
        .result-box,
        .mini-panel,
        .task-box,
        .task-step,
        .game-panel,
        .profile-preview {
          border-radius: 18px;
          padding: 14px 16px;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.96),
            rgba(228,246,255,0.8)
          );
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 12px 28px color-mix(in srgb, var(--accentFrom) 12%, transparent);
        }

        .spread-grid {
          grid-template-columns: repeat(3, 1fr);
          margin-top: 14px;
        }

        .game-stats,
        .admin-help-grid {
          grid-template-columns: repeat(2, 1fr);
          margin-top: 12px;
        }

        .light-orb-btn {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          font-size: 40px;
          justify-self: center;
          background:
            radial-gradient(circle at 40% 35%, #ffffff 0%, #eaf9ff 36%, var(--accentTo) 68%, var(--accentFrom) 100%);
          box-shadow:
            0 0 28px rgba(255,255,255,0.9),
            0 0 50px color-mix(in srgb, var(--accentFrom) 55%, transparent);
        }

        .light-orb-btn.live {
          animation: pulse 1s ease-in-out infinite;
        }

        .input-wrap,
        .editor-box {
          margin-top: 14px;
        }

        .chat-input,
        .editor-input {
          width: 100%;
          resize: vertical;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.92);
          background: rgba(255,255,255,0.86);
          color: #1f5d90;
          padding: 15px;
          outline: none;
          font-size: 15px;
          box-shadow:
            0 14px 32px color-mix(in srgb, var(--accentFrom) 12%, transparent),
            inset 0 1px 0 rgba(255,255,255,0.98);
        }

        .input-bottom {
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .active-module {
          color: #517fa6;
          font-size: 14px;
        }

        .active-module strong {
          color: #1d659b;
        }

        .profile-admin-grid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .profile-preview {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-top: 14px;
        }

        .profile-avatar {
          width: 76px;
          height: 76px;
          border-radius: 22px;
          display: grid;
          place-items: center;
          font-size: 34px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.95);
          flex-shrink: 0;
        }

        .profile-name {
          font-size: 24px;
          font-weight: 900;
          color: #1d6497;
        }

        .profile-title {
          font-weight: 800;
          color: #4580aa;
          margin-top: 2px;
        }

        .profile-aura,
        .profile-bio {
          margin-top: 10px;
          color: #4f7da4;
          line-height: 1.6;
        }

        .profile-badges {
          margin-top: 12px;
        }

        .profile-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 900;
          color: #2f6d9c;
          border: 1px solid rgba(255,255,255,0.92);
          background: rgba(255,255,255,0.84);
        }

        .select,
        .date-input {
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 14px;
          white-space: normal;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes drift {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(38vw);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1100px) {
          .hero,
          .chat-area,
          .profile-admin-grid,
          .daily-grid {
            grid-template-columns: 1fr;
          }

          .reward-grid,
          .modules-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .sticky-stack {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .hero-left h1 {
            font-size: 48px;
          }

          .reward-grid,
          .modules-grid,
          .game-stats,
          .admin-help-grid,
          .hero-mini-grid,
          .spread-grid,
          .daily-grid {
            grid-template-columns: 1fr;
          }

          .message-bubble,
          .card-bubble {
            max-width: 100%;
            width: 100%;
          }

          .section-title {
            font-size: 28px;
          }

          .section-title.small {
            font-size: 22px;
          }

          .top-notice {
            flex-direction: column;
            align-items: flex-start;
          }

          .orbital {
            width: 280px;
            height: 280px;
          }

          .ring-1 {
            width: 250px;
            height: 250px;
          }

          .ring-2 {
            width: 194px;
            height: 194px;
          }

          .ring-3 {
            width: 136px;
            height: 136px;
          }

          .profile-preview {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

function RewardCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="reward-card">
      <div className="reward-top">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="reward-value">{value}</div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="mini-stat">
      <div className="mini-stat-top">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mini-stat-value">{value}</div>
    </div>
  );
}

function QuizCard({
  quiz,
  onReward,
}: {
  quiz: QuizPayload;
  onReward: (diamonds: number, light: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C">>({});
  const [submitted, setSubmitted] = useState(false);

  function setAnswer(questionId: string, option: string) {
    const letter = option.trim().charAt(0).toUpperCase() as "A" | "B" | "C";
    setAnswers((prev) => ({
      ...prev,
      [questionId]: letter,
    }));
  }

  const canSubmit = quiz.questions.every((q) => answers[q.id]);

  let resultText = "";
  if (submitted) {
    const counts = { A: 0, B: 0, C: 0 };
    Object.values(answers).forEach((v) => {
      counts[v]++;
    });

    if (counts.A >= counts.B && counts.A >= counts.C) {
      resultText = quiz.resultGuide.mostlyA;
    } else if (counts.B >= counts.A && counts.B >= counts.C) {
      resultText = quiz.resultGuide.mostlyB;
    } else {
      resultText = quiz.resultGuide.mostlyC;
    }
  }

  return (
    <div className="card-bubble">
      <div className="message-label">AI • Quiz</div>
      <div className="card-title">{quiz.title}</div>
      <div className="card-intro">{quiz.intro}</div>

      {quiz.questions.map((q, idx) => (
        <div key={q.id} className="quiz-question">
          <div className="quiz-question-title">
            {idx + 1}. {q.question}
          </div>

          <div className="quiz-options">
            {q.options.map((option) => {
              const letter = option.trim().charAt(0).toUpperCase();
              const active = answers[q.id] === letter;

              return (
                <button
                  key={option}
                  className={`quiz-option ${active ? "active" : ""}`}
                  onClick={() => setAnswer(q.id, option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          className="quiz-submit"
          disabled={!canSubmit}
          onClick={() => {
            setSubmitted(true);
            onReward(12, 10);
          }}
          style={{
            opacity: canSubmit ? 1 : 0.5,
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          Pokaż wynik
        </button>
      ) : (
        <div className="quiz-result">
          <div className="task-label">Wynik</div>
          <div>{resultText}</div>
        </div>
      )}
    </div>
  );
}

function TaskCard({
  task,
  onDone,
}: {
  task: TaskPayload;
  onDone: () => void;
}) {
  const [done, setDone] = useState(false);

  return (
    <div className="card-bubble">
      <div className="message-label">AI • Zadanie</div>
      <div className="card-title">{task.title}</div>
      <div className="card-intro">{task.goal}</div>

      <div className="task-box" style={{ marginBottom: 10 }}>
        <div className="task-label">Czas</div>
        <div>{task.duration}</div>
      </div>

      <div className="task-box" style={{ marginBottom: 14 }}>
        <div className="task-label">Wersja minimum</div>
        <div>{task.minimumVersion}</div>
      </div>

      <div className="task-label">Kroki</div>
      <div className="task-steps">
        {task.steps.map((step, index) => (
          <div key={index} className="task-step">
            <strong>{index + 1}.</strong> {step}
          </div>
        ))}
      </div>

      <div className="quiz-result" style={{ marginTop: 16 }}>
        <div className="task-label">Nagroda</div>
        <div>{task.reward}</div>
      </div>

      <button
        className="quiz-submit"
        onClick={() => {
          const next = !done;
          setDone(next);
          if (next) onDone();
        }}
        style={{ marginTop: 14 }}
      >
        {done ? "Oznaczone jako zrobione ✅" : "Oznacz jako zrobione"}
      </button>
    </div>
  );
}
