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
    desc: "Sygnały, konflikty, granice, komunikacja",
    emoji: "🤝",
  },
  {
    key: "emotions",
    title: "Emocje",
    desc: "Chaos, napięcie, nazwanie stanu, regulacja",
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
    desc: "Mikro-akcja, plan minimum, kolejny krok",
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
        "Cześć. Jestem Twoim AI. Pomagam ogarniać relacje, emocje, decyzje i kierunek działania. Wybierz moduł albo napisz od razu, z czym mam Ci pomóc.",
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
        background:
          "radial-gradient(circle at top, rgba(67,56,202,0.22), transparent 26%), radial-gradient(circle at right top, rgba(14,165,233,0.16), transparent 22%), #090d18",
        color: "#f8fafc",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "28px 20px 44px",
        }}
      >
        <section
          style={{
            padding: "36px 0 18px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 13,
              marginBottom: 18,
            }}
          >
            <span>●</span>
            <span>Triad AI Engine</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 6vw, 62px)",
              lineHeight: 1.02,
              margin: 0,
              fontWeight: 800,
              maxWidth: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Jedno AI.
            <br />
            Więcej jasności, mniej chaosu.
          </h1>

          <p
            style={{
              marginTop: 18,
              maxWidth: 780,
              fontSize: 18,
              lineHeight: 1.6,
              color: "rgba(248,250,252,0.78)",
            }}
          >
            Platforma do relacji, emocji, decyzji, quizów i zadań. Użytkownik
            widzi jedno spójne AI, a pod maską działa szybka trójca analizy,
            strategii i kontroli jakości.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
            marginTop: 26,
          }}
        >
          {[
            {
              title: "Światło",
              desc: "Rozumienie problemu, emocji i prawdziwego rdzenia sytuacji.",
            },
            {
              title: "Energia",
              desc: "Ruch do przodu, plan minimum, zadania i konkretne kroki.",
            },
            {
              title: "Forma",
              desc: "Struktura, porządek, decyzja i sens zamiast chaosu.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.04)",
                padding: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  color: "rgba(248,250,252,0.72)",
                  lineHeight: 1.55,
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 22,
          }}
        >
          <div
            style={{
              borderRadius: 26,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(10,14,24,0.78)",
              backdropFilter: "blur(10px)",
              padding: 18,
              minHeight: 680,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 18px 50px rgba(0,0,0,0.26)",
            }}
          >
            <div
              style={{
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>
                  Centrum rozmowy
                </div>
                <div
                  style={{
                    marginTop: 6,
                    color: "rgba(248,250,252,0.65)",
                    fontSize: 14,
                  }}
                >
                  Jedno AI dla użytkownika. Trójca działa w tle.
                </div>
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.22)",
                  color: "#86efac",
                  fontSize: 13,
                  fontWeight: 700,
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
                style={pillStyle(activeModule === "general")}
              >
                ✨ Ogólne
              </button>

              {modules.map((mod) => (
                <button
                  key={mod.key}
                  onClick={() => setActiveModule(mod.key)}
                  style={pillStyle(activeModule === mod.key)}
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
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#e2e8f0",
                    borderRadius: 999,
                    padding: "10px 14px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: 13,
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
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                padding: 14,
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
                      borderRadius: 18,
                      padding: "13px 14px",
                      lineHeight: 1.55,
                      whiteSpace: "pre-wrap",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #2563eb, #4f46e5)"
                          : "rgba(255,255,255,0.05)",
                      border:
                        msg.role === "user"
                          ? "1px solid rgba(96,165,250,0.45)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        opacity: 0.7,
                        marginBottom: 7,
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
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#f8fafc",
                  padding: 14,
                  outline: "none",
                  fontSize: 15,
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
                    color: "rgba(248,250,252,0.56)",
                    fontSize: 13,
                  }}
                >
                  Aktywny moduł:{" "}
                  <strong style={{ color: "#cbd5e1" }}>{activeModule}</strong>
                </div>

                <button
                  onClick={() => sendMessage()}
                  disabled={loading}
                  style={{
                    border: "none",
                    borderRadius: 14,
                    padding: "12px 18px",
                    fontWeight: 800,
                    cursor: loading ? "not-allowed" : "pointer",
                    color: "#08111f",
                    background: loading
                      ? "#64748b"
                      : "linear-gradient(135deg, #22c55e, #14b8a6)",
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
            <InfoCard
              title="Moduły"
              text="Relacje, emocje, quiz i zadanie dnia. Każdy moduł ustawia kontekst odpowiedzi bez rozwalania jednego spójnego AI."
            />
            <InfoCard
              title="Jak to działa"
              text="W tle równolegle pracują trzy role: rozumienie problemu, plan działania i kontrola jakości. Użytkownik widzi tylko finalny głos."
            />
            <InfoCard
              title="Po co to jest"
              text="Nie tylko odpowiadać, ale porządkować chaos, dawać kierunek i zamieniać rozmowę w użyteczne działanie."
            />

            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.04)",
                padding: 18,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                Szybkie starty
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
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      color: "#f8fafc",
                      padding: "12px 14px",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "rgba(248,250,252,0.72)",
          lineHeight: 1.6,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    border: active
      ? "1px solid rgba(96,165,250,0.45)"
      : "1px solid rgba(255,255,255,0.10)",
    background: active
      ? "rgba(59,130,246,0.16)"
      : "rgba(255,255,255,0.03)",
    color: "#f8fafc",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: 13,
    fontWeight: 700,
  };
}
