"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type AppState = {
  diamonds: number;
  light: number;
  energy: number;
  streak: number;
  profile: {
    displayName: string;
    title: string;
    aura: string;
    accent: string;
    avatar: string;
    badge: string;
    bio: string;
  };
  theme: {
    themeName: string;
    heroTitle: string;
    heroSubtitle: string;
    notice: string;
    accentFrom: string;
    accentTo: string;
    badgeText: string;
  };
};

const defaultAppState: AppState = {
  diamonds: 0,
  light: 0,
  energy: 100,
  streak: 0,
  profile: {
    displayName: "Luq",
    title: "Pilot Światła",
    aura: "Spokojna, skupiona, nastawiona na kierunek i rozwój",
    accent: "#63d9ff",
    avatar: "🪽",
    badge: "Pierwszy lot",
    bio: "Badam relacje, emocje i nowe ścieżki rozwoju z pomocą AI.",
  },
  theme: {
    themeName: "Heaven",
    heroTitle: "Jedno AI.\nWięcej światła,\nmniej chaosu.",
    heroSubtitle:
      "Portal AI z osobnymi podstronami, grami i systemem zmian na żywo.",
    notice:
      "Panel admina działa jako live preview i lokalny zapis w przeglądarce.",
    accentFrom: "#6be0ff",
    accentTo: "#a4f1ff",
    badgeText: "Heavenly AI Engine • LIVE",
  },
};

const AppContext = createContext<{
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  addReward: (type: "diamonds" | "light" | "energy", amount: number) => void;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultAppState);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("heaven-app-state");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("heaven-app-state", JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const addReward = (type: "diamonds" | "light" | "energy", amount: number) => {
    setState((prev) => ({
      ...prev,
      [type]: prev[type] + amount,
    }));
  };

  return (
    <AppContext.Provider value={{ state, updateState, addReward }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}