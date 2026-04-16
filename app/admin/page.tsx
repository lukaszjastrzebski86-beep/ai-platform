"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp, type AppState } from "@/contexts/AppContext";

type ThemePreview = Partial<AppState["theme"]>;

const adminPrompts = [
  "Nadaj stronie bardziej cieply, premium i spokojny klimat z akcentem zlotego swiatla.",
  "Przesun brand bardziej w strone nowoczesnej psychoedukacji premium z czytelnym CTA.",
  "Ustaw bardziej social, lifestylowy ton i mocniejszy onboarding vibe.",
];

export default function AdminPage() {
  const { state, updateTheme } = useApp();
  const [adminPrompt, setAdminPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingTheme, setPendingTheme] = useState<ThemePreview | null>(null);
  const [adminExplanation, setAdminExplanation] = useState("");

  const previewTheme = pendingTheme ? { ...state.theme, ...pendingTheme } : state.theme;

  async function runAdminPreview(promptText?: string) {
    const prompt = (promptText ?? adminPrompt).trim();

    if (!prompt) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "admin",
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setAdminExplanation(
          data?.details || data?.error || "Nie udalo sie przygotowac podgladu motywu."
        );
        return;
      }

      setPendingTheme(data.preview || null);
      setAdminExplanation(data.explanation || "");
      setAdminPrompt(prompt);
    } catch (error) {
      setAdminExplanation(
        error instanceof Error
          ? error.message
          : "Blad polaczenia przy tworzeniu podgladu."
      );
    } finally {
      setLoading(false);
    }
  }

  function acceptTheme() {
    if (!pendingTheme) {
      return;
    }

    updateTheme(pendingTheme);
    setPendingTheme(null);
    setAdminExplanation("Motyw zostal zapisany i jest juz aktywny globalnie.");
  }

  return (
    <AppShell
      title="Admin Studio"
      subtitle="Panel sterowania nie ma byc technicznym kombajnem. To miejsce, w ktorym edytujesz brand, hero copy i ton calego produktu w sposob zrozumialy dla contentu i growthu."
      heroCode="AD"
      rightPanel={<SafetyNotice compact />}
    >
      <div className="daily-grid">
        <div className="editor-shell">
          <div className="section-headline">Prompt do edycji strony</div>
          <textarea
            className="textarea"
            rows={6}
            value={adminPrompt}
            onChange={(event) => setAdminPrompt(event.target.value)}
            placeholder="Opisz nowy klimat strony, hero, badge, notice albo akcenty."
          />
          <div className="button-row">
            <button
              className="action-btn"
              onClick={() => runAdminPreview()}
              disabled={loading}
            >
              {loading ? "Tworzenie..." : "Stworz podglad"}
            </button>
            {pendingTheme ? (
              <button className="action-btn secondary" onClick={acceptTheme}>
                Zapisz motyw
              </button>
            ) : null}
          </div>
          {adminExplanation ? <div className="result-box">{adminExplanation}</div> : null}
        </div>

        <div className="admin-preview">
          <div className="section-headline">Live preview</div>
          <div
            className="result-box"
            style={{
              background: `linear-gradient(135deg, ${previewTheme.accentFrom}22, ${previewTheme.accentTo}22)`,
            }}
          >
            <strong>{previewTheme.themeName}</strong>
            <p style={{ whiteSpace: "pre-wrap" }}>{previewTheme.heroTitle}</p>
            <p>{previewTheme.heroSubtitle}</p>
            <div className="small-note">{previewTheme.notice}</div>
            <div className="status-pill" style={{ marginTop: 14 }}>
              {previewTheme.badgeText}
            </div>
          </div>
        </div>
      </div>

      <div className="cards-grid-3">
        {adminPrompts.map((prompt) => (
          <button
            key={prompt}
            className="reward-item"
            onClick={() => runAdminPreview(prompt)}
          >
            <span className="reward-title">Growth preset</span>
            <span className="reward-copy">{prompt}</span>
          </button>
        ))}
      </div>

      <div className="cards-grid-4">
        <div className="profile-panel">
          <div className="section-headline">Home</div>
          <div className="reward-copy">Hero, live loop i feed aktywnosci.</div>
        </div>
        <div className="profile-panel">
          <div className="section-headline">Chat</div>
          <div className="reward-copy">AI premium-light, limity free i style rozmowy.</div>
        </div>
        <div className="profile-panel">
          <div className="section-headline">Rewards</div>
          <div className="reward-copy">Daily chest, rewarded flow, economy i powroty.</div>
        </div>
        <div className="profile-panel">
          <div className="section-headline">Legal</div>
          <div className="reward-copy">Bezpieczny wording, psychoedukacja i czytelne granice obietnicy.</div>
        </div>
      </div>
    </AppShell>
  );
}
