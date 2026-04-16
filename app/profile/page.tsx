"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

type ProfileConfig = {
  displayName: string;
  title: string;
  aura: string;
  accent: string;
  avatar: string;
  badge: string;
  bio: string;
};

const defaultProfileConfig: ProfileConfig = {
  displayName: "Luq",
  title: "Pilot Światła",
  aura: "Spokojna, skupiona, nastawiona na kierunek i rozwój",
  accent: "#63d9ff",
  avatar: "🪽",
  badge: "Pierwszy lot",
  bio: "Badam relacje, emocje i nowe ścieżki rozwoju z pomocą AI.",
};

export default function ProfilePage() {
  const [profileConfig, setProfileConfig] =
    useState<ProfileConfig>(defaultProfileConfig);
  const [profilePrompt, setProfilePrompt] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [pendingProfileConfig, setPendingProfileConfig] =
    useState<Partial<ProfileConfig> | null>(null);
  const [profileExplanation, setProfileExplanation] = useState("");
  const [previewProfileChanges, setPreviewProfileChanges] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("heaven-profile-config");
      if (savedProfile) setProfileConfig(JSON.parse(savedProfile));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "heaven-profile-config",
        JSON.stringify(profileConfig)
      );
    } catch {}
  }, [profileConfig]);

  const effectiveProfileConfig =
    previewProfileChanges && pendingProfileConfig
      ? { ...profileConfig, ...pendingProfileConfig }
      : profileConfig;

  async function runProfilePreview() {
    if (!profilePrompt.trim()) return;
    setProfileLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "profile",
          prompt: profilePrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        alert(data?.details || data?.error || "Błąd edytora profilu.");
        return;
      }

      setPendingProfileConfig(data.preview || null);
      setProfileExplanation(data.explanation || "");
      setPreviewProfileChanges(true);
    } catch (error: any) {
      alert(error?.message || "Błąd połączenia.");
    } finally {
      setProfileLoading(false);
    }
  }

  function acceptProfilePreview() {
    if (!pendingProfileConfig) return;
    setProfileConfig((prev) => ({
      ...prev,
      ...pendingProfileConfig,
    }));
    setPendingProfileConfig(null);
    setProfileExplanation("");
    setPreviewProfileChanges(false);
  }

  function discardProfilePreview() {
    setPendingProfileConfig(null);
    setProfileExplanation("");
    setPreviewProfileChanges(false);
  }

  return (
    <AppShell
      title="Profil"
      subtitle="Użytkownik może zmieniać wygląd i styl profilu komendą jak w kreatorze live."
    >
      <div className="cards-grid-2">
        <div className="portal-card glass" style={{ minHeight: 260 }}>
          <div
            className="result-box"
            style={{
              borderColor: effectiveProfileConfig.accent,
              boxShadow: `0 20px 50px ${effectiveProfileConfig.accent}30`,
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 22,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 34,
                  background: "rgba(255,255,255,0.92)",
                  boxShadow: `0 0 28px ${effectiveProfileConfig.accent}`,
                  flexShrink: 0,
                }}
              >
                {effectiveProfileConfig.avatar}
              </div>

              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#1d6497" }}>
                  {effectiveProfileConfig.displayName}
                </div>
                <div style={{ fontWeight: 800, color: "#4580aa", marginTop: 2 }}>
                  {effectiveProfileConfig.title}
                </div>
                <div style={{ marginTop: 10, color: "#4f7da4", lineHeight: 1.6 }}>
                  {effectiveProfileConfig.aura}
                </div>
                <div style={{ marginTop: 12 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      borderRadius: 999,
                      padding: "8px 12px",
                      fontSize: 13,
                      fontWeight: 900,
                      color: "#2f6d9c",
                      border: "1px solid rgba(255,255,255,0.92)",
                      background: `${effectiveProfileConfig.accent}22`,
                    }}
                  >
                    {effectiveProfileConfig.badge}
                  </span>
                </div>
                <p style={{ marginTop: 12, color: "#4f7da4", lineHeight: 1.6 }}>
                  {effectiveProfileConfig.bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="portal-card glass">
          <div className="portal-card-title">Edytor profilu komendą</div>
          <div className="portal-card-text">
            Np. „Ustaw mój profil na złoto-niebieski, nadaj mi tytuł Kapitan
            Światła, dodaj orła jako avatar i bardziej bojowy klimat.”
          </div>

          <div className="stack" style={{ marginTop: 14 }}>
            <textarea
              className="textarea"
              rows={5}
              value={profilePrompt}
              onChange={(e) => setProfilePrompt(e.target.value)}
              placeholder="Napisz jak ma wyglądać Twój profil..."
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="action-btn"
                onClick={runProfilePreview}
                disabled={profileLoading}
              >
                {profileLoading ? "AI projektuje..." : "Stwórz podgląd"}
              </button>

              {pendingProfileConfig && (
                <>
                  <button className="action-btn secondary" onClick={acceptProfilePreview}>
                    Akceptuję
                  </button>
                  <button className="action-btn secondary" onClick={discardProfilePreview}>
                    Odrzuć
                  </button>
                </>
              )}
            </div>

            {profileExplanation && <div className="result-box">{profileExplanation}</div>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}