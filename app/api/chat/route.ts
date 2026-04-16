import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

function normalizeModule(value: unknown): ModuleType {
  if (
    value === "general" ||
    value === "relationships" ||
    value === "emotions" ||
    value === "quiz" ||
    value === "task"
  ) {
    return value;
  }
  return "general";
}

function inferTopic(text: string) {
  const t = text.toLowerCase();

  if (
    t.includes("relac") ||
    t.includes("ona") ||
    t.includes("on") ||
    t.includes("partner") ||
    t.includes("dziewczyn") ||
    t.includes("chłopak") ||
    t.includes("manipul")
  ) {
    return "relacje";
  }

  if (
    t.includes("emoc") ||
    t.includes("chaos") ||
    t.includes("stres") ||
    t.includes("lęk") ||
    t.includes("napię") ||
    t.includes("smutek")
  ) {
    return "emocje";
  }

  if (
    t.includes("praca") ||
    t.includes("firma") ||
    t.includes("biznes") ||
    t.includes("projekt")
  ) {
    return "praca";
  }

  if (
    t.includes("zdrow") ||
    t.includes("sen") ||
    t.includes("energia") ||
    t.includes("regener")
  ) {
    return "zdrowie";
  }

  return "ogólny";
}

function buildQuiz(topic: string): QuizPayload {
  if (topic === "relacje") {
    return {
      title: "Quiz: stan Twojej relacji",
      intro:
        "Odpowiedz szybko i intuicyjnie. Na końcu zobaczysz prosty odczyt sytuacji.",
      questions: [
        {
          id: "q1",
          question: "Jak czujesz się najczęściej po kontakcie z tą osobą?",
          options: [
            "A) Spokojniej i pewniej",
            "B) Różnie, zależy od sytuacji",
            "C) Ciężej, bardziej napięty lub winny",
          ],
        },
        {
          id: "q2",
          question: "Czy możesz otwarcie mówić o swoich granicach?",
          options: [
            "A) Tak, zazwyczaj są szanowane",
            "B) Czasem tak, czasem nie",
            "C) Raczej nie, bo kończy się napięciem lub presją",
          ],
        },
        {
          id: "q3",
          question: "Jak ta osoba reaguje, gdy się z nią nie zgadzasz?",
          options: [
            "A) Rozmawia i słucha",
            "B) Bywa różnie",
            "C) Atakuje, odwraca kota ogonem albo wzbudza winę",
          ],
        },
        {
          id: "q4",
          question: "Czy po tej relacji masz więcej energii czy mniej?",
          options: [
            "A) Więcej energii i poczucia bezpieczeństwa",
            "B) Neutralnie albo nierówno",
            "C) Wyraźnie mniej energii",
          ],
        },
        {
          id: "q5",
          question: "Na ile czujesz, że możesz być sobą?",
          options: [
            "A) W dużym stopniu",
            "B) Tylko częściowo",
            "C) Często się pilnuję albo tłumię",
          ],
        },
      ],
      resultGuide: {
        mostlyA:
          "Przewaga A: relacja wygląda raczej stabilnie, ale nadal warto obserwować konkretne sygnały i komunikację.",
        mostlyB:
          "Przewaga B: relacja jest mieszana. Potrzeba doprecyzowania granic, komunikacji i powtarzających się wzorców.",
        mostlyC:
          "Przewaga C: są mocne sygnały przeciążenia lub niezdrowej dynamiki. Warto przyjrzeć się granicom, bezpieczeństwu i powtarzającym się zachowaniom.",
      },
    };
  }

  if (topic === "emocje") {
    return {
      title: "Quiz: Twój stan emocjonalny",
      intro:
        "Krótka diagnostyka tego, czy jesteś bardziej w przeciążeniu, rozchwianiu czy w równowadze.",
      questions: [
        {
          id: "q1",
          question: "Jak często ostatnio czujesz napięcie w ciele lub głowie?",
          options: ["A) Rzadko", "B) Czasem", "C) Bardzo często"],
        },
        {
          id: "q2",
          question: "Jak wygląda Twoja energia w ostatnich dniach?",
          options: ["A) Dość stabilna", "B) Falująca", "C) Niska lub poszarpana"],
        },
        {
          id: "q3",
          question: "Jak oceniasz swoją koncentrację?",
          options: ["A) Jest okej", "B) Bywa różnie", "C) Rozsypuje się często"],
        },
        {
          id: "q4",
          question: "Jak szybko wracasz do równowagi po trudniejszym momencie?",
          options: [
            "A) Dość szybko",
            "B) Potrzebuję trochę czasu",
            "C) Bardzo trudno mi wrócić",
          ],
        },
        {
          id: "q5",
          question: "Czy umiesz nazwać, co dokładnie czujesz?",
          options: ["A) Zazwyczaj tak", "B) Czasami", "C) Raczej mam chaos"],
        },
      ],
      resultGuide: {
        mostlyA:
          "Przewaga A: jesteś raczej blisko równowagi. Warto tylko pilnować regeneracji i rytmu.",
        mostlyB:
          "Przewaga B: jesteś w stanie mieszanym. Potrzebujesz porządku, lepszego rytmu i kilku prostych nawyków stabilizujących.",
        mostlyC:
          "Przewaga C: masz sygnały przeciążenia albo chaosu emocjonalnego. Warto zejść do prostych kroków, regulacji i odciążenia.",
      },
    };
  }

  return {
    title: "Quiz: Twój aktualny stan",
    intro:
      "Krótki test, który pomoże sprawdzić, w jakim miejscu jesteś i co warto zrobić dalej.",
    questions: [
      {
        id: "q1",
        question: "Jak bardzo masz dziś poczucie jasności?",
        options: ["A) Duże", "B) Średnie", "C) Małe"],
      },
      {
        id: "q2",
        question: "Jak oceniasz dziś swoją energię?",
        options: ["A) Dobra", "B) Nierówna", "C) Niska"],
      },
      {
        id: "q3",
        question: "Czy wiesz, jaki jest Twój następny krok?",
        options: ["A) Tak", "B) Mniej więcej", "C) Nie"],
      },
      {
        id: "q4",
        question: "Jak wygląda Twój poziom napięcia?",
        options: ["A) Niski", "B) Średni", "C) Wysoki"],
      },
      {
        id: "q5",
        question: "Czy masz dziś przestrzeń na działanie?",
        options: ["A) Tak", "B) Trochę", "C) Prawie wcale"],
      },
    ],
    resultGuide: {
      mostlyA:
        "Przewaga A: jesteś dość blisko działania. Najlepszy moment, by przejść do konkretnego celu.",
      mostlyB:
        "Przewaga B: potrzebujesz doprecyzowania i prostszego planu.",
      mostlyC:
        "Przewaga C: najpierw porządek i odciążenie, dopiero potem większe decyzje.",
    },
  };
}

