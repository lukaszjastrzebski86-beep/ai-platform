"use client";

import { useMemo, useState } from "react";

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

function id() {
  return Math.random().toString(36).slice(2, 10);
}

export default function HomePage() {
  const [activeModule, setActiveModule] = useState<ModuleType>("general");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
        const quizMessage: QuizMessage = {
          id: id(),
          kind: "quiz",
          role: "assistant",
          quiz: data.quiz,
        };
        setMessages((prev) => [...prev, quizMessage]);
        return;
      }

      if (data.type === "task" && data.task) {
        const taskMessage: TaskMessage = {
          id: id(),
          kind: "task",
          role: "assistant",
          task: data.task,
        };
        setMessages((prev) => [...prev, taskMessage]);
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
              Piękna przestrzeń do relacji, emocji, decyzji, quizów i zadań.
              Zamiast zwykłego czatu — interfejs, który prowadzi Cię ku
              jasności, spokojowi i działaniu.
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
                  const el = document.getElementById("modules-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Zobacz moduły
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
                <div className="floating-label">Daily Light</div>
                <div className="floating-value">+24</div>
              </div>

              <div className="floating-card floating-2">
                <div className="floating-label">Streak</div>
                <div className="floating-value">7 dni</div>
              </div>

              <div className="floating-card floating-3">
                <div className="floating-label">AI online</div>
                <div className="floating-value">3/3</div>
              </div>
            </div>
          </div>
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

                {active && (
                  <div className="module-active-badge">Aktywny moduł</div>
                )}
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
                      <QuizCard quiz={msg.quiz} />
                    </div>
                  );
                }

                if (msg.kind === "task") {
                  return (
                    <div key={msg.id} className="message-row assistant">
                      <TaskCard task={msg.task} />
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
                <div className="section-title small">Twój lot</div>

                <div className="reward-grid">
                  <RewardCard icon="🔥" label="Streak" value="7" />
                  <RewardCard icon="💎" label="Światło" value="248" />
                  <RewardCard icon="🎯" label="Cel dnia" value="1/3" />
                  <RewardCard icon="⚡" label="Energia" value="88%" />
                </div>
              </div>

              <div className="quick-start-card glass">
                <div className="section-title small">Szybkie wejścia</div>

                <div className="quick-start-list">
                  {[
                    "Mam chaos w głowie",
                    "Chcę zrozumieć relację",
                    "Pomóż mi nazwać moje emocje",
                    "Daj mi krótki quiz",
                    "Potrzebuję zadania na dziś",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => sendMessage(item)}
                      disabled={loading}
                      className="quick-start-btn"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="heaven-card glass">
                <div className="section-title small">Jak to działa</div>
                <div className="section-text">
                  Relacje i emocje dają krótszą, bardziej produktową odpowiedź.
                  Quiz i zadanie działają już jako prawdziwe karty interakcji,
                  a nie tylko ściana tekstu.
                </div>
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
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 18px 52px;
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

        .hero-actions {
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
        .module-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease,
            border-color 0.18s ease;
        }

        .primary-btn:hover,
        .secondary-btn:hover,
        .send-btn:hover,
        .quick-pill:hover,
        .quick-start-btn:hover,
        .module-card:hover,
        .pill:hover {
          transform: translateY(-1px);
        }

        .primary-btn {
          border: none;
          border-radius: 999px;
          padding: 14px 22px;
          font-weight: 900;
          cursor: pointer;
          color: #07335d;
          background: linear-gradient(135deg, #6ed4ff, #a8ecff);
          box-shadow: 0 18px 38px rgba(82, 192, 255, 0.30);
        }

        .secondary-btn {
          border-radius: 999px;
          padding: 14px 22px;
          font-weight: 900;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.72);
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

        .modules-grid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
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
        .heaven-card {
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

        .pill {
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
          box-shadow: 0 14px 30px rgba(96, 197, 255, 0.20);
        }

        .quick-pill {
          border-radius: 999px;
          padding: 10px 14px;
          border: 1px solid rgba(144, 220, 255, 0.72);
          background: rgba(255, 255, 255, 0.75);
          color: #2f6996;
          cursor: pointer;
          font-size: 13px;
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

        .message-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.72;
          margin-bottom: 8px;
          font-weight: 900;
        }

        .card-bubble {
          width: min(100%, 640px);
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

        .quiz-options {
          display: grid;
          gap: 8px;
        }

        .quiz-option {
          text-align: left;
          border-radius: 14px;
          border: 1px solid rgba(160, 228, 255, 0.82);
          background: rgba(255,255,255,0.88);
          color: #2b6797;
          padding: 10px 12px;
          cursor: pointer;
          font-weight: 600;
        }

        .quiz-option.active {
          border: 2px solid rgba(89, 197, 255, 0.96);
          background: linear-gradient(135deg, #ffffff, #d6f3ff);
        }

        .quiz-result {
          margin-top: 16px;
          border-radius: 18px;
          padding: 16px;
          background: linear-gradient(135deg, #effbff, #dff4ff);
          border: 1px solid rgba(137, 217, 255, 0.86);
        }

        .quiz-submit {
          margin-top: 8px;
          border: none;
          border-radius: 999px;
          padding: 12px 18px;
          cursor: pointer;
          font-weight: 900;
          color: #063a66;
          background: linear-gradient(135deg, #64d1ff, #aceeff);
        }

        .task-meta {
          display: grid;
          gap: 10px;
          margin: 14px 0;
        }

        .task-box {
          border-radius: 16px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.66);
          border: 1px solid rgba(174, 231, 255, 0.76);
        }

        .task-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 900;
          color: #5b8ab0;
          margin-bottom: 6px;
        }

        .task-steps {
          display: grid;
          gap: 10px;
          margin-top: 8px;
        }

        .task-step {
          border-radius: 14px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(160, 228, 255, 0.82);
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

        .send-btn {
          border: none;
          border-radius: 999px;
          padding: 13px 20px;
          font-weight: 900;
          cursor: pointer;
          color: #073b67;
          background: linear-gradient(135deg, #64d1ff, #aceeff);
          box-shadow: 0 16px 34px rgba(84, 194, 255, 0.28);
        }

        .side-panel {
          display: grid;
          gap: 16px;
          align-content: start;
        }

        .reward-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 12px;
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

        .quick-start-list {
          display: grid;
          gap: 10px;
          margin-top: 12px;
        }

        .quick-start-btn {
          text-align: left;
          border-radius: 16px;
          border: 1px solid rgba(156, 226, 255, 0.78);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.96), rgba(220,243,255,0.90));
          color: #2f6996;
          padding: 13px 14px;
          cursor: pointer;
          font-weight: 700;
        }

        @media (max-width: 1100px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .modules-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .chat-area {
            grid-template-columns: 1fr;
          }

          .sticky-stack {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .modules-grid {
            grid-template-columns: 1fr;
          }

          .hero-left h1 {
            font-size: 48px;
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
        }
      `}</style>
    </main>
  );
}

function QuizCard({ quiz }: { quiz: QuizPayload }) {
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
          onClick={() => setSubmitted(true)}
          style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? "pointer" : "not-allowed" }}
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

function TaskCard({ task }: { task: TaskPayload }) {
  const [done, setDone] = useState(false);

  return (
    <div className="card-bubble">
      <div className="message-label">AI • Zadanie</div>
      <div className="card-title">{task.title}</div>
      <div className="card-intro">{task.goal}</div>

      <div className="task-meta">
        <div className="task-box">
          <div className="task-label">Czas</div>
          <div>{task.duration}</div>
        </div>

        <div className="task-box">
          <div className="task-label">Wersja minimum</div>
          <div>{task.minimumVersion}</div>
        </div>
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
        onClick={() => setDone((v) => !v)}
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
