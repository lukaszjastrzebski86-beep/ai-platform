"use client";

import { useState } from "react";

type AgentDetails = {
  intent?: string;
  expert?: string;
  critic?: string;
};

type Msg = {
  role: "user" | "assistant";
  content: string;
  agents?: AgentDetails;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Cześć. Jestem Twoim AI. Napisz, z czym mam Ci pomóc.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    const newMessages: Msg[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(newMessages);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.reply || "Brak odpowiedzi.",
          agents: data.agents || {},
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Błąd połączenia z AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        padding: "30px 15px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "980px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h1 style={{ fontSize: "42px", margin: 0 }}>AI Platform 🚀</h1>
          <p style={{ color: "#b3b3b3", marginTop: "10px" }}>
            Multi-agent AI: odpowiedź, analiza intencji i kontrola jakości
          </p>
        </div>

        <div
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: "18px",
            padding: "18px",
            minHeight: "420px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 0 20px rgba(0,0,0,0.25)",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "stretch",
                maxWidth: msg.role === "user" ? "80%" : "100%",
              }}
            >
              <div
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "#4f46e5" : "#1c1c1c",
                  color: "white",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  maxWidth: msg.role === "user" ? "100%" : "85%",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "12px",
                    opacity: 0.8,
                  }}
                >
                  {msg.role === "user" ? "Ty" : "AI"}
                </strong>
                {msg.content}
              </div>

              {msg.role === "assistant" &&
                msg.agents &&
                (msg.agents.intent || msg.agents.expert || msg.agents.critic) && (
                  <div
                    style={{
                      marginTop: "12px",
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "10px",
                    }}
                  >
                    {msg.agents.intent && (
                      <div
                        style={{
                          background: "#141414",
                          border: "1px solid #2a2a2a",
                          borderRadius: "14px",
                          padding: "14px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.4px",
                            color: "#a78bfa",
                            marginBottom: "8px",
                          }}
                        >
                          AGENT INTENCJI
                        </div>
                        {msg.agents.intent}
                      </div>
                    )}

                    {msg.agents.expert && (
                      <div
                        style={{
                          background: "#141414",
                          border: "1px solid #2a2a2a",
                          borderRadius: "14px",
                          padding: "14px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.4px",
                            color: "#60a5fa",
                            marginBottom: "8px",
                          }}
                        >
                          AGENT EKSPERCKI
                        </div>
                        {msg.agents.expert}
                      </div>
                    )}

                    {msg.agents.critic && (
                      <div
                        style={{
                          background: "#141414",
                          border: "1px solid #2a2a2a",
                          borderRadius: "14px",
                          padding: "14px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.4px",
                            color: "#34d399",
                            marginBottom: "8px",
                          }}
                        >
                          AGENT KONTROLI
                        </div>
                        {msg.agents.critic}
                      </div>
                    )}
                  </div>
                )}
            </div>
          ))}

          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                background: "#1c1c1c",
                padding: "12px 14px",
                borderRadius: "14px",
                color: "#bdbdbd",
              }}
            >
              Agenci analizują...
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Napisz wiadomość..."
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid #2a2a2a",
              background: "#161616",
              color: "white",
              outline: "none",
            }}
          />

          <button
            onClick={send}
            disabled={loading}
            style={{
              padding: "16px 22px",
              borderRadius: "14px",
              border: "none",
              background: loading ? "#3a3a3a" : "#6366f1",
              color: "white",
              cursor: loading ? "default" : "pointer",
              fontWeight: 700,
            }}
          >
            Wyślij
          </button>
        </div>
      </div>
    </main>
  );
}