function buildTask(topic: string): TaskPayload {
  if (topic === "relacje") {
    return {
      title: "Zadanie: mapa sygnałów w relacji",
      goal: "Zobaczyć fakty zamiast chaosu i domysłów.",
      duration: "10–15 minut",
      steps: [
        "Wypisz 3 konkretne sytuacje, które wzbudziły Twój niepokój.",
        "Przy każdej dopisz: co padło, co zrobiła druga osoba, co poczułeś.",
        "Zaznacz, czy to był jednorazowy incydent czy powtarzający się wzorzec.",
      ],
      minimumVersion:
        "Zapisz choć jedną sytuację i nazwij jedno zachowanie, które było dla Ciebie nie okej.",
      reward: "Większa jasność i mniej emocjonalnego chaosu.",
    };
  }

  if (topic === "emocje") {
    return {
      title: "Zadanie: 3-minutowy reset emocji",
      goal: "Zejść z chaosu do większej jasności i regulacji.",
      duration: "3–5 minut",
      steps: [
        "Nazwij jednym słowem główną emocję, którą teraz czujesz.",
        "Zrób 10 spokojnych oddechów: dłuższy wydech niż wdech.",
        "Napisz jedno zdanie: czego teraz najbardziej potrzebuję?",
      ],
      minimumVersion:
        "Tylko nazwij emocję i zrób 5 spokojnych oddechów.",
      reward: "Szybszy powrót do równowagi i poczucie wpływu.",
    };
  }

  if (topic === "praca") {
    return {
      title: "Zadanie: plan minimum na dziś",
      goal: "Ruszyć z miejsca bez przeciążania się.",
      duration: "10 minut",
      steps: [
        "Wybierz jedną najważniejszą rzecz na dziś.",
        "Podziel ją na pierwszy mały ruch do zrobienia w 10 minut.",
        "Ustaw konkretną godzinę startu i zrób tylko ten pierwszy krok.",
      ],
      minimumVersion:
        "Nazwij jedną rzecz i zrób pierwszy 5-minutowy ruch.",
      reward: "Większa sprawczość i mniej odkładania.",
    };
  }

  return {
    title: "Zadanie: jeden ruch do przodu",
    goal: "Zamienić chaos w prosty, wykonalny krok.",
    duration: "10–15 minut",
    steps: [
      "Wybierz jeden obszar, który dziś chcesz poprawić.",
      "Nazwij jeden mały krok, który da natychmiastowy efekt.",
      "Zrób go jeszcze dziś, bez czekania na idealny moment.",
    ],
    minimumVersion:
      "Zrób jedną małą rzecz, która potrwa maksymalnie 5 minut.",
    reward: "Poczucie ruchu, ulga i konkretny postęp.",
  };
}

