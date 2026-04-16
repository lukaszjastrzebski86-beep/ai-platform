"use client";

import { useState } from "react";

type WorkflowStep = {
  name: string;
  status: "done" | "failed" | "skipped";
  details: string;
};

type AgentDetails = {
  diagnosis?: string;
  planner?: string;
  expert?: string;
  critic?: string;
  supervisor?: string;
};

type Msg = {
  role: "user" | "assistant";
  content: string;
  agents?: AgentDetails;
  workflow?: WorkflowStep[];
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Cześć. Jestem Twoim systemem AI. Napisz, z czym mam Ci pomóc.",
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
          workflow: data.workflow || [],
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
          maxWidth: "1050px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h1 style={{ fontSize: "42px", margin: 0 }}>AI Platform 🚀</h1>
          <p style={{ color: "#b3b3b3", marginTop: "10px" }}>
            Multi-agent AI z supervisorem i checklistą etapów
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
            gap: "16px",
            boxShadow: "0 0 20px rgba(0,0,0,0.25)",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "stretch",
                maxWidth: msg.role === "user" ? "82%" : "100%",
              }}
            >
              <div
                style={{
                  background: msg.role === "user" ? "#4f46e5" : "#1c1c1c",
                  color: "white",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  maxWidth: msg.role === "user" ? "100%" : "88%",
                  marginLeft: msg.role === "user" ? "auto" : "0",
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

              {msg.role === "assistant" && msg.workflow && msg.workflow.length > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    background: "#121212",
                    border: "1px solid #2a2a2a",
                    borderRadius: "14px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.4px",
                      color: "#f59e0b",
                      marginBottom: "10px",
                    }}
                  >
                    CHECKLISTA SUPERVISORA
                  </div>

                  <div style={{ display: "grid", gap: "8px" }}>
                    {msg.workflow.map((step, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#181818",
                          border: "1px solid #2d2d2d",
                          borderRadius: "12px",
                          padding: "10px 12px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                          {step.status === "done"
                            ? "✅"
                            : step.status === "failed"
                            ? "❌"
                            : "➖"}{" "}
                          {step.name}
                        </div>
                        <div style={{ color: "#cfcfcf", fontSize: "14px" }}>
                          {step.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {msg.role === "assistant" &&
                msg.agents &&
                (msg.agents.diagnosis ||
                  msg.agents.planner ||
                  msg.agents.expert ||
                  msg.agents.critic ||
                  msg.agents.supervisor) && (
                  <div
                    style={{
                      marginTop: "12px",
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "10px",
                    }}
                  >
                    {msg.agents.diagnosis && (
                      <AgentBox
                        title="AGENT DIAGNOZY"
                        color="#a78bfa"
                        content={msg.agents.diagnosis}
                      />
                    )}

                    {msg.agents.planner && (
                      <AgentBox
                        title="AGENT PLANOWANIA"
                        color="#f59e0b"
                        content={msg.agents.planner}
                      />
                    )}

                    {msg.agents.expert && (
                      <AgentBox
                        title="AGENT EKSPERCKI"
                        color="#60a5fa"
                        content={msg.agents.expert}
                      />
                    )}

                    {msg.agents.critic && (
                      <AgentBox
                        title="AGENT KONTROLI"
                        color="#34d399"
                        content={msg.agents.critic}
                      />
                    )}

                    {msg.agents.supervisor && (
                      <AgentBox
                        title="SUPERVISOR"
                        color="#f472b6"
                        content={msg.agents.supervisor}
                      />
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
              Agenci analizują i supervisor sprawdza etapy...
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

function AgentBox({
  title,
  color,
  content,
}: {
  title: string;
  color: string;
  content: string;
}) {
  return (
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
          color,
          marginBottom: "8px",
        }}
      >
        {title}
      </div>
      {content}
    </div>
  );
}
