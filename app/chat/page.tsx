"use client";

import { useEffect, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp, type ChatStyle } from "@/contexts/AppContext";

type ModuleType =
  | "general"
  | "relationships"
  | "emotions"
  | "quiz"
  | "task";

type ResponseMode = "short" | "deep";

type QuizPayload = {
  title: string;
  intro: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
  }>;
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

type ChatMessage =
  | {
      id: string;
      kind: "text";
      role: "user" | "assistant";
      content: string;
    }
  | {
      id: string;
      kind: "quiz";
      role: "assistant";
      quiz: QuizPayload;
    }
  | {
      id: string;
      kind: "task";
      role: "assistant";
      task: TaskPayload;
    };

const moduleMeta: Record<
  ModuleType,
  { title: string; copy: string; prompts: string[] }
> = {
  general: {
    title: "Reset i kierunek",
    copy: "Krotka analiza chaosu, decyzji i kolejnych krokow.",
    prompts: [
      "Mam za duzo w glowie i potrzebuje prostego planu minimum.",
      "Pomoz mi uporzadkowac, co jest teraz najwazniejsze.",
      "Chce odzyskac spokoj bez dlugiego elaboratu.",
    ],
  },
  relationships: {
    title: "Relacje",
    copy: "Sygnaly, granice, wzorce komunikacji i poziom spokoju w relacji.",
    prompts: [
      "Nie wiem, czy ta relacja daje mi spokoj czy tylko napiecie.",
      "Pomoz mi nazwac czerwone flagi bez przesady i bez bagatelizowania.",
      "Jak powiedziec o granicy spokojnie i jasno?",
    ],
  },
  emotions: {
    title: "Emocje",
    copy: "Nazywanie stanu, obnizanie tarcia i prosty ruch dalej.",
    prompts: [
      "Mam napiecie i chce zrozumiec, czego teraz potrzebuje.",
      "Pomoz mi nazwac to, co dzieje sie dzisiaj we mnie.",
      "Jak zejsc z chaosu do jednego prostego kroku?",
    ],
  },
  quiz: {
    title: "Quiz premium-light",
    copy: "Szybki test generowany przez AI pod aktualny temat.",
    prompts: [
      "Daj mi quiz o moim przeciazeniu.",
      "Stworz krotki test relacji.",
      "Zrob mi test granic.",
    ],
  },
  task: {
    title: "Task dnia",
    copy: "Mikro-zadanie, ktore da sie zrobic jeszcze dzisiaj.",
    prompts: [
      "Daj mi plan minimum na dzisiaj.",
      "Jaki jest moj jeden sensowny krok?",
      "Stworz mi zadanie pod odzyskanie spokoju.",
    ],
  },
};