function getModuleSystem(module: ModuleType) {
  switch (module) {
    case "relationships":
      return `
Jesteś ekspertem od relacji, komunikacji, granic, czerwonych flag i dynamiki między ludźmi.
Pomagaj konkretnie, trafnie i praktycznie.
`;
    case "emotions":
      return `
Jesteś ekspertem od emocji, napięcia, chaosu psychicznego, samoregulacji i odzyskiwania jasności.
Pomagaj nowocześnie, konkretnie i wspierająco.
`;
    case "quiz":
      return `
Jesteś ekspertem od angażujących quizów i krótkiej diagnostyki.
`;
    case "task":
      return `
Jesteś ekspertem od mikro-zadań, działania i prostych planów minimum.
`;
    default:
      return `
Jesteś wszechstronnym AI do porządkowania chaosu, decyzji, emocji i kierunku.
`;
  }
}

async function runAgent(
  instructions: string,
  input: string,
  maxOutputTokens = 280
) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: input },
    ],
    max_tokens: maxOutputTokens,
  });

  return completion.choices[0].message.content?.trim() || "";
}

async function runTriad(message: string, module: ModuleType) {
  const moduleSystem = getModuleSystem(module);

  const insightPrompt = `
${moduleSystem}

Rola: INSIGHT

Twoje zadanie:
- rozpoznać rdzeń problemu,
- nazwać co tu jest najważniejsze,
- wychwycić emocje, kontekst i ryzyko błędnej interpretacji.

Bądź krótki i konkretny.
`;

  const strategyPrompt = `
${moduleSystem}

Rola: STRATEGY

Twoje zadanie:
- ułożyć praktyczny kierunek odpowiedzi,
- wskazać co użytkownik ma zrobić teraz,
- nadać odpowiedzi strukturę i użyteczność.

Bądź konkretny.
`;

  const criticPrompt = `
${moduleSystem}

Rola: CRITIC

Twoje zadanie:
- sprawdzić jakość odpowiedzi,
- wskazać czego nie wolno zakładać bez dowodu,
- dopilnować trafności, bezpieczeństwa i użyteczności.

Bądź krótki.
`;

  const [insight, strategy, critic] = await Promise.all([
    runAgent(insightPrompt, message, 180),
    runAgent(strategyPrompt, message, 180),
    runAgent(criticPrompt, message, 150),
  ]);

  return { insight, strategy, critic };
}

async function synthesizeReply(params: {
  message: string;
  module: ModuleType;
  insight: string;
  strategy: string;
  critic: string;
}) {
  const { message, module, insight, strategy, critic } = params;

  const finalPrompt = `
Jesteś finalnym głosem produktu.
Użytkownik ma widzieć jedno spójne AI.

Zasady:
- po polsku,
- konkretnie,
- nowocześnie,
- bez lania wody,
- odpowiedź ma być KRÓTSZA niż standardowy elaborat,
- najlepiej 3 zwięzłe bloki.

Format:
1. Krótki wniosek
2. Co zrobić teraz
3. Co dalej

Nie pisz o agentach.
`;

  return runAgent(
    finalPrompt,
    `
MODUŁ:
${module}

WIADOMOŚĆ UŻYTKOWNIKA:
${message}

INSIGHT:
${insight}

STRATEGY:
${strategy}

CRITIC:
${critic}
`,
    420
  );
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          ok: false,
          error: "MISSING_OPENAI_API_KEY",
          details: "Brakuje zmiennej OPENAI_API_KEY na serwerze.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";
    const module = normalizeModule(body?.module);

    if (!message) {
      return Response.json(
        {
          ok: false,
          error: "NO_VALID_MESSAGE",
          details: "Brakuje wiadomości użytkownika.",
        },
        { status: 400 }
      );
    }

    const topic = inferTopic(message);

    if (module === "quiz") {
      return Response.json({
        ok: true,
        type: "quiz",
        quiz: buildQuiz(topic),
        meta: {
          module,
          topic,
          engine: "quiz-v1",
        },
      });
    }

    if (module === "task") {
      return Response.json({
        ok: true,
        type: "task",
        task: buildTask(topic),
        meta: {
          module,
          topic,
          engine: "task-v1",
        },
      });
    }

    const triad = await runTriad(message, module);
    const reply = await synthesizeReply({
      message,
      module,
      insight: triad.insight,
      strategy: triad.strategy,
      critic: triad.critic,
    });

    return Response.json({
      ok: true,
      type: "text",
      reply,
      meta: {
        module,
        topic,
        engine: "triad-v3",
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        error: "SYSTEM_CRASH",
        details: error?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}