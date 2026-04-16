"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ChatStyle = "nebula" | "social" | "focus";
export type RewardSource =
  | "daily"
  | "wheel"
  | "game"
  | "profile"
  | "admin"
  | "quest";

export type RewardDelta = Partial<
  Record<"diamonds" | "light" | "energy" | "xp" | "streak", number>
>;

export type RewardLog = {
  id: string;
  title: string;
  detail: string;
  source: RewardSource;
  accent: string;
  at: string;
};

export type JournalEntry = {
  id: string;
  mood: string;
  note: string;
  focus: string;
  energy: number;
  createdAt: string;
};

export type AppState = {
  diamonds: number;
  light: number;
  energy: number;
  streak: number;
  xp: number;
  dailyClaimedOn: string | null;
  wheelSpins: number;
  questsCompleted: number;
  socialPulse: number;
  usage: {
    aiCredits: number;
    testsLeft: number;
    analysesLeft: number;
    premiumMinutes: number;
  };
  profile: {
    displayName: string;
    title: string;
    aura: string;
    accent: string;
    avatar: string;
    badge: string;
    bio: string;
    clan: string;
    statusLine: string;
    tags: string[];
  };
  theme: {
    themeName: string;
    heroTitle: string;
    heroSubtitle: string;
    notice: string;
    accentFrom: string;
    accentTo: string;
    badgeText: string;
    seasonLabel: string;
  };
  chatStyle: ChatStyle;
  journalEntries: JournalEntry[];
  rewardHistory: RewardLog[];
  gameStats: {
    snakeBest: number;
    clickerBest: number;
    memoryBest: number | null;
    chaosBest: number;
  };
};

type DerivedState = {
  level: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
  dailyReady: boolean;
  achievements: Array<{
    id: string;
    title: string;
    detail: string;
    progress: number;
    goal: number;
    unlocked: boolean;
  }>;
  missions: Array<{
    id: string;
    title: string;
    detail: string;
    progress: number;
    goal: number;
    reward: string;
  }>;
};

type RewardLogInput = {
  title: string;
  detail: string;
  source: RewardSource;
  accent?: string;
};

type GameKey = "snake" | "clicker" | "memory" | "chaos";
type RewardedAdType = "crystals" | "test" | "analysis" | "premium" | "chest";

