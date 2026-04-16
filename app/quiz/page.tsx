"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import SafetyNotice from "@/components/SafetyNotice";
import { useApp } from "@/contexts/AppContext";

type QuizPack = {
  id: string;
  title: string;
  subtitle: string;
  questions: Array<{
    id: string;
    label: string;
    options: Array<{
      id: string;
      label: string;
      bucket: "A" | "B" | "C";
    }>;
  }>;
  results: Record<"A" | "B" | "C", string>;
};

const quizPacks: QuizPack[] = [
  {
    id: "emotion",
    title: "Test stanu emocjonalnego",
    subtitle: "Sprawdza, czy jestes blizej rownowagi, wahania czy przeciazenia.",
    questions: [
      {
        id: "q1",
        label: "Jak wyglada Twoje napiecie w ciele?",
        options: [
          { id: "a", label: "Raczej niskie", bucket: "A" },
          { id: "b", label: "Faluje", bucket: "B" },
          { id: "c", label: "Wysokie i stale", bucket: "C" },
        ],
      },
      {
        id: "q2",
        label: "Jak szybko wracasz do spokoju po trudnym momencie?",
        options: [
          { id: "a", label: "Dosyc szybko", bucket: "A" },
          { id: "b", label: "Potrzebuje chwili", bucket: "B" },
          { id: "c", label: "Bardzo mi trudno", bucket: "C" },
        ],
      },
      {
        id: "q3",
        label: "Na ile wiesz, czego potrzebujesz dzisiaj?",
        options: [
          { id: "a", label: "Dosyc jasno", bucket: "A" },
          { id: "b", label: "Mam tylko zarys", bucket: "B" },
          { id: "c", label: "Mam duzy chaos", bucket: "C" },
        ],
      },
    ],
    results: {
      A: "Jestes blisko rownowagi. Najlepiej utrzymac rytm i nie dokladac sobie nadmiernej presji.",
      B: "To stan mieszany. Najbardziej pomoze Ci prosty plan minimum i pare mikro-resetow.",
      C: "Widac sygnaly przeciazenia. Zaczynaj od oddechu, journalingu i najmniejszego mozliwego kroku.",
    },
  },
  {
    id: "relationship",
    title: "Test relacji",
    subtitle: "Pomaga wychwycic, czy relacja daje wiecej spokoju czy wiecej tarcia.",
    questions: [
      {
        id: "q1",
        label: "Po kontakcie z ta osoba czujesz glownie:",
        options: [
          { id: "a", label: "Ulge i bezpieczenstwo", bucket: "A" },
          { id: "b", label: "Mieszane uczucia", bucket: "B" },
          { id: "c", label: "Napiecie lub wine", bucket: "C" },
        ],
      },
      {
        id: "q2",
        label: "Gdy mowisz o granicach, druga strona:",
        options: [
          { id: "a", label: "Slucha", bucket: "A" },
          { id: "b", label: "Bywa roznie", bucket: "B" },
          { id: "c", label: "Reaguje presja", bucket: "C" },
        ],
      },
      {
        id: "q3",
        label: "Jak czesto musisz sie nadmiernie dopasowywac?",
        options: [
          { id: "a", label: "Rzadko", bucket: "A" },
          { id: "b", label: "Czasem", bucket: "B" },
          { id: "c", label: "Bardzo czesto", bucket: "C" },
        ],
      },
    ],
    results: {
      A: "Relacja wyglada stabilniej, ale nadal warto obserwowac konsekwencje i komunikacje.",
      B: "To uklad mieszany. Najwiecej zyskasz na jasniejszym nazywaniu potrzeb i wzorcow.",
      C: "Widac mocne sygnaly przeciazenia relacyjnego. Bezpiecznie bedzie wrocic do faktow i granic.",
    },
  },
  {
    id: "boundaries",
    title: "Test granic",
    subtitle: "Pokazuje, czy Twoje tak i nie sa dla Ciebie czytelne i spokojne.",
    questions: [
      {
        id: "q1",
        label: "Czy umiesz powiedziec nie bez silnego poczucia winy?",
        options: [
          { id: "a", label: "Tak", bucket: "A" },
          { id: "b", label: "Roznie", bucket: "B" },
          { id: "c", label: "Raczej nie", bucket: "C" },
        ],
      },
      {
        id: "q2",
        label: "Jak reagujesz, gdy ktos naciska?",
        options: [
          { id: "a", label: "Utrzymuje spokoj", bucket: "A" },
          { id: "b", label: "Gubie pewnosc", bucket: "B" },
          { id: "c", label: "Od razu odpuszczam", bucket: "C" },
        ],
      },
      {
        id: "q3",
        label: "Czy wiesz, gdzie konczy sie Twoja odpowiedzialnosc?",
        options: [
          { id: "a", label: "Coraz lepiej", bucket: "A" },
          { id: "b", label: "Niekiedy", bucket: "B" },
          { id: "c", label: "Mam z tym trudnosc", bucket: "C" },
        ],
      },
    ],
    results: {
      A: "Masz solidny fundament granic. Najwiecej da Ci konsekwencja i prostota komunikacji.",
      B: "Granice sa, ale czasem sie rozmywaja. Warto trenowac konkretne zdania i mikro-reakcje.",
      C: "Granice sa obecnie obciazajace. Zacznij od jednego prostego nie w bezpiecznej sytuacji.",
    },
  },
  {
    id: "overload",
    title: "Test przeciazenia",
    subtitle: "Sprawdza, czy bardziej potrzebujesz ciszy, priorytetow czy kompletnego resetu.",
    questions: [
      {
        id: "q1",
        label: "Jak wyglada Twoja koncentracja?",
        options: [
          { id: "a", label: "Dziala dobrze", bucket: "A" },
          { id: "b", label: "Skacze", bucket: "B" },
          { id: "c", label: "Rozsypuje sie", bucket: "C" },
        ],
      },
      {
        id: "q2",
        label: "Ile rzeczy czujesz, ze musisz ogarnac naraz?",
        options: [
          { id: "a", label: "Jedna lub dwie", bucket: "A" },
          { id: "b", label: "Kilka", bucket: "B" },
          { id: "c", label: "Zbyt wiele", bucket: "C" },
        ],
      },
      {
        id: "q3",
        label: "Twoj pierwszy odruch po trudnym dniu to:",
        options: [
          { id: "a", label: "Zamknac jedna rzecz", bucket: "A" },
          { id: "b", label: "Odwlec i odpoczac", bucket: "B" },
          { id: "c", label: "Zawiesic sie", bucket: "C" },
        ],
      },
    ],
    results: {
      A: "Masz jeszcze zasoby. Pomaga Ci prosty priorytet i konsekwentne odciecie szumu.",
      B: "Przeciazenie jest umiarkowane. Najlepszy bedzie reset i ograniczenie bodzcow.",
      C: "Organizm prosi o mniej. Zaczynaj od oddechu, journalingu i jednej malej decyzji.",
    },
  },
  {
    id: "self",
    title: "Test samooceny",
    subtitle: "Mierzy, czy glos wewnetrzny bardziej Cie wspiera czy stale ocenia.",
    questions: [
      {
        id: "q1",
        label: "Jak mowisz do siebie po bledzie?",
        options: [
          { id: "a", label: "Raczej lagodnie", bucket: "A" },
          { id: "b", label: "Roznie", bucket: "B" },
          { id: "c", label: "Dosyc ostro", bucket: "C" },
        ],
      },
      {
        id: "q2",
        label: "Czy umiesz zobaczyc swoje postepy?",
        options: [
          { id: "a", label: "Tak", bucket: "A" },
          { id: "b", label: "Czasami", bucket: "B" },
          { id: "c", label: "Rzadko", bucket: "C" },
        ],
      },
      {
        id: "q3",
        label: "Gdy inni potrzebuja wsparcia, jest Ci latwiej niz wtedy, gdy Ty go potrzebujesz?",
        options: [
          { id: "a", label: "Nie, umiem tez wspierac siebie", bucket: "A" },
          { id: "b", label: "Bywa", bucket: "B" },
          { id: "c", label: "Tak, zdecydowanie", bucket: "C" },
        ],
      },
    ],
    results: {
      A: "Masz juz wspierajacy fundament. Wartosc daje teraz systematyczny journal i rytm.",
      B: "Samoocena jest nierowna. Przyda sie wiecej dowodow postepu i mniej surowych interpretacji.",
      C: "Wewnetrzny ton bywa twardy. Dla Ciebie najcenniejsze beda male akty lagodnosci i faktow.",
    },
  },
];

