"use client";

import { useState } from "react";

type WorkflowStep = {
  name: string;
  status: "pending" | "running" | "done" | "failed" | "skipped";
  details: string;
};

type AgentDetails = {
  diagnosis?: string;
  planner?: string;
  expert?: string;
  critic?: string;
  repair?: string;
  supervisor?: string;
};

type Msg = {
  role: "user" | "assistant";
  content: string;
  agents?: AgentDetails;
  workflow?: WorkflowStep[];
};

const emptyAgents: AgentDetails = {
  diagnosis: "",
  planner: "",
  expert: "",
  critic: "",
  repair: "",
  supervisor: "",
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
  const [liveAgents, setLiveAgents] = useState<AgentDetails>(emptyAgents);
  const [liveWorkflow, setLiveWorkflow] = useState<WorkflowStep[]>([]);
  const [liveStatus, setLiveStatus] = useState("System czeka.");

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
    setLiveAgents(emptyAgents);
    setLiveWorkflow([]);
    setLiveStatus("System startuje...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.body) {
        throw new Error("Brak strumienia odpowiedzi.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let finalReply = "Brak odpowiedzi.";
      let finalAgents: AgentDetails = emptyAgents;
      let finalWorkflow: WorkflowStep[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          const data = JSON.parse(line);

          if (data.type === "init") {
            setLiveWorkflow(data.workflow || []);
            setLiveStatus("Agenci rozpoczęli pracę.");
          }

          if (data.type === "workflow") {
            setLiveWorkflow(data.workflow || []);
            const running = (data.workflow || []).find(
              (step: WorkflowStep) => step.status === "running"
            );
            setLiveStatus(
              running
                ? `${running.name}: ${running.details}`
                : "Workflow zaktualizowany."
            );
          }

          if (data.type === "agent") {
            setLiveWorkflow(data.workflow || []);
            setLiveAgents((prev) => ({
              ...prev,
              [data.agent]: data.content,
            }));

            const labels: Record<string, string> = {
              diagnosis: "Diagnoza gotowa.",
              planner: "Planowanie gotowe.",
              expert: "Wersja ekspercka gotowa.",
              critic: "Kontrola jakości zakończona.",
              repair: "Naprawa odpowiedzi zakończona.",
              supervisor: "Supervisor zakończył syntezę.",
            };

            setLiveStatus(labels[data.agent] || "Agent zakończył etap.");
          }

          if (data.type === "final") {
            finalReply = data.reply || "Brak odpowiedzi.";
            finalAgents = data.agents || emptyAgents;
            finalWorkflow = data.workflow || [];
            setLiveWorkflow(finalWorkflow);
            setLiveAgents(finalAgents);
            setLiveStatus("Finalna odpowiedź gotowa.");
          }

          if (data.type === "error") {
            throw new Error(data.details || "Błąd systemu.");
          }
        }
      }

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: finalReply,
          agents: finalAgents,
          workflow: finalWorkflow,
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: err?.message || "Błąd połączenia z AI.",
        },
      ]);
      setLiveStatus("Wystąpił błąd.");
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
        padding: "24px 14px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1150px",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "4px" }}>
            <h1 style={{ fontSize: "40px", margin: 0 }}>AI Platform 🚀</h1>
            <p style={{ color: "#b3b3b3", marginTop: "10px" }}>
              Wspólny stan agentów + widoczna praca systemu na żywo
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
                    maxWidth: msg.role === "user" ? "100%" : "92%",
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
              </div>
            ))}

            {loading && (
              <div
                style={{
                  background: "#161616",
                  border: "1px solid #2a2a2a",
                  borderRadius: "14px",
                  padding: "14px",
                  whiteSpace: "pre-wrap",
                  color: "#d6d6d6",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: "#f59e0b",
                  }}
                >
                  PRACA SYSTEMU NA ŻYWO
                </div>
                {liveStatus}
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Panel title="STATUS WORKFLOW" color="#f59e0b">
            {liveWorkflow.length === 0 ? (
              <div style={{ color: "#9e9e9e" }}>Brak aktywnego workflow.</div>
            ) : (
              <div style={{ display: "grid", gap: "8px" }}>
                {liveWorkflow.map((step, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#181818",
                      border: "1px solid #2d2d2d",
                      borderRadius: "12px",
                      padding: "10px 12px",
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                      {step.status === "done"
                        ? "✅"
                        : step.status === "running"
                        ? "🟡"
                        : step.status === "failed"
                        ? "❌"
                        : step.status === "skipped"
                        ? "➖"
                        : "⚪"}{" "}
                      {step.name}
                    </div>
                    <div style={{ color: "#cfcfcf", fontSize: "14px" }}>
                      {step.details}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="AGENT DIAGNOZY" color="#a78bfa">
            {liveAgents.diagnosis || "Czeka..."}
          </Panel>

          <Panel title="AGENT PLANOWANIA" color="#f59e0b">
            {liveAgents.planner || "Czeka..."}
          </Panel>

          <Panel title="AGENT EKSPERCKI" color="#60a5fa">
            {liveAgents.expert || "Czeka..."}
          </Panel>

          <Panel title="AGENT KONTROLI" color="#34d399">
            {liveAgents.critic || "Czeka..."}
          </Panel>

          <Panel title="AGENT NAPRAWCZY" color="#fb7185">
            {liveAgents.repair || "Czeka lub niepotrzebny."}
          </Panel>
        </div>
      </div>
    </main>
  );
}

function Panel({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#121212",
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
      {children}
    </div>
  );
}
