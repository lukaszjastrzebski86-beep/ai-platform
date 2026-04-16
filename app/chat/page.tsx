"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";

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

function id() {
  return Math.random().toString(36).slice(2, 10);
}

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

export default function ChatPage() {
  const [activeModule, setActiveModule] = useState<ModuleType>("general");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: id(),
      kind: "text",
      role: "assistant",
      content:
        "Witaj. Jestem Twoim AI. Pomagam odzyskać jasność, spokój i kierunek w relacjach, emocjach i decyzjach.",
    },
  ]);

  const currentQuickPrompts = useMemo(
    () => quickPrompts[activeModule] || quickPrompts.general,
    [activeModule]
  );

  async function sendMessage(customText?: string) {
    const content = (customText ?? input).trim();
    if (!content || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: id(), kind: "text", role: "user", content },
    ]);
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
            content: `Błąd: ${data?.error || "Nieznany błąd"}`,
          },
        ]);
        return;
      }

      if (data.type === "quiz" && data.quiz) {
        setMessages((prev) => [
          ...prev,
          { id: id(), kind: "quiz", role: "assistant", quiz: data.quiz },
        ]);
        return;
      }

      if (data.type === "task" && data.task) {
        setMessages((prev) => [
          ...prev,
          { id: id(), kind: "task", role: "assistant", task: data.task },
        ]);
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

  return (
    <AppShell
      title="Chat AI"
      subtitle="Główne centrum rozmowy. Tu user ma jedno spójne AI i szybki dostęp do trybów."
      rightPanel={
        <div className="right-list">
          <div className="result-box">
            Przełącz moduły i sprawdzaj inne zachowanie AI bez opuszczania pokoju rozmowy.
          </div>
        </div>
      }
    >
      <div className="stack">
        <div className="cards-grid-4">
          {(["general", "relationships", "emotions", "quiz", "task"] as ModuleType[]).map(
            (mod) => (
              <button
                key={mod}
                className="nav-item"
                style={{
                  outline:
                    activeModule === mod
                      ? "2px solid rgba(99,217,255,0.65)"
                      : "none",
                }}
                onClick={() => setActiveModule(mod)}
              >
                {mod}
              </button>
            )
          )}
        </div>

        <div className="cards-grid-3">
          {currentQuickPrompts.map((prompt) => (
            <button
              key={prompt}
              className="nav-item"
              onClick={() => sendMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="glass" style={{ borderRadius: 26, padding: 16 }}>
          <div
            style={{
              display: "grid",
              gap: 14,
              minHeight: 420,
            }}
          >
            {messages.map((msg) => {
              if (msg.kind === "text") {
                return (
                  <div
                    key={msg.id}
                    style={{
                      justifySelf: msg.role === "user" ? "end" : "start",
                      maxWidth: "86%",
                      padding: "14px 16px",
                      borderRadius: 22,
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #77daff, #b4efff)"
                          : "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(232,247,255,0.92))",
                      border: "1px solid rgba(255,255,255,0.92)",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.65,
                    }}
                  >
                    <div className="kpi-label">
                      {msg.role === "user" ? "Ty" : "AI"}
                    </div>
                    {msg.content}
                  </div>
                );
              }

              if (msg.kind === "quiz") {
                return (
                  <div key={msg.id} className="result-box">
                    <strong>{msg.quiz.title}</strong>
                    <div style={{ marginTop: 8 }}>{msg.quiz.intro}</div>
                  </div>
                );
              }

              if (msg.kind === "task") {
                return (
                  <div key={msg.id} className="result-box">
                    <strong>{msg.task.title}</strong>
                    <div style={{ marginTop: 8 }}>{msg.task.goal}</div>
                  </div>
                );
              }

              return null;
            })}
          </div>

          <div className="stack" style={{ marginTop: 16 }}>
            <textarea
              className="textarea"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Napisz, z czym mam Ci pomóc..."
            />
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div className="small-note">Aktywny moduł: {activeModule}</div>
              <button className="action-btn" onClick={() => sendMessage()} disabled={loading}>
                {loading ? "AI pracuje..." : "Wyślij"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}