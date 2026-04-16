"use client";

import { useMemo, useState } from "react";

type ModuleType =
  | "general"
  | "relationships"
  | "emotions"
  | "quiz"
  | "task";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
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
    desc: "Mikro‑akcje, plan minimum i następny krok",
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
    "Zrób mi krótki quiz diagnostyczny",
    "Sprawdź, w jakim jestem stanie",
    "Zadaj mi kilka pytań i oceń sytuację",
  ],
  task: [
    "Daj mi zadanie na dziś",
    "Potrzebuję prostego planu minimum",
    "Jaki jest mój następny krok?",
  ],
};

export default function HomePage() {
  const [activeModule, setActiveModule] = useState<ModuleType>("general");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
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

    const userMessage: ChatMessage = {
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
            role: "assistant",
            content: `Błąd: ${data?.error || "Nieznany błąd"}${
              data?.details ? ` — ${data.details}` : ""
            }`,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Brak odpowiedzi",
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
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

            <div className="hero-mini-grid">
              <MiniStat title="Ukryte silniki" value="3" icon="✨" />
              <MiniStat title="Moduły startowe" value="4" icon="🪽" />
              <MiniStat title="Dostępność" value="24/7" icon="☀️" />
              <MiniStat title="Możliwości" value="∞" icon="🌤️" />
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

            <div className="daily-card">
              <div className="daily-head">Zadanie dnia</div>
              <div className="daily-text">
                Zatrzymaj się na 2 minuty i nazwij jedną rzecz, która dziś
                najbardziej zabiera Ci energię. Potem napisz o tym do AI.
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
              {messages.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  className={`message-row ${msg.role}`}
                >
                  <div className={`message-bubble ${msg.role}`}>
                    <div className="message-label">
                      {msg.role === "user" ? "Ty" : "AI"}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
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
            <div className="side-grid">
              <InfoCard
                title="Jak to działa"
                icon="☀️"
                text="Pod maską działają trzy szybkie role: zrozumienie problemu, plan działania i kontrola jakości. Użytkownik widzi tylko jedno, spójne AI."
              />

              <InfoCard
                title="Dla kogo"
                icon="🪽"
                text="Dla osób, które chcą zrozumieć relacje, uporządkować emocje, zrobić szybki quiz albo dostać następny krok, gdy brakuje jasności."
              />
            </div>

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
              <div className="section-title small">Światło • Energia • Forma</div>
              <div className="section-text">
                Produkt ma nie tylko odpowiadać, ale pomagać odzyskać kierunek,
                spokój i ruch. To nie jest zwykły chatbot — to przestrzeń do
                zrozumienia siebie i działania.
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
            radial-gradient(circle at 62% 0%, rgba(255, 255, 255, 0.56), transparent 14%),
            radial-gradient(circle at 75% 74%, rgba(255, 255, 255, 0.32), transparent 24%);
          opacity: 0.95;
        }

        .sky-2 {
          background:
            radial-gradient(circle at 22% 62%, rgba(255, 255, 255, 0.26), transparent 18%),
            radial-gradient(circle at 92% 72%, rgba(255, 255, 255, 0.20), transparent 22%),
            radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.18), transparent 24%);
          opacity: 0.9;
        }

        .stars {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 8% 12%, rgba(255,255,255,0.85) 0 2px, transparent 3px),
            radial-gradient(circle at 18% 28%, rgba(255,255,255,0.75) 0 1.6px, transparent 2.5px),
            radial-gradient(circle at 36% 16%, rgba(255,255,255,0.85) 0 1.8px, transparent 2.5px),
            radial-gradient(circle at 54% 10%, rgba(255,255,255,0.65) 0 1.5px, transparent 2.2px),
            radial-gradient(circle at 67% 20%, rgba(255,255,255,0.78) 0 1.8px, transparent 2.7px),
            radial-gradient(circle at 82% 14%, rgba(255,255,255,0.85) 0 1.8px, transparent 2.5px),
            radial-gradient(circle at 90% 30%, rgba(255,255,255,0.78) 0 1.6px, transparent 2.3px),
            radial-gradient(circle at 15% 70%, rgba(255,255,255,0.82) 0 1.8px, transparent 2.5px),
            radial-gradient(circle at 32% 84%, rgba(255,255,255,0.72) 0 1.6px, transparent 2.5px),
            radial-gradient(circle at 66% 78%, rgba(255,255,255,0.82) 0 1.7px, transparent 2.5px),
            radial-gradient(circle at 88% 64%, rgba(255,255,255,0.70) 0 1.6px, transparent 2.5px);
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
          animation: drift 9s ease-in-out infinite alternate;
        }

        .glow-2 {
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.36);
          top: 10%;
          right: -100px;
          animation: drift 10s ease-in-out infinite alternate;
        }

        .glow-3 {
          width: 440px;
          height: 440px;
          background: rgba(122, 223, 255, 0.25);
          bottom: -160px;
          left: 30%;
          animation: drift 12s ease-in-out infinite alternate;
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

        .hero-mini-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 26px;
        }

        .mini-stat {
          border-radius: 22px;
          padding: 16px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.84),
            rgba(230, 247, 255, 0.62)
          );
          border: 1px solid rgba(255, 255, 255, 0.84);
          box-shadow: 0 14px 30px rgba(125, 206, 255, 0.14);
        }

        .mini-stat-top {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #4d7fa6;
          margin-bottom: 8px;
        }

        .mini-stat-value {
          font-size: 28px;
          font-weight: 900;
          color: #1e679e;
        }

        .hero-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 22px;
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
          animation: rotateSlow 18s linear infinite;
        }

        .orb-ring-2 {
          width: 250px;
          height: 250px;
          border-style: dashed;
          animation: rotateReverse 12s linear infinite;
        }

        .orb-ring-3 {
          width: 170px;
          height: 170px;
          opacity: 0.9;
          animation: pulse 4s ease-in-out infinite;
        }

        .orb-core {
          position: relative;
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
          animation: pulse 4.5s ease-in-out infinite;
        }

        .orb-core-inner {
          font-size: 34px;
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.88));
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
          backdrop-filter: blur(10px);
        }

        .floating-1 {
          top: 22px;
          left: 4px;
          animation: bob 4.8s ease-in-out infinite;
        }

        .floating-2 {
          top: 68px;
          right: -6px;
          animation: bob 5.3s ease-in-out infinite 1s;
        }

        .floating-3 {
          bottom: 34px;
          left: 18px;
          animation: bob 4.4s ease-in-out infinite 0.6s;
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

        .daily-card {
          width: 100%;
          max-width: 420px;
          border-radius: 24px;
          padding: 18px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.78),
            rgba(235, 249, 255, 0.48)
          );
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 16px 42px rgba(122, 205, 255, 0.16);
        }

        .daily-head {
          font-size: 18px;
          font-weight: 900;
          color: #1e679e;
          margin-bottom: 8px;
        }

        .daily-text {
          color: #4c7ba2;
          line-height: 1.6;
          font-size: 15px;
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

        .module-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(255,255,255,0.75), transparent 22%),
            radial-gradient(circle at bottom left, rgba(114, 214, 255, 0.18), transparent 28%);
          opacity: 0.9;
          pointer-events: none;
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
          box-shadow:
            0 0 28px rgba(143, 228, 255, 0.24),
            0 12px 26px rgba(110, 214, 255, 0.14);
          position: relative;
          z-index: 1;
          margin-bottom: 16px;
        }

        .module-title {
          position: relative;
          z-index: 1;
          font-size: 22px;
          font-weight: 900;
          color: #206499;
          margin-bottom: 6px;
        }

        .module-desc {
          position: relative;
          z-index: 1;
          color: #4a79a1;
          font-size: 14px;
          line-height: 1.55;
        }

        .module-active-badge {
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
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
          grid-template-columns: 1.12fr 0.88fr;
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
          box-shadow: 0 10px 22px rgba(138, 207, 255, 0.12);
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

        .side-grid {
          display: grid;
          gap: 16px;
        }

        .info-card {
          border-radius: 30px;
          padding: 18px;
        }

        .info-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .info-title {
          font-size: 24px;
          font-weight: 900;
          color: #216397;
        }

        .info-text {
          color: #4d7aa1;
          line-height: 1.65;
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
          box-shadow: 0 10px 22px rgba(142, 209, 255, 0.12);
          font-weight: 700;
        }

        @keyframes rotateSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes drift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(18px, -10px, 0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes bob {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @media (max-width: 1100px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .hero-mini-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chat-area {
            grid-template-columns: 1fr;
          }

          .modules-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .container {
            padding: 18px 14px 42px;
          }

          .hero {
            padding: 22px 18px;
            border-radius: 28px;
          }

          .hero-left h1 {
            font-size: 48px;
          }

          .hero-mini-grid {
            grid-template-columns: 1fr 1fr;
          }

          .modules-grid {
            grid-template-columns: 1fr;
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

          .hero-right {
            margin-top: 10px;
          }

          .message-bubble {
            max-width: 92%;
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

function MiniStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="mini-stat">
      <div className="mini-stat-top">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="mini-stat-value">{value}</div>
    </div>
  );
}

function InfoCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="info-card glass">
      <div className="info-head">
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div className="info-title">{title}</div>
      </div>
      <div className="info-text">{text}</div>
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
