"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp, type AppState } from "@/contexts/AppContext";

type ProfilePreview = Partial<AppState["profile"]>;

const profilePrompts = [
  "Ustaw spokojny, premium profil z lekkim zlotym akcentem i tytulem Guardian of Calm.",
  "Nadaj mi bardziej social vibe, jasny status i odrobine energii premium.",
  "Zmien profil na bardziej wyciszony, profesjonalny i bezpieczny.",
];

export default function ProfilePage() {
  const { state, derived, updateProfile } = useApp();
  const [profilePrompt, setProfilePrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingProfileConfig, setPendingProfileConfig] =
    useState<ProfilePreview | null>(null);
  const [profileExplanation, setProfileExplanation] = useState("");

  const preview = pendingProfileConfig
    ? { ...state.profile, ...pendingProfileConfig }
    : state.profile;

  async function runProfilePreview(promptText?: string) {
    const prompt = (promptText ?? profilePrompt).trim();

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
          action: "profile",
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setProfileExplanation(
          data?.details || data?.error || "Nie udalo sie wygenerowac podgladu profilu."
        );
        return;
      }

      setPendingProfileConfig(data.preview || null);
      setProfileExplanation(data.explanation || "");
      setProfilePrompt(prompt);
    } catch (error) {
      setProfileExplanation(
        error instanceof Error
          ? error.message
          : "Blad polaczenia przy tworzeniu podgladu."
      );
    } finally {
      setLoading(false);
    }
  }

  function acceptProfilePreview() {
    if (!pendingProfileConfig) {
      return;
    }

    updateProfile(pendingProfileConfig);
    setPendingProfileConfig(null);
    setProfileExplanation("Zmiany zostaly zapisane globalnie w profilu.");
  }

  return (
    <AppShell
      title="Profil"
      subtitle="Profil ma czuc sie jak osobisty hub premium: styl, badge, historia postepu i status, do ktorego chce sie wracac codziennie."
      heroCode="PF"
      rightPanel={
        <div className="right-list">
          <div className="kpi-card highlight">
            <div className="kpi-label">Aktywnosc</div>
            <div className="kpi-value">{state.journalEntries.length}</div>
            <div className="small-note">
              Wpisy journal + odblokowane achievementy tworza wrazenie rosnacego profilu.
            </div>
          </div>
          <div className="list-panel">
            <div className="section-headline">Achievementy</div>
            {derived.achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-row">
                <strong>{achievement.title}</strong>
                <div className="small-note">{achievement.detail}</div>
              </div>
            ))}
          </div>
          <SafetyNotice compact />
        </div>
      }
    >
      <div className="profile-banner">
        <div className="profile-hero">
          <div
            className="profile-avatar"
            style={{ borderColor: `${preview.accent}88`, boxShadow: `0 0 32px ${preview.accent}44` }}
          >
            {preview.avatar}
          </div>
          <div className="profile-copy">
            <h2>{preview.displayName}</h2>
            <p>{preview.title}</p>
            <div className="status-pill">{preview.statusLine}</div>
          </div>
        </div>

        <div className="tag-row" style={{ marginTop: 18 }}>
          <span className="tag-pill">{preview.badge}</span>
          <span className="tag-pill">{preview.clan}</span>
          {preview.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        <p style={{ marginTop: 18 }} className="reward-copy">
          {preview.bio}
        </p>
        <p className="reward-copy">{preview.aura}</p>
      </div>

      <div className="daily-grid">
        <div className="editor-shell">
          <div className="section-headline">Edytor profilu komenda</div>
          <textarea
            className="textarea"
            rows={5}
            value={profilePrompt}
            onChange={(event) => setProfilePrompt(event.target.value)}
            placeholder="Napisz, jak ma wygladac Twoj profil: klimat, tytul, badge, avatar, ton..."
          />
          <div className="button-row">
            <button
              className="action-btn"
              onClick={() => runProfilePreview()}
              disabled={loading}
            >
              {loading ? "Tworzenie..." : "Stworz podglad"}
            </button>
            {pendingProfileConfig ? (
              <button className="action-btn secondary" onClick={acceptProfilePreview}>
                Zapisz
              </button>
            ) : null}
          </div>
          {profileExplanation ? <div className="result-box">{profileExplanation}</div> : null}
        </div>

        <div className="editor-shell">
          <div className="section-headline">Gotowe kierunki</div>
          <div className="sheet-list">
            {profilePrompts.map((prompt) => (
              <button
                key={prompt}
                className="reward-item"
                onClick={() => runProfilePreview(prompt)}
              >
                <span className="reward-title">Preview</span>
                <span className="reward-copy">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