type AppContextValue = {
  state: AppState;
  derived: DerivedState;
  updateState: (updates: Partial<AppState>) => void;
  updateProfile: (updates: Partial<AppState["profile"]>) => void;
  updateTheme: (updates: Partial<AppState["theme"]>) => void;
  setChatStyle: (style: ChatStyle) => void;
  addReward: (type: "diamonds" | "light" | "energy", amount: number) => void;
  grantRewards: (delta: RewardDelta, log?: RewardLogInput) => void;
  claimDailyReward: () => RewardLog | null;
  spinWheel: () => RewardLog;
  watchRewardedAd: (type: RewardedAdType) => RewardLog;
  recordGameScore: (game: GameKey, score: number) => void;
  markQuestComplete: (title: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  resetExperience: () => void;
};

const STORAGE_KEY = "ai-platform-state-v2";
const XP_PER_LEVEL = 120;

const rewardWheel = [
  {
    title: "Soft glow chest",
    detail: "+20 diamentow i zastrzyk energii do kolejnej sesji.",
    accent: "#66d7ff",
    delta: { diamonds: 20, energy: 12, xp: 18 },
  },
  {
    title: "Golden rhythm",
    detail: "+40 swiatla i bonusowy plynny streak.",
    accent: "#ffb66a",
    delta: { light: 40, streak: 1, xp: 16 },
  },
  {
    title: "Clarity drop",
    detail: "+12 diamentow i +28 swiatla za aktywnosc.",
    accent: "#7cf0c2",
    delta: { diamonds: 12, light: 28, xp: 20 },
  },
  {
    title: "Quiet momentum",
    detail: "+18 energii i +26 XP do szybszego levelowania.",
    accent: "#ff8f8a",
    delta: { energy: 18, xp: 26 },
  },
  {
    title: "Circle bonus",
    detail: "+8 diamentow, +18 swiatla i lekki boost streaka.",
    accent: "#7f9cff",
    delta: { diamonds: 8, light: 18, streak: 1, xp: 14 },
  },
];

const defaultAppState: AppState = {
  diamonds: 86,
  light: 164,
  energy: 84,
  streak: 3,
  xp: 210,
  dailyClaimedOn: null,
  wheelSpins: 2,
  questsCompleted: 4,
  socialPulse: 72,
  usage: {
    aiCredits: 4,
    testsLeft: 1,
    analysesLeft: 1,
    premiumMinutes: 0,
  },
  profile: {
    displayName: "Lukas",
    title: "Founding Member",
    aura: "Spokojna energia, wysoki smak produktowy i nacisk na codzienny, realny postep.",
    accent: "#66d7ff",
    avatar: "LX",
    badge: "Founders Pass",
    bio: "Buduje premium portal do emocji, relacji i codziennych rytualow, ktory chce sie otwierac kazdego dnia.",
    clan: "Luma Circle",
    statusLine: "Online now // shaping a softer routine",
    tags: ["clarity", "builder", "premium care"],
  },
  theme: {
    themeName: "Luma",
    heroTitle: "Spokoj,\nktory chce sie\notwierac codziennie.",
    heroSubtitle:
      "Portal laczy AI, journal, quizy, relacje i lekkie rewardy w jedna premium codzienna rutyne.",
    notice:
      "Produkt psychoedukacyjny premium: cieply, bezpieczny i zaprojektowany jak jedna elegancka aplikacja.",
    accentFrom: "#8dc5ff",
    accentTo: "#f3c283",
    badgeText: "Founding season // premium daily care",
    seasonLabel: "Daily calm",
  },
  chatStyle: "nebula",
  journalEntries: [
    {
      id: "entry-1",
      mood: "Spokoj",
      note: "Dzisiaj najwiecej daje mi jasny plan i brak przebodzcowania.",
      focus: "mikro-krok",
      energy: 72,
      createdAt: "Dzisiaj, 08:15",
    },
  ],
  rewardHistory: [
    {
      id: "boot-1",
      title: "Portal sync",
      detail: "Pierwsze uruchomienie sezonu odblokowalo paczke startowa.",
      source: "quest",
      accent: "#66d7ff",
      at: "just now",
    },
    {
      id: "boot-2",
      title: "Snake milestone",
      detail: "Nowy rekord odswiezyl pasek progresu i feed aktywnosci.",
      source: "game",
      accent: "#7cf0c2",
      at: "today",
    },
  ],
  gameStats: {
    snakeBest: 11,
    clickerBest: 96,
    memoryBest: 24,
    chaosBest: 18,
  },
};

const chatStyleOptions: ChatStyle[] = ["nebula", "social", "focus"];

const AppContext = createContext<AppContextValue | null>(null);

function createRewardLog(input: RewardLogInput): RewardLog {
  return {
    id: Math.random().toString(36).slice(2, 10),
    title: input.title,
    detail: input.detail,
    source: input.source,
    accent: input.accent ?? "#66d7ff",
    at: new Date().toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function todayKey() {
  return new Intl.DateTimeFormat("sv-SE").format(new Date());
}

function mergeState(candidate: unknown): AppState {
  if (!candidate || typeof candidate !== "object") {
    return defaultAppState;
  }

  const partial = candidate as Partial<AppState>;

  return {
    ...defaultAppState,
    ...partial,
    profile: {
      ...defaultAppState.profile,
      ...partial.profile,
      tags:
        Array.isArray(partial.profile?.tags) && partial.profile.tags.length > 0
          ? partial.profile.tags.slice(0, 4)
          : defaultAppState.profile.tags,
    },
    theme: {
      ...defaultAppState.theme,
      ...partial.theme,
    },
    usage: {
      ...defaultAppState.usage,
      ...partial.usage,
    },
    journalEntries: Array.isArray(partial.journalEntries)
      ? partial.journalEntries.slice(0, 14)
      : defaultAppState.journalEntries,
    rewardHistory: Array.isArray(partial.rewardHistory)
      ? partial.rewardHistory.slice(0, 8)
      : defaultAppState.rewardHistory,
    gameStats: {
      ...defaultAppState.gameStats,
      ...partial.gameStats,
    },
  };
}

function applyRewardDelta(state: AppState, delta: RewardDelta): AppState {
  return {
    ...state,
    diamonds: Math.max(0, state.diamonds + (delta.diamonds ?? 0)),
    light: Math.max(0, state.light + (delta.light ?? 0)),
    energy: clamp(state.energy + (delta.energy ?? 0), 0, 150),
    streak: Math.max(0, state.streak + (delta.streak ?? 0)),
    xp: Math.max(0, state.xp + (delta.xp ?? 0)),
  };
}

function buildDerivedState(state: AppState): DerivedState {
  const level = Math.floor(state.xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = state.xp % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL - xpIntoLevel;
  const dailyReady = state.dailyClaimedOn !== todayKey();

  const achievements = [
    {
      id: "ach-founders",
      title: "Founders Drive",
      detail: "Zdobadz 3 wpisy w feedzie rewardow.",
      progress: state.rewardHistory.length,
      goal: 3,
      unlocked: state.rewardHistory.length >= 3,
    },
    {
      id: "ach-streak",
      title: "Heat Streak",
      detail: "Utrzymaj 7-dniowy streak aktywnosci.",
      progress: state.streak,
      goal: 7,
      unlocked: state.streak >= 7,
    },
    {
      id: "ach-snake",
      title: "Snake Driver",
      detail: "Wbij wynik 15 punktow w Snake.",
      progress: state.gameStats.snakeBest,
      goal: 15,
      unlocked: state.gameStats.snakeBest >= 15,
    },
    {
      id: "ach-clicker",
      title: "Click Surge",
      detail: "Przekrocz 140 punktow w Clicker.",
      progress: state.gameStats.clickerBest,
      goal: 140,
      unlocked: state.gameStats.clickerBest >= 140,
    },
    {
      id: "ach-chaos",
      title: "Chaos Breaker",
      detail: "Wbij 24 punkty w grze Rozbij chaos.",
      progress: state.gameStats.chaosBest,
      goal: 24,
      unlocked: state.gameStats.chaosBest >= 24,
    },
  ];

  const memoryProgress =
    state.gameStats.memoryBest === null
      ? 0
      : Math.max(0, 40 - state.gameStats.memoryBest);

  const missions = [
    {
      id: "mission-daily",
      title: "Daily drop",
      detail: "Odbierz codzienna skrzynke i rusz streak.",
      progress: dailyReady ? 0 : 1,
      goal: 1,
      reward: "+18 diamonds",
    },
    {
      id: "mission-snake",
      title: "Snake sprint",
      detail: "Dociagnij najlepszy wynik do 12 punktow.",
      progress: Math.min(state.gameStats.snakeBest, 12),
      goal: 12,
      reward: "+40 XP",
    },
    {
      id: "mission-memory",
      title: "Memory clean run",
      detail: "Skoncz Memory w 20 ruchach albo mniej.",
      progress: Math.min(memoryProgress, 20),
      goal: 20,
      reward: "+1 streak",
    },
    {
      id: "mission-journal",
      title: "Quiet journal",
      detail: "Dodaj przynajmniej 3 wpisy, aby odblokowac dluzsza sciezke refleksji.",
      progress: Math.min(state.journalEntries.length, 3),
      goal: 3,
      reward: "+1 analiza",
    },
  ];

  return {
    level,
    xpIntoLevel,
    xpToNextLevel,
    dailyReady,
    achievements,
    missions,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultAppState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(mergeState(JSON.parse(saved)));
      }
    } catch {
      setState(defaultAppState);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage failures and keep local session running.
    }
  }, [state]);

  const derived = buildDerivedState(state);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) =>
      mergeState({
        ...prev,
        ...updates,
        profile: {
          ...prev.profile,
          ...updates.profile,
        },
        theme: {
          ...prev.theme,
          ...updates.theme,
        },
        usage: {
          ...prev.usage,
          ...updates.usage,
        },
        gameStats: {
          ...prev.gameStats,
          ...updates.gameStats,
        },
      })
    );
  };

  const updateProfile = (updates: Partial<AppState["profile"]>) => {
    setState((prev) =>
      mergeState({
        ...prev,
        profile: {
          ...prev.profile,
          ...updates,
          tags:
            Array.isArray(updates.tags) && updates.tags.length > 0
              ? updates.tags
              : prev.profile.tags,
        },
      })
    );
  };

  const updateTheme = (updates: Partial<AppState["theme"]>) => {
    setState((prev) =>
      mergeState({
        ...prev,
        theme: {
          ...prev.theme,
          ...updates,
        },
      })
    );
  };

  const setChatStyle = (style: ChatStyle) => {
    if (!chatStyleOptions.includes(style)) {
      return;
    }

    setState((prev) => ({
      ...prev,
      chatStyle: style,
    }));
  };

  const grantRewards = (delta: RewardDelta, log?: RewardLogInput) => {
    setState((prev) => {
      const nextState = applyRewardDelta(prev, delta);
      const nextHistory = log
        ? [createRewardLog(log), ...nextState.rewardHistory].slice(0, 8)
        : nextState.rewardHistory;

      return {
        ...nextState,
        rewardHistory: nextHistory,
      };
    });
  };

  const addReward = (type: "diamonds" | "light" | "energy", amount: number) => {
    grantRewards(
      { [type]: amount },
      {
        title: "Quick reward",
        detail: `Dodano +${amount} ${type}.`,
        source: "game",
      }
    );
  };

  const claimDailyReward = () => {
    if (!derived.dailyReady) {
      return null;
    }

    const log = createRewardLog({
      title: "Daily vault",
      detail: "Odebrano skrzynke dnia: diamenty, swiatlo i bonus streak.",
      source: "daily",
      accent: "#ffb66a",
    });

    setState((prev) => ({
      ...applyRewardDelta(prev, {
        diamonds: 18,
        light: 32,
        energy: 10,
        streak: 1,
        xp: 24,
      }),
      dailyClaimedOn: todayKey(),
      rewardHistory: [log, ...prev.rewardHistory].slice(0, 8),
    }));

    return log;
  };

  const spinWheel = () => {
    const reward = rewardWheel[Math.floor(Math.random() * rewardWheel.length)];
    const log = createRewardLog({
      title: reward.title,
      detail: reward.detail,
      source: "wheel",
      accent: reward.accent,
    });

    setState((prev) => ({
      ...applyRewardDelta(prev, reward.delta),
      wheelSpins: prev.wheelSpins + 1,
      rewardHistory: [log, ...prev.rewardHistory].slice(0, 8),
    }));

    return log;
  };

  const watchRewardedAd = (type: RewardedAdType) => {
    const rewardedByType = {
      crystals: {
        delta: { diamonds: 10, xp: 8 },
        usageDelta: {} as Partial<AppState["usage"]>,
        title: "Rewarded ad // crystals",
        detail: "Oglad reklamy odblokowal +10 krysztalow.",
        accent: "#66d7ff",
      },
      test: {
        delta: { xp: 6 },
        usageDelta: { testsLeft: 1 } as Partial<AppState["usage"]>,
        title: "Rewarded ad // extra test",
        detail: "Dodatkowy slot testu zostal dodany do dzisiejszej sesji.",
        accent: "#7cf0c2",
      },
      analysis: {
        delta: { xp: 8 },
        usageDelta: { analysesLeft: 1 } as Partial<AppState["usage"]>,
        title: "Rewarded ad // extra analysis",
        detail: "Odblokowano jedna dodatkowa analize AI.",
        accent: "#ffba6b",
      },
      premium: {
        delta: { xp: 10 },
        usageDelta: { premiumMinutes: 30 } as Partial<AppState["usage"]>,
        title: "Rewarded ad // premium preview",
        detail: "Aktywowano 30 minut funkcji premium preview.",
        accent: "#ff8d86",
      },
      chest: {
        delta: { diamonds: 6, light: 12, xp: 10 },
        usageDelta: {} as Partial<AppState["usage"]>,
        title: "Rewarded ad // chest unlock",
        detail: "Skrzynia dnia zostala otwarta po obejrzeniu reklamy.",
        accent: "#7f9cff",
      },
    } as const;

    const reward = rewardedByType[type];
    const log = createRewardLog({
      title: reward.title,
      detail: reward.detail,
      source: "daily",
      accent: reward.accent,
    });

    setState((prev) => ({
      ...applyRewardDelta(prev, reward.delta),
      usage: {
        ...prev.usage,
        aiCredits: prev.usage.aiCredits,
        testsLeft: prev.usage.testsLeft + (reward.usageDelta.testsLeft ?? 0),
        analysesLeft:
          prev.usage.analysesLeft + (reward.usageDelta.analysesLeft ?? 0),
        premiumMinutes:
          prev.usage.premiumMinutes + (reward.usageDelta.premiumMinutes ?? 0),
      },
      rewardHistory: [log, ...prev.rewardHistory].slice(0, 8),
    }));

    return log;
  };

  const recordGameScore = (game: GameKey, score: number) => {
    setState((prev) => {
      const nextGameStats = { ...prev.gameStats };

      if (game === "snake") {
        nextGameStats.snakeBest = Math.max(prev.gameStats.snakeBest, score);
      }

      if (game === "clicker") {
        nextGameStats.clickerBest = Math.max(prev.gameStats.clickerBest, score);
      }

      if (game === "memory") {
        nextGameStats.memoryBest =
          prev.gameStats.memoryBest === null
            ? score
            : Math.min(prev.gameStats.memoryBest, score);
      }

      if (game === "chaos") {
        nextGameStats.chaosBest = Math.max(prev.gameStats.chaosBest, score);
      }

      return {
        ...prev,
        gameStats: nextGameStats,
      };
    });
  };

  const markQuestComplete = (title: string) => {
    const log = createRewardLog({
      title,
      detail: "Quest zakonczony i zapisany w feedzie aktywnosci.",
      source: "quest",
      accent: "#7cf0c2",
    });

    setState((prev) => ({
      ...applyRewardDelta(prev, {
        diamonds: 8,
        light: 14,
        xp: 18,
      }),
      questsCompleted: prev.questsCompleted + 1,
      usage: {
        ...prev.usage,
        analysesLeft: prev.usage.analysesLeft + 1,
      },
      socialPulse: Math.min(100, prev.socialPulse + 4),
      rewardHistory: [log, ...prev.rewardHistory].slice(0, 8),
    }));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, "id" | "createdAt">) => {
    const log = createRewardLog({
      title: "Journal saved",
      detail: `Zapisano wpis z nastrojem ${entry.mood.toLowerCase()}.`,
      source: "profile",
      accent: "#66d7ff",
    });

    setState((prev) => ({
      ...applyRewardDelta(prev, {
        light: 6,
        xp: 10,
      }),
      journalEntries: [
        {
          ...entry,
          id: Math.random().toString(36).slice(2, 10),
          createdAt: new Date().toLocaleString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          }),
        },
        ...prev.journalEntries,
      ].slice(0, 14),
      rewardHistory: [log, ...prev.rewardHistory].slice(0, 8),
    }));
  };

  const resetExperience = () => {
    setState(defaultAppState);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        derived,
        updateState,
        updateProfile,
        updateTheme,
        setChatStyle,
        addReward,
        grantRewards,
        claimDailyReward,
        spinWheel,
        watchRewardedAd,
        recordGameScore,
        markQuestComplete,
        addJournalEntry,
        resetExperience,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
