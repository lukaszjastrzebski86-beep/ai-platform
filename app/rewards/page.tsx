"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

const adRewards = [
  {
    id: "crystals" as const,
    title: "Watch ad -> +10 krysztalow",
    text: "Szybki top-up waluty dla darmowego uzytkownika.",
  },
  {
    id: "test" as const,
    title: "Watch ad -> +1 test",
    text: "Dodatkowy slot quizu na ten dzien.",
  },
  {
    id: "analysis" as const,
    title: "Watch ad -> +1 analiza",
    text: "Jeszcze jedna rozmowa premium-light bez wychodzenia z portalu.",
  },
  {
    id: "premium" as const,
    title: "Watch ad -> 30 min premium",
    text: "Preview funkcji premium dla uzytkownika free.",
  },
  {
    id: "chest" as const,
    title: "Watch ad -> otworz skrzynie",
    text: "Miekkie, ale bardzo skuteczne retention loop.",
  },
];

export default function RewardsPage() {
  const { state, derived, claimDailyReward, spinWheel, watchRewardedAd } = useApp();
  const [lastReward, setLastReward] = useState<string>("");

  function handleDaily() {
    const reward = claimDailyReward();
    setLastReward(
      reward
        ? reward.detail
        : "Dzisiejsza skrzynia jest juz odebrana. Wroc jutro albo aktywuj rewarded flow."
    );
  }

  function handleWheel() {
    const reward = spinWheel();
    setLastReward(reward.detail);
  }

  function handleAdReward(id: (typeof adRewards)[number]["id"]) {
    const reward = watchRewardedAd(id);
    setLastReward(reward.detail);
  }

  return (
    <AppShell
      title="Rewardy i economy"
      subtitle="Nagrody sa tu systemem motywacji, a nie hałasem. Kazda akcja daje drobny return: krysztaly, swiatlo, streak, sloty i premium preview."
      heroCode="RW"
      rightPanel={
        <div className="right-list">
          <div className="list-panel">
            <div className="section-headline">Achievementy</div>
            {derived.achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-row">
                <strong>{achievement.title}</strong>
                <div className="small-note">{achievement.detail}</div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(achievement.progress / achievement.goal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <SafetyNotice compact />
        </div>
      }
    >
      <div className="stats-grid">
        <div className="kpi-card highlight">
          <div className="kpi-label">Krysztaly</div>
          <div className="kpi-value">{state.diamonds}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Dobra energia</div>
          <div className="kpi-value">{state.light}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Streak</div>
          <div className="kpi-value">{state.streak}</div>
        </div>
      </div>

      <div className="daily-grid">
        <div className="profile-panel">
          <div className="section-headline">Daily reward</div>
          <p className="reward-copy">
            Skrzynia dnia wzmacnia codzienny rytm powrotu i daje poczucie lekkiego progresu od pierwszych sekund.
          </p>
          <div className="button-row">
            <button className="action-btn" onClick={handleDaily}>
              Odbierz skrzynie
            </button>
            <button className="action-btn secondary" onClick={handleWheel}>
              Zakrec kolem
            </button>
          </div>
        </div>

        <div className="profile-panel">
          <div className="section-headline">Free vs premium usage</div>
          <div className="sheet-list">
            <div className="sheet-item">AI credits: {state.usage.aiCredits}</div>
            <div className="sheet-item">Testy dzisiaj: {state.usage.testsLeft}</div>
            <div className="sheet-item">Analizy: {state.usage.analysesLeft}</div>
            <div className="sheet-item">Premium preview: {state.usage.premiumMinutes} min</div>
          </div>
        </div>
      </div>

      <div className="reward-wheel">
        {adRewards.map((reward) => (
          <button
            key={reward.id}
            className="reward-item"
            onClick={() => handleAdReward(reward.id)}
          >
            <span className="reward-title">{reward.title}</span>
            <span className="reward-copy">{reward.text}</span>
          </button>
        ))}
      </div>

      <div className="result-box">
        <strong>Ostatni reward</strong>
        <p>{lastReward || "Tu pojawi sie ostatnio odblokowany bonus, chest albo ad reward."}</p>
      </div>

      <div className="list-panel">
        <div className="section-headline">Historia rewardow</div>
        <div className="sheet-list">
          {state.rewardHistory.map((entry) => (
            <div key={entry.id} className="sheet-item">
              <span className="sheet-step">{entry.title}</span>
              <div className="reward-copy">{entry.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
