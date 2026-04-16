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
    "Jak mam z nim / z nią rozmawiać?",
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

  const [diamonds, setDiamonds] = useState(120);
  const [light, setLight] = useState(240);
  const [energy, setEnergy] = useState(84);
  const [streak, setStreak] = useState(7);
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const [zodiac, setZodiac] = useState("Waga");

  const [tarotCard, setTarotCard] = useState<(typeof tarotDeck)[number] | null>(
    null
  );
  const [tarotSpread, setTarotSpread] = useState<(typeof tarotDeck)[]>([]);

  const [birthDate, setBirthDate] = useState("");
  const lifePath = calcLifePath(birthDate);

  const [wheelResult, setWheelResult] = useState("");
  const [wheelSpinning, setWheelSpinning] = useState(false);

  const [gameRunning, setGameRunning] = useState(false);
  const [gameTime, setGameTime] = useState(20);
  const [gameScore, setGameScore] = useState(0);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: id(),
      kind: "text",
      role: "assistant",
      content:
        "Witaj. Jestem Twoim AI. Pomagam odzyskać jasność, spokój i kierunek w relacjach, emocjach i decyzjach. Wybierz moduł albo napisz, z czym mam Ci pomóc.",
    },
  ]);

  const currentQuickPrompts = useMemo(
    () => quickPrompts[activeModule] || quickPrompts.general,
    [activeModule]
  );

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

  function claimDailyReward() {
    if (dailyClaimed) return;
    setDiamonds((d) => d + 25);
    setLight((l) => l + 18);
    setEnergy((e) => Math.min(100, e + 10));
    setStreak((s) => s + 1);
    setDailyClaimed(true);
  }

  function drawTarotCard() {
    const random = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    setTarotCard(random);
    setLight((l) => l + 3);
  }

  function drawTarotSpread() {
    const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5).slice(0, 3);
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

  function onEnter(
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="page">
      <div className="sky-layer sky-1" />
      <div className="sky-layer sky-2" />
      <div className="stars" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="glow glow-3" />

      <div className="container">
        <section className="hero glass">
          <div className="hero-left">
            <div className="hero-badge">
              <span>☁️</span>
              <span>Heavenly AI Engine</span>
              <span className="live-dot" />
              <span>LIVE</span>
            </div>

            <h1>
              Jedno AI.
              <br />
              Więcej światła,
              <br />
              mniej chaosu.
            </h1>

            <p className="hero-text">
              Relacje, emocje, quizy, zadania, tarot, horoskop, numerologia,
              diamenty i grywalizacja — wszystko w jednym, pięknym interfejsie.
            </p>

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
                  const el = document.getElementById("magic-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Magia dnia
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="orb-wrap">
              <div className="orb-ring orb-ring-1" />
              <div className="orb-ring orb-ring-2" />
              <div className="orb-ring orb-ring-3" />
              <div className="orb-core">
                <div className="orb-core-inner">✨</div>
              </div>

              <div className="floating-card floating-1">
                <div className="floating-label">Diamenty</div>
                <div className="floating-value">{diamonds}</div>
              </div>

              <div className="floating-card floating-2">
                <div className="floating-label">Światło</div>
                <div className="floating-value">{light}</div>
              </div>

              <div className="floating-card floating-3">
                <div className="floating-label">Energia</div>
                <div className="floating-value">{energy}%</div>
              </div>
            </div>
          </div>
        </section>

        <section className="top-stats-grid">
          <RewardCard icon="💎" label="Diamenty" value={String(diamonds)} />
          <RewardCard icon="☀️" label="Światło" value={String(light)} />
          <RewardCard icon="⚡" label="Energia" value={`${energy}%`} />
          <RewardCard icon="🔥" label="Streak" value={`${streak}`} />
        </section>

        <section id="modules-section" className="modules-grid">
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
                {active && <div className="module-active-badge">Aktywny moduł</div>}
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
              <div className="reward-panel glass">
                <div className="section-title small">Daily Reward</div>
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
                  {dailyClaimed ? "Odebrane ✅" : "Odbierz +25 diamentów"}
                </button>
              </div>

              <div className="reward-panel glass">
                <div className="section-title small">Koło fortuny</div>
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
            </div>
          </div>
        </section>

        <section id="magic-section" className="magic-grid">
          <div className="magic-card glass">
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

          <div className="magic-card glass">
            <div className="section-title small">Tarot / karta dnia</div>
            <div className="button-row">
              <button className="action-btn" onClick={drawTarotCard}>
                Losuj kartę dnia
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

          <div className="magic-card glass">
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
                <div style={{ marginTop: 8 }}>{lifePathMeaning(lifePath)}</div>
              </div>
            )}
          </div>

          <div className="magic-card glass">
            <div className="section-title small">Mini gra: zbieranie światła</div>
            <div className="section-text">
              Klikaj światło przez 20 sekund. Zdobyte punkty zamienią się na diamenty.
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
        </section>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: #17365d;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, Segoe UI, sans-serif;
          background:
            radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.96), transparent 24%),
            linear-gradient(180deg, #e8f8ff 0%, #c7ebff 18%, #98d8ff 40%, #7bcbff 70%, #70c5ff 100%);
        }

        .sky-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .sky-1 {
          background:
            radial-gradient(circle at 10% 22%, rgba(255, 255, 255, 0.75), transparent 17%),
            radial-gradient(circle at 88% 18%, rgba(255, 255, 255, 0.75), transparent 15%),
            radial-gradient(circle at 62% 0%, rgba(255, 255, 255, 0.56), transparent 14%);
          opacity: 0.95;
        }

        .sky-2 {
          background:
            radial-gradient(circle at 22% 62%, rgba(255, 255, 255, 0.26), transparent 18%),
            radial-gradient(circle at 92% 72%, rgba(255, 255, 255, 0.20), transparent 22%);
          opacity: 0.9;
        }

        .stars {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 8% 12%, rgba(255,255,255,0.85) 0 2px, transparent 3px),
            radial-gradient(circle at 36% 16%, rgba(255,255,255,0.85) 0 1.8px, transparent 2.5px),
            radial-gradient(circle at 67% 20%, rgba(255,255,255,0.78) 0 1.8px, transparent 2.7px),
            radial-gradient(circle at 90% 30%, rgba(255,255,255,0.78) 0 1.6px, transparent 2.3px),
            radial-gradient(circle at 15% 70%, rgba(255,255,255,0.82) 0 1.8px, transparent 2.5px),
            radial-gradient(circle at 66% 78%, rgba(255,255,255,0.82) 0 1.7px, transparent 2.5px);
          opacity: 0.85;
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
          background: rgba(255, 255, 255, 0.55);
          top: -120px;
          left: -80px;
        }

        .glow-2 {
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.36);
          top: 10%;
          right: -100px;
        }

        .glow-3 {
          width: 440px;
          height: 440px;
          background: rgba(122, 223, 255, 0.25);
          bottom: -160px;
          left: 30%;
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1320px;
          margin: 0 auto;
          padding: 24px 18px 60px;
        }

        .glass {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.68),
            rgba(255, 255, 255, 0.34)
          );
          border: 1px solid rgba(255, 255, 255, 0.72);
          box-shadow:
            0 22px 58px rgba(91, 182, 255, 0.20),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
        }

        .hero {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 28px;
          padding: 32px 30px;
          border-radius: 34px;
        }

        .hero-left h1 {
          margin: 0;
          font-size: clamp(42px, 7vw, 84px);
          line-height: 0.96;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: #1a5c90;
          text-shadow:
            0 0 12px rgba(255,255,255,0.65),
            0 0 28px rgba(113, 215, 255, 0.34);
        }

        .hero-text {
          margin-top: 18px;
          max-width: 680px;
          font-size: 18px;
          line-height: 1.65;
          color: #40739d;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-radius: 999px;
          padding: 9px 14px;
          margin-bottom: 18px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.82);
          box-shadow: 0 12px 30px rgba(111, 197, 255, 0.22);
          font-weight: 800;
          color: #2d6e9e;
          font-size: 14px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 0 6px rgba(52, 211, 153, 0.18);
        }

        .hero-actions,
        .button-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .primary-btn,
        .secondary-btn,
        .send-btn,
        .pill,
        .quick-pill,
        .quick-start-btn,
        .module-card,
        .action-btn,
        .quiz-submit,
        .quiz-option,
        .light-orb-btn {
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease,
            border-color 0.18s ease;
        }

        .primary-btn:hover,
        .secondary-btn:hover,
        .send-btn:hover,
        .quick-pill:hover,
        .quick-start-btn:hover,
        .module-card:hover,
        .pill:hover,
        .action-btn:hover,
        .quiz-submit:hover,
        .quiz-option:hover,
        .light-orb-btn:hover {
          transform: translateY(-1px);
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
          color: #07335d;
          background: linear-gradient(135deg, #6ed4ff, #a8ecff);
          box-shadow: 0 16px 34px rgba(84, 194, 255, 0.28);
        }

        .action-btn.secondary,
        .secondary-btn {
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(140, 213, 255, 0.76);
          color: #2f6795;
          box-shadow: 0 12px 28px rgba(128, 205, 255, 0.18);
        }

        .hero-right {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orb-wrap {
          position: relative;
          width: 360px;
          height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orb-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.72);
          box-shadow: 0 0 40px rgba(123, 221, 255, 0.24);
        }

        .orb-ring-1 {
          width: 320px;
          height: 320px;
        }

        .orb-ring-2 {
          width: 250px;
          height: 250px;
          border-style: dashed;
        }

        .orb-ring-3 {
          width: 170px;
          height: 170px;
        }

        .orb-core {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 40% 35%, #ffffff 0%, #eaf9ff 36%, #8ddcff 68%, #54c3ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 38px rgba(255,255,255,0.95),
            0 0 80px rgba(110, 214, 255, 0.66),
            0 0 120px rgba(134, 223, 255, 0.42);
        }

        .orb-core-inner {
          font-size: 34px;
        }

        .floating-card {
          position: absolute;
          min-width: 112px;
          padding: 12px 14px;
          border-radius: 18px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.82),
            rgba(230, 247, 255, 0.58)
          );
          border: 1px solid rgba(255, 255, 255, 0.82);
          box-shadow: 0 16px 36px rgba(120, 207, 255, 0.16);
        }

        .floating-1 {
          top: 22px;
          left: 4px;
        }

        .floating-2 {
          top: 68px;
          right: -6px;
        }

        .floating-3 {
          bottom: 34px;
          left: 18px;
        }

        .floating-label {
          font-size: 12px;
          color: #5889ae;
          font-weight: 700;
        }

        .floating-value {
          margin-top: 6px;
          font-size: 22px;
          font-weight: 900;
          color: #1e679e;
        }

        .top-stats-grid,
        .modules-grid,
        .magic-grid {
          margin-top: 26px;
          display: grid;
          gap: 16px;
        }

        .top-stats-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .modules-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .magic-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
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
            0 26px 60px rgba(91, 182, 255, 0.28),
            inset 0 1px 0 rgba(255,255,255,0.98);
          border-color: rgba(88, 196, 255, 0.95);
        }

        .module-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          font-size: 28px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.98), rgba(189, 233, 255, 0.88));
          box-shadow: 0 12px 26px rgba(110, 214, 255, 0.14);
          margin-bottom: 16px;
        }

        .module-title {
          font-size: 22px;
          font-weight: 900;
          color: #206499;
          margin-bottom: 6px;
        }

        .module-desc {
          color: #4a79a1;
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
          background: rgba(93, 195, 255, 0.14);
          color: #1d6ea8;
          font-size: 13px;
          font-weight: 900;
          border: 1px solid rgba(104, 205, 255, 0.42);
        }

        .chat-area {
          margin-top: 26px;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) 380px;
          gap: 22px;
          align-items: start;
        }

        .chat-panel,
        .reward-panel,
        .quick-start-card,
        .heaven-card,
        .magic-card {
          border-radius: 30px;
          padding: 18px;
        }

        .chat-panel {
          min-height: 760px;
          display: flex;
          flex-direction: column;
        }

        .sticky-stack {
          position: sticky;
          top: 18px;
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

        .section-title {
          font-size: 34px;
          font-weight: 900;
          color: #1c6599;
          line-height: 1.05;
        }

        .section-title.small {
          font-size: 24px;
        }

        .section-subtitle {
          margin-top: 6px;
          color: #4c7ba0;
          font-size: 15px;
        }

        .section-text {
          color: #4d7ba2;
          line-height: 1.65;
        }

        .status-pill {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(149, 222, 255, 0.72);
          color: #2e6f9d;
          font-weight: 900;
          box-shadow: 0 12px 28px rgba(142, 209, 255, 0.16);
        }

        .status-pill.thinking {
          background: linear-gradient(135deg, #72d8ff, #b5f0ff);
          color: #083b65;
        }

        .module-pills,
        .quick-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 14px;
        }

        .pill,
        .quick-pill {
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
          color: #2c6c9b;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(148, 221, 255, 0.74);
          box-shadow: 0 10px 22px rgba(138, 207, 255, 0.14);
        }

        .pill.active {
          border: 2px solid rgba(89, 197, 255, 0.96);
          background: linear-gradient(135deg, #ffffff, #d6f3ff);
        }

        .messages-box {
          flex: 1;
          overflow-y: auto;
          border-radius: 26px;
          border: 1px solid rgba(255, 255, 255, 0.86);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.82), rgba(233,248,255,0.58));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.98),
            0 22px 44px rgba(132, 209, 255, 0.16);
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
          max-width: 84%;
          border-radius: 24px;
          padding: 15px 16px;
          white-space: pre-wrap;
          line-height: 1.7;
          box-shadow: 0 16px 32px rgba(132, 210, 255, 0.12);
        }

        .message-bubble.user {
          background: linear-gradient(135deg, #77daff, #b4efff);
          border: 1px solid rgba(96, 201, 255, 0.9);
          color: #063a66;
        }

        .message-bubble.assistant {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.97),
            rgba(232, 247, 255, 0.92)
          );
          border: 1px solid rgba(160, 228, 255, 0.82);
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
          width: min(100%, 700px);
          border-radius: 26px;
          padding: 18px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.96),
            rgba(232, 247, 255, 0.92)
          );
          border: 1px solid rgba(160, 228, 255, 0.82);
          color: #2a638e;
          box-shadow: 0 16px 32px rgba(132, 210, 255, 0.12);
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
          background: rgba(255,255,255,0.66);
          border: 1px solid rgba(174, 231, 255, 0.76);
        }

        .quiz-question-title {
          font-weight: 800;
          margin-bottom: 12px;
          color: #2a638e;
          line-height: 1.5;
        }

        .quiz-options,
        .task-steps,
        .quick-start-list,
        .field-row {
          display: grid;
          gap: 10px;
        }

        .quiz-option,
        .quick-start-btn,
        .select,
        .date-input {
          text-align: left;
          border-radius: 14px;
          border: 1px solid rgba(160, 228, 255, 0.82);
          background: rgba(255,255,255,0.88);
          color: #2b6797;
          padding: 10px 12px;
          cursor: pointer;
          font-weight: 600;
        }

        .select,
        .date-input {
          cursor: initial;
          outline: none;
        }

        .quiz-option.active {
          border: 2px solid rgba(89, 197, 255, 0.96);
          background: linear-gradient(135deg, #ffffff, #d6f3ff);
        }

        .quiz-result,
        .result-box,
        .mini-panel,
        .task-box,
        .task-step,
        .game-panel {
          border-radius: 18px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #effbff, #dff4ff);
          border: 1px solid rgba(137, 217, 255, 0.86);
        }

        .spread-grid,
        .game-stats,
        .reward-grid {
          display: grid;
          gap: 12px;
        }

        .spread-grid {
          grid-template-columns: repeat(3, 1fr);
          margin-top: 14px;
        }

        .game-stats,
        .reward-grid {
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
            radial-gradient(circle at 40% 35%, #ffffff 0%, #eaf9ff 36%, #8ddcff 68%, #54c3ff 100%);
          box-shadow:
            0 0 28px rgba(255,255,255,0.9),
            0 0 50px rgba(110,214,255,0.55);
        }

        .light-orb-btn.live {
          animation: pulse 1s ease-in-out infinite;
        }

        .input-wrap {
          margin-top: 14px;
        }

        .chat-input {
          width: 100%;
          resize: vertical;
          border-radius: 24px;
          border: 1px solid rgba(151, 222, 255, 0.82);
          background: rgba(255, 255, 255, 0.88);
          color: #1f5d90;
          padding: 15px;
          outline: none;
          font-size: 15px;
          box-shadow:
            0 14px 32px rgba(143, 213, 255, 0.16),
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

        .reward-card {
          border-radius: 22px;
          padding: 16px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.86), rgba(225,246,255,0.72));
          border: 1px solid rgba(255,255,255,0.85);
          box-shadow: 0 14px 28px rgba(129, 209, 255, 0.14);
        }

        .reward-top {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5b8ab0;
          font-weight: 800;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .reward-value {
          font-size: 28px;
          font-weight: 900;
          color: #1d679d;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @media (max-width: 1100px) {
          .hero,
          .chat-area,
          .magic-grid {
            grid-template-columns: 1fr;
          }

          .modules-grid,
          .top-stats-grid {
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

          .modules-grid,
          .top-stats-grid,
          .magic-grid,
          .spread-grid {
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

          .orb-wrap {
            width: 280px;
            height: 280px;
          }

          .orb-ring-1 {
            width: 250px;
            height: 250px;
          }

          .orb-ring-2 {
            width: 194px;
            height: 194px;
          }

          .orb-ring-3 {
            width: 136px;
            height: 136px;
          }
        }
      `}</style>
    </main>
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
