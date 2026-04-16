"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

type SiteConfig = {
  themeName: string;
  heroTitle: string;
  heroSubtitle: string;
  notice: string;
  accentFrom: string;
  accentTo: string;
  badgeText: string;
};

const defaultSiteConfig: SiteConfig = {
  themeName: "Heaven",
  heroTitle: "Jedno AI.\nWięcej światła,\nmniej chaosu.",
  heroSubtitle:
    "Portal AI z osobnymi podstronami, grami i systemem zmian na żywo.",
  notice:
    "Panel admina działa jako live preview i lokalny zapis w przeglądarce.",
  accentFrom: "#6be0ff",
  accentTo: "#a4f1ff",
  badgeText: "Heavenly AI Engine • LIVE",
};

export default function AdminPage() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [adminPrompt, setAdminPrompt] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [pendingSiteConfig, setPendingSiteConfig] =
    useState<Partial<SiteConfig> | null>(null);
  const [adminExplanation, setAdminExplanation] = useState("");
  const [previewAdminChanges, setPreviewAdminChanges] = useState(false);

  useEffect(() => {
    try {
      const savedSite = localStorage.getItem("heaven-site-config");
      if (savedSite) setSiteConfig(JSON.parse(savedSite));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("heaven-site-config", JSON.stringify(siteConfig));
    } catch {}
  }, [siteConfig]);

  const effectiveSiteConfig =
    previewAdminChanges && pendingSiteConfig
      ? { ...siteConfig, ...pendingSiteConfig }
      : siteConfig;

  async function runAdminPreview() {
    if (!adminPrompt.trim()) return;
    setAdminLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "admin",
          prompt: adminPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        alert(data?.details || data?.error || "Błąd panelu admina.");
        return;
      }

      setPendingSiteConfig(data.preview || null);
      setAdminExplanation(data.explanation || "");
      setPreviewAdminChanges(true);
    } catch (error: any) {
      alert(error?.message || "Błąd połączenia.");
    } finally {
      setAdminLoading(false);
    }
  }

  function acceptAdminPreview() {
    if (!pendingSiteConfig) return;
    setSiteConfig((prev) => ({
      ...prev,
      ...pendingSiteConfig,
    }));
    setPendingSiteConfig(null);
    setAdminExplanation("");
    setPreviewAdminChanges(false);
  }

  function discardAdminPreview() {
    setPendingSiteConfig(null);
    setAdminExplanation("");
    setPreviewAdminChanges(false);
  }

  return (
    <AppShell
      title="Admin AI Studio"
      subtitle="Tu wpisujesz polecenia zmian strony. AI robi podgląd, a Ty akceptujesz albo odrzucasz."
    >
      <div className="cards-grid-2">
        <div className="portal-card glass">
          <div className="portal-card-title">Polecenie dla AI</div>
          <div className="portal-card-text">
            Np. „Zmień tytuł na Świątynia Światła, daj bardziej złoty klimat,
            badge Aurora Release i krótszy komunikat górny.”
          </div>

          <div className="stack" style={{ marginTop: 14 }}>
            <textarea
              className="textarea"
              rows={6}
              value={adminPrompt}
              onChange={(e) => setAdminPrompt(e.target.value)}
              placeholder="Napisz polecenie zmiany strony..."
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="action-btn"
                onClick={runAdminPreview}
                disabled={adminLoading}
              >
                {adminLoading ? "AI tworzy podgląd..." : "Stwórz podgląd"}
              </button>

              {pendingSiteConfig && (
                <>
                  <button className="action-btn secondary" onClick={acceptAdminPreview}>
                    Akceptuję zmiany
                  </button>
                  <button className="action-btn secondary" onClick={discardAdminPreview}>
                    Odrzuć
                  </button>
                </>
              )}
            </div>

            {adminExplanation && <div className="result-box">{adminExplanation}</div>}
          </div>
        </div>

        <div className="portal-card glass">
          <div className="portal-card-title">Podgląd aktualnego motywu</div>

          <div
            className="result-box"
            style={{
              background: `linear-gradient(135deg, ${effectiveSiteConfig.accentFrom}22, ${effectiveSiteConfig.accentTo}22)`,
            }}
          >
            <strong>Theme:</strong> {effectiveSiteConfig.themeName}
            <div style={{ marginTop: 10 }}>
              <strong>Badge:</strong> {effectiveSiteConfig.badgeText}
            </div>
            <div style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
              <strong>Hero:</strong> {effectiveSiteConfig.heroTitle}
            </div>
            <div style={{ marginTop: 10 }}>
              <strong>Subtitle:</strong> {effectiveSiteConfig.heroSubtitle}
            </div>
            <div style={{ marginTop: 10 }}>
              <strong>Notice:</strong> {effectiveSiteConfig.notice}
            </div>
            <div style={{ marginTop: 10 }}>
              <strong>Accent from:</strong> {effectiveSiteConfig.accentFrom}
            </div>
            <div style={{ marginTop: 6 }}>
              <strong>Accent to:</strong> {effectiveSiteConfig.accentTo}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}