export default function QuizPage() {
  const { state, updateState, grantRewards } = useApp();
  const [activePack, setActivePack] = useState<QuizPack | null>(null);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C">>({});
  const [result, setResult] = useState<string>("");
  const [completedPack, setCompletedPack] = useState<string | null>(null);

  function startPack(pack: QuizPack) {
    const hasAccess = state.usage.testsLeft > 0 || state.usage.premiumMinutes > 0;

    if (!hasAccess) {
      setResult(
        "Dzisiejszy darmowy slot testu jest juz wykorzystany. Mozesz wrocic jutro, aktywowac rewarded flow albo przejsc do premium."
      );
      setActivePack(null);
      return;
    }

    if (state.usage.premiumMinutes <= 0) {
      updateState({
        usage: {
          ...state.usage,
          testsLeft: Math.max(0, state.usage.testsLeft - 1),
        },
      });
    }

    setActivePack(pack);
    setAnswers({});
    setCompletedPack(null);
    setResult("");
  }

  function answerQuestion(questionId: string, bucket: "A" | "B" | "C") {
    if (!activePack) return;

    const nextAnswers = {
      ...answers,
      [questionId]: bucket,
    };

    setAnswers(nextAnswers);

    if (Object.keys(nextAnswers).length !== activePack.questions.length) {
      return;
    }

    const counts = { A: 0, B: 0, C: 0 };
    Object.values(nextAnswers).forEach((value) => {
      counts[value] += 1;
    });

    const topBucket =
      counts.C >= counts.B && counts.C >= counts.A
        ? "C"
        : counts.B >= counts.A
          ? "B"
          : "A";

    setCompletedPack(activePack.id);
    setResult(activePack.results[topBucket]);
    grantRewards(
      {
        diamonds: 2,
        light: 10,
        xp: 14,
      },
      {
        title: `Quiz complete // ${activePack.title}`,
        detail: "Wynik testu zostal zapisany i zasilił codzienny progres.",
        source: "quest",
        accent: "#67d8ff",
      }
    );
  }

  return (
    <AppShell
      title="Testy i quizy"
      subtitle="To nie sa testy kliniczne. To krotkie, premium narzedzia psychoedukacyjne, ktore pomagaja szybciej zobaczyc wzorzec i przejsc do konkretnego CTA."
      heroCode="QZ"
      rightPanel={
        <div className="right-list">
          <div className="kpi-card highlight">
            <div className="kpi-label">Dzisiaj zostalo</div>
            <div className="kpi-value">{state.usage.testsLeft} test</div>
            <div className="small-note">
              Rewarded flow moze odblokowac dodatkowy slot bez wychodzenia z produktu.
            </div>
          </div>
          <SafetyNotice compact />
        </div>
      }
    >
      <div className="cards-grid-3">
        {quizPacks.map((pack) => (
          <button
            key={pack.id}
            className={`reward-item ${activePack?.id === pack.id ? "active" : ""}`}
            onClick={() => startPack(pack)}
          >
            <span className="reward-title">{pack.title}</span>
            <span className="reward-copy">{pack.subtitle}</span>
          </button>
        ))}
      </div>

      {activePack ? (
        <div className="profile-panel">
          <div className="section-headline">{activePack.title}</div>
          <div className="sheet-list">
            {activePack.questions.map((question) => (
              <div key={question.id} className="sheet-item">
                <span className="sheet-step">{question.label}</span>
                <div className="cards-grid-3" style={{ marginTop: 12 }}>
                  {question.options.map((option) => (
                    <button
                      key={option.id}
                      className={`reward-item ${
                        answers[question.id] === option.bucket ? "active" : ""
                      }`}
                      onClick={() => answerQuestion(question.id, option.bucket)}
                    >
                      <span className="reward-title">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="result-box">
        <strong>Wynik i CTA</strong>
        <p>
          {result ||
            "Wybierz quiz, odpowiedz intuicyjnie i zobacz spokojna rekomendacje z następnym krokiem."}
        </p>
        <div className="button-row">
          <Link className="action-btn" href="/chat">
            Otworz AI Chat
          </Link>
          <Link className="action-btn secondary" href="/rewards">
            Odblokuj wiecej slotow
          </Link>
          {completedPack ? (
            <button className="action-btn secondary" onClick={() => setActivePack(null)}>
              Wroc do listy
            </button>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