const styleOptions: Array<{
  id: ChatStyle;
  title: string;
  copy: string;
}> = [
  {
    id: "nebula",
    title: "Nebula",
    copy: "Miekki, spokojny styl premium z glowem.",
  },
  {
    id: "social",
    title: "Social",
    copy: "Lzejszy, cieplejszy rytm bardziej lifestyle niz studio.",
  },
  {
    id: "focus",
    title: "Focus",
    copy: "Mniej ozdobnikow, wiecej koncentracji i konkretu.",
  },
];

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { state, setChatStyle, updateState } = useApp();
  const [activeModule, setActiveModule] = useState<ModuleType>("general");
  const [responseMode, setResponseMode] = useState<ResponseMode>("short");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      kind: "text",
      role: "assistant",
      content:
        "Jestem Twoim przewodnikiem premium-light. Pomagam uporzadkowac emocje, relacje i kolejny krok bez medycznych obietnic i bez lania wody.",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(customText?: string) {
    const content = (customText ?? input).trim();

    if (!content || loading) {
      return;
    }

    const usingPremium = state.usage.premiumMinutes > 0;
    const needsTestSlot = activeModule === "quiz";
    const needsAnalysisSlot =
      activeModule === "general" ||
      activeModule === "relationships" ||
      activeModule === "emotions";
    const needsTaskSlot = activeModule === "task";

    if (!usingPremium && needsTestSlot && state.usage.testsLeft <= 0) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          kind: "text",
          role: "assistant",
          content:
            "Dzisiejszy darmowy slot testu jest juz wykorzystany. Mozesz wrocic jutro, odpalic rewarded boost w rewardach albo wejsc do premium preview.",
        },
      ]);
      return;
    }

    if (!usingPremium && needsAnalysisSlot && state.usage.analysesLeft <= 0) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          kind: "text",
          role: "assistant",
          content:
            "Dzisiejszy darmowy limit analiz jest juz wykorzystany. W rewardach czeka dodatkowy slot albo 30 minut premium preview.",
        },
      ]);
      return;
    }

    if (!usingPremium && needsTaskSlot && state.usage.aiCredits <= 0) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          kind: "text",
          role: "assistant",
          content:
            "Twoj dzienny limit mikro-zadan zostal juz wykorzystany. Mozesz odblokowac kolejny ruch przez rewarded flow albo premium.",
        },
      ]);
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: createId(),
        kind: "text",
        role: "user",
        content,
      },
    ]);
    setInput("");
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
          responseMode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setMessages((current) => [
          ...current,
          {
            id: createId(),
            kind: "text",
            role: "assistant",
            content:
              data?.details ||
              data?.error ||
              "Nie udalo sie teraz wygenerowac odpowiedzi. Sprobuj jeszcze raz za chwile.",
          },
        ]);
        return;
      }

      if (!usingPremium) {
        updateState({
          usage: {
            ...state.usage,
            testsLeft: state.usage.testsLeft - (needsTestSlot ? 1 : 0),
            analysesLeft:
              state.usage.analysesLeft - (needsAnalysisSlot ? 1 : 0),
            aiCredits: state.usage.aiCredits - (needsTaskSlot ? 1 : 0),
          },
        });
      }

      if (data.type === "quiz" && data.quiz) {
        setMessages((current) => [
          ...current,
          {
            id: createId(),
            kind: "quiz",
            role: "assistant",
            quiz: data.quiz,
          },
        ]);
        return;
      }

      if (data.type === "task" && data.task) {
        setMessages((current) => [
          ...current,
          {
            id: createId(),
            kind: "task",
            role: "assistant",
            task: data.task,
          },
        ]);
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          kind: "text",
          role: "assistant",
          content: data.reply || "Brak odpowiedzi.",
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown connection error";
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          kind: "text",
          role: "assistant",
          content: `Blad polaczenia: ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const activeMeta = moduleMeta[activeModule];

  return (
    <AppShell
      title="AI Chat"
      subtitle="Jedno spojne AI dla emocji, relacji i spokojnego planu minimum. Odpowiedzi sa krotsze lub dluzsze, ale zawsze utrzymane w premium, bezpiecznym tonie."
      heroCode="AI"
      rightPanel={
        <div className="right-list">
          <div className="list-panel">
            <div className="section-headline">Styl rozmowy</div>
            <div className="stack">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  className={`style-chip ${
                    state.chatStyle === style.id ? "active" : ""
                  }`}
                  onClick={() => setChatStyle(style.id)}
                >
                  <span className="style-title">{style.title}</span>
                  <span className="style-copy">{style.copy}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="kpi-card highlight">
            <div className="kpi-label">Free limits</div>
            <div className="small-note">Analizy: {state.usage.analysesLeft}</div>
            <div className="small-note">Testy: {state.usage.testsLeft}</div>
            <div className="small-note">Taski: {state.usage.aiCredits}</div>
            <div className="small-note">
              Premium preview: {state.usage.premiumMinutes} min
            </div>
          </div>

          <div className="list-panel">
            <div className="section-headline">Depth</div>
            <div className="stack">
              <button
                className={`style-chip ${responseMode === "short" ? "active" : ""}`}
                onClick={() => setResponseMode("short")}
              >
                <span className="style-title">Smart short</span>
                <span className="style-copy">
                  Szybki, uporzadkowany insight i natychmiastowy krok.
                </span>
              </button>
              <button
                className={`style-chip ${responseMode === "deep" ? "active" : ""}`}
                onClick={() => setResponseMode("deep")}
              >
                <span className="style-title">Deep mode</span>
                <span className="style-copy">
                  Bardziej premium, bardziej refleksyjnie i z szerszym kontekstem.
                </span>
              </button>
            </div>
          </div>

          <SafetyNotice compact />
        </div>
      }
    >
      <div className="module-tabs">
        {(Object.keys(moduleMeta) as ModuleType[]).map((moduleId) => (
          <button
            key={moduleId}
            className={`module-tab ${
              activeModule === moduleId ? "active" : ""
            }`}
            onClick={() => setActiveModule(moduleId)}
          >
            <span className="module-title">{moduleMeta[moduleId].title}</span>
            <span className="module-copy">{moduleMeta[moduleId].copy}</span>
          </button>
        ))}
      </div>

      <div className="quick-prompt-row">
        {activeMeta.prompts.map((prompt) => (
          <button
            key={prompt}
            className="quick-prompt-chip"
            onClick={() => sendMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className={`chat-window chat-style-${state.chatStyle}`}>
        <div className="chat-header">
          <div className="kpi-card">
            <div className="kpi-label">Biezacy modul</div>
            <div className="kpi-value">{activeMeta.title}</div>
          </div>
          <div className="status-pill">
            {responseMode === "short" ? "Smart short" : "Deep mode"}
          </div>
          <button
            className="action-btn"
            onClick={() => sendMessage(activeMeta.prompts[0])}
            disabled={loading}
          >
            {loading ? "AI pracuje..." : "Szybki prompt"}
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => {
            if (message.kind === "text") {
              return (
                <div
                  key={message.id}
                  className={`chat-bubble ${
                    message.role === "user"
                      ? "chat-bubble-user"
                      : "chat-bubble-assistant"
                  }`}
                >
                  <div className="chat-label">
                    {message.role === "user" ? "Ty" : "AI"}
                  </div>
                  <div>{message.content}</div>
                </div>
              );
            }

            if (message.kind === "quiz") {
              return (
                <div key={message.id} className="sheet-card chat-card">
                  <div className="sheet-title">{message.quiz.title}</div>
                  <div className="sheet-copy">{message.quiz.intro}</div>
                  <div className="sheet-list">
                    {message.quiz.questions.map((question) => (
                      <div key={question.id} className="sheet-item">
                        <span className="sheet-step">{question.question}</span>
                        <div className="small-note">
                          {question.options.join(" | ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className="sheet-card chat-card">
                <div className="sheet-title">{message.task.title}</div>
                <div className="sheet-copy">{message.task.goal}</div>
                <div className="sheet-list">
                  {message.task.steps.map((step) => (
                    <div key={step} className="sheet-item">
                      <span className="sheet-step">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="small-note">
                  Minimum version: {message.task.minimumVersion} // reward:{" "}
                  {message.task.reward}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="composer">
          <textarea
            className="textarea"
            rows={4}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Napisz, z czym chcesz dzisiaj odzyskac jasnosc..."
          />
          <div className="chat-composer-footer">
            <div className="small-note">
              Modul: {activeMeta.title} // tryb: {responseMode} // ton: psychoedukacja premium
            </div>
            <button
              className="action-btn"
              onClick={() => sendMessage()}
              disabled={loading}
            >
              {loading ? "AI pracuje..." : "Wyslij"}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
