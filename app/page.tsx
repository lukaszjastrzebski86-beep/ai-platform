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
  color: string;
}[] = [
  {
    key: "relationships",
    title: "Relacje",
    desc: "Sygnały, komunikacja, granice i dynamika",
    emoji: "🤍",
    color: "linear-gradient(135deg, #9ad7ff, #d7efff)",
  },
  {
    key: "emotions",
    title: "Emocje",
    desc: "Nazwanie stanu, regulacja, odzyskanie spokoju",
    emoji: "🫀",
    color: "linear-gradient(135deg, #86d8ff, #cfeeff)",
  },
  {
    key: "quiz",
    title: "Quiz",
    desc: "Krótka diagnostyka i pytania prowadzące",
    emoji: "🧠",
    color: "linear-gradient(135deg, #82cfff, #e0f5ff)",
  },
  {
    key: "task",
    title: "Zadanie",
    desc: "Mikro‑akcje, plan minimum i następny krok",
    emoji: "⚡",
    color: "linear-gradient(135deg, #7ccfff, #d9f4ff)",
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
    <main
      style={{
        minHeight: "100vh",
        color: "#12355b",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        background: `
          radial-gradient(circle at 10% 15%, rgba(255,255,255,0.95), transparent 16%),
          radial-gradient(circle at 85% 12%, rgba(255,255,255,0.7), transparent 14%),
          radial-gradient(circle at 60% 3%, rgba(255,255,255,0.5), transparent 8%),
          linear-gradient(180deg, #f3fbff 0%, #d8f1ff 28%, #b7e5ff 56%, #96d6ff 100%)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.7), transparent 70%)",
            top: -120,
            left: -80,
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.65), transparent 70%)",
            top: 100,
            right: -80,
            filter: "blur(12px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.45), transparent 70%)",
            bottom: 40,
            left: "8%",
            filter: "blur(18px)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "26px 18px 48px",
        }}
      >
        <section
          style={{
            borderRadius: 30,
            padding: "34px 28px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,255,255,0.48))",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow:
              "0 22px 60px rgba(106, 181, 255, 0.30), inset 0 1px 0 rgba(255,255,255,0.9)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 999,
              padding: "9px 14px",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(136, 204, 255, 0.7)",
              boxShadow: "0 8px 24px rgba(123, 197, 255, 0.18)",
              marginBottom: 18,
              fontWeight: 700,
              color: "#2b6ea8",
              fontSize: 14,
            }}
          >
            <span>☁️</span>
            <span>Heavenly AI Engine</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: 28,
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(34px, 6vw, 68px)",
                  lineHeight: 0.98,
                  margin: 0,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#1b4f81",
                  textShadow: "0 8px 24px rgba(255,255,255,0.48)",
                }}
              >
                Jedno AI.
                <br />
                Więcej światła,
                <br />
                mniej chaosu.
              </h1>

              <p
                style={{
                  marginTop: 18,
                  maxWidth: 720,
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: "#356792",
                }}
              >
                Przestrzeń do relacji, emocji, decyzji, quizów i zadań.
                Zamiast zwykłego czatu — piękny, spokojny interfejs, który
                pomaga odzyskać kierunek i poczucie sensu.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  marginTop: 22,
                }}
              >
                <button
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "14px 22px",
                    fontWeight: 800,
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #52b6ff, #95dfff)",
                    color: "#07335e",
                    boxShadow: "0 14px 36px rgba(69, 179, 255, 0.35)",
                  }}
                  onClick={() => {
                    const el = document.getElementById("chat-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Wejdź do AI
                </button>

                <button
                  style={{
                    borderRadius: 999,
                    padding: "14px 22px",
                    fontWeight: 800,
                    cursor: "pointer",
                    background: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(118, 194, 255, 0.75)",
                    color: "#2f6895",
                    boxShadow: "0 10px 28px rgba(145, 213, 255, 0.20)",
                  }}
                  onClick={() => {
                    const el = document.getElementById("modules-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Zobacz moduły
                </button>
              </div>
            </div>

            <div
              style={{
                borderRadius: 28,
                padding: 22,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,255,255,0.46))",
                border: "1px solid rgba(255,255,255,0.82)",
                boxShadow:
                  "0 16px 40px rgba(105, 177, 255, 0.24), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 14,
                }}
              >
                <StatCard value="3" label="Ukryte silniki AI" icon="✨" />
                <StatCard value="4" label="Moduły startowe" icon="🪽" />
                <StatCard value="24/7" label="Dostępność" icon="☀️" />
                <StatCard value="∞" label="Możliwości rozwoju" icon="🌤️" />
              </div>

              <div
                style={{
                  marginTop: 16,
                  borderRadius: 18,
                  padding: 16,
                  background:
                    "linear-gradient(135deg, rgba(121, 205, 255, 0.24), rgba(255,255,255,0.65))",
                  border: "1px solid rgba(120, 201, 255, 0.48)",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    color: "#23679d",
                    marginBottom: 6,
                  }}
                >
                  Zadanie dnia
                </div>
                <div style={{ color: "#3b6f96", lineHeight: 1.5 }}>
                  Zatrzymaj się na 2 minuty i nazwij jedną rzecz, która dziś
                  najbardziej zabiera Ci energię. Potem napisz o tym do AI.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="modules-section"
          style={{
            marginTop: 26,
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {modules.map((mod) => {
            const active = activeModule === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => setActiveModule(mod.key)}
                style={{
                  textAlign: "left",
                  borderRadius: 26,
                  padding: 18,
                  cursor: "pointer",
                  background: active
                    ? "linear-gradient(135deg, rgba(255,255,255,0.90), rgba(209,240,255,0.96))"
                    : "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.38))",
                  border: active
                    ? "2px solid rgba(82,182,255,0.95)"
                    : "1px solid rgba(255,255,255,0.76)",
                  boxShadow: active
                    ? "0 18px 36px rgba(82,182,255,0.26), inset 0 1px 0 rgba(255,255,255,0.95)"
                    : "0 10px 24px rgba(123, 193, 255, 0.14), inset 0 1px 0 rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  transition: "all .2s ease",
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 16,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 26,
                    marginBottom: 14,
                    background: mod.color,
                    boxShadow: "0 12px 24px rgba(128, 202, 255, 0.24)",
                  }}
                >
                  {mod.emoji}
                </div>

                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 20,
                    color: "#1e5b8e",
                    marginBottom: 6,
                  }}
                >
                  {mod.title}
                </div>

                <div
                  style={{
                    color: "#4a7aa2",
                    lineHeight: 1.5,
                    fontSize: 14,
                  }}
                >
                  {mod.desc}
                </div>

                {active && (
                  <div
                    style={{
                      marginTop: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "rgba(82,182,255,0.12)",
                      color: "#2472ad",
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    <span>●</span>
                    <span>Aktywny moduł</span>
                  </div>
                )}
              </button>
            );
          })}
        </section>

        <section
          id="chat-section"
          style={{
            marginTop: 26,
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 22,
          }}
        >
          <div
            style={{
              borderRadius: 30,
              border: "1px solid rgba(255,255,255,0.82)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.52))",
              boxShadow:
                "0 24px 56px rgba(106,181,255,0.26), inset 0 1px 0 rgba(255,255,255,0.96)",
              backdropFilter: "blur(14px)",
              padding: 18,
              minHeight: 720,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#215f93",
                  }}
                >
                  Centrum rozmowy
                </div>
                <div
                  style={{
                    color: "#5180a7",
                    marginTop: 6,
                    fontSize: 14,
                  }}
                >
                  Jedno AI. Trzy ukryte silniki. Jedna klarowna odpowiedź.
                </div>
              </div>

              <div
                style={{
                  padding: "9px 14px",
                  borderRadius: 999,
                  background: loading
                    ? "linear-gradient(135deg, rgba(119,205,255,0.34), rgba(255,255,255,0.75))"
                    : "rgba(255,255,255,0.8)",
                  color: loading ? "#1167a3" : "#39739f",
                  border: "1px solid rgba(113,197,255,0.65)",
                  fontWeight: 800,
                  boxShadow: "0 8px 24px rgba(132, 205, 255, 0.16)",
                }}
              >
                {loading ? "AI pracuje..." : "Gotowe"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                paddingBottom: 8,
                marginBottom: 14,
              }}
            >
              <button
                onClick={() => setActiveModule("general")}
                style={heavenPill(activeModule === "general")}
              >
                ✨ Ogólne
              </button>

              {modules.map((mod) => (
                <button
                  key={mod.key}
                  onClick={() => setActiveModule(mod.key)}
                  style={heavenPill(activeModule === mod.key)}
                >
                  {mod.emoji} {mod.title}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {currentQuickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  style={{
                    border: "1px solid rgba(130, 207, 255, 0.62)",
                    background: "rgba(255,255,255,0.72)",
                    color: "#2f6996",
                    borderRadius: 999,
                    padding: "10px 14px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: 13,
                    boxShadow: "0 8px 20px rgba(138, 207, 255, 0.12)",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.84)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.76), rgba(235,248,255,0.52))",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.98)",
                padding: 16,
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      borderRadius: 22,
                      padding: "14px 16px",
                      lineHeight: 1.65,
                      whiteSpace: "pre-wrap",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #5bc0ff, #9fe2ff)"
                          : "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(226,245,255,0.92))",
                      border:
                        msg.role === "user"
                          ? "1px solid rgba(91,192,255,0.95)"
                          : "1px solid rgba(154, 221, 255, 0.78)",
                      color: msg.role === "user" ? "#083b65" : "#2c618d",
                      boxShadow:
                        msg.role === "user"
                          ? "0 12px 30px rgba(86, 193, 255, 0.22)"
                          : "0 10px 26px rgba(159, 214, 255, 0.14)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        opacity: 0.72,
                        marginBottom: 8,
                        fontWeight: 700,
                      }}
                    >
                      {msg.role === "user" ? "Ty" : "AI"}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onEnter}
                placeholder="Napisz, z czym mam Ci pomóc..."
                rows={4}
                style={{
                  width: "100%",
                  resize: "vertical",
                  borderRadius: 22,
                  border: "1px solid rgba(140, 214, 255, 0.68)",
                  background: "rgba(255,255,255,0.85)",
                  color: "#1f5d90",
                  padding: 15,
                  outline: "none",
                  fontSize: 15,
                  boxShadow:
                    "0 12px 28px rgba(146, 213, 255, 0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
                }}
              />

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    color: "#5182a8",
                    fontSize: 14,
                  }}
                >
                  Aktywny moduł:{" "}
                  <strong style={{ color: "#1d659b" }}>{activeModule}</strong>
                </div>

                <button
                  onClick={() => sendMessage()}
                  disabled={loading}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "13px 20px",
                    fontWeight: 900,
                    cursor: loading ? "not-allowed" : "pointer",
                    color: "#063b67",
                    background: loading
                      ? "linear-gradient(135deg, #cfeeff, #eef9ff)"
                      : "linear-gradient(135deg, #5dc4ff, #9fe2ff)",
                    boxShadow: "0 14px 32px rgba(84, 194, 255, 0.32)",
                  }}
                >
                  {loading ? "Myślę..." : "Wyślij"}
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 16,
              alignContent: "start",
            }}
          >
            <HeavenCard
              title="Jak to działa"
              icon="☀️"
              text="Pod maską działają trzy szybkie role: zrozumienie problemu, plan działania i kontrola jakości. Użytkownik widzi tylko jedno, spójne AI."
            />

            <HeavenCard
              title="Dla kogo"
              icon="🪽"
              text="Dla osób, które chcą zrozumieć relacje, uporządkować emocje, zrobić szybki quiz albo dostać następny krok, gdy brakuje jasności."
            />

            <div
              style={{
                borderRadius: 28,
                padding: 18,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.50))",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow:
                  "0 18px 44px rgba(113, 187, 255, 0.22), inset 0 1px 0 rgba(255,255,255,0.96)",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#216397",
                  marginBottom: 12,
                }}
              >
                Szybkie wejścia
              </div>

              <div style={{ display: "grid", gap: 10 }}>
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
                    style={{
                      textAlign: "left",
                      borderRadius: 16,
                      border: "1px solid rgba(148, 218, 255, 0.72)",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(220,243,255,0.88))",
                      color: "#2f6997",
                      padding: "13px 14px",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "0 10px 24px rgba(142, 210, 255, 0.12)",
                      fontWeight: 600,
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                borderRadius: 28,
                padding: 18,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.50))",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow:
                  "0 18px 44px rgba(113, 187, 255, 0.22), inset 0 1px 0 rgba(255,255,255,0.96)",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#216397",
                  marginBottom: 12,
                }}
              >
                Światło • Energia • Forma
              </div>
              <div
                style={{
                  color: "#42759f",
                  lineHeight: 1.65,
                }}
              >
                Produkt ma nie tylko odpowiadać, ale pomagać odzyskać
                kierunek, spokój i ruch. To nie jest zwykły chatbot — to
                przestrzeń do zrozumienia siebie i działania.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: string;
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        padding: 16,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(223,243,255,0.84))",
        border: "1px solid rgba(146, 219, 255, 0.62)",
        boxShadow: "0 10px 24px rgba(135, 206, 255, 0.14)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#3f7aa4",
          marginBottom: 8,
          fontWeight: 700,
        }}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#1e679e",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function HeavenCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div
      style={{
        borderRadius: 28,
        padding: 18,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.50))",
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow:
          "0 18px 44px rgba(113, 187, 255, 0.22), inset 0 1px 0 rgba(255,255,255,0.96)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#216397",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          color: "#42759f",
          lineHeight: 1.65,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function heavenPill(active: boolean): React.CSSProperties {
  return {
    border: active
      ? "2px solid rgba(74,178,255,0.98)"
      : "1px solid rgba(154, 222, 255, 0.76)",
    background: active
      ? "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(212,241,255,0.95))"
      : "rgba(255,255,255,0.72)",
    color: "#276b9c",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: 13,
    fontWeight: 800,
    boxShadow: active
      ? "0 10px 24px rgba(110, 200, 255, 0.22)"
      : "0 8px 18px rgba(142, 208, 255, 0.12)",
  };
}
