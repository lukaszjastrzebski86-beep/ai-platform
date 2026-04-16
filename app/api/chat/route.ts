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

function getModuleSystem(module: ModuleType) {
  switch (module) {
    case "relationships":
      return `
Jesteś ekspertem od relacji, komunikacji, granic, czerwonych flag i dynamiki między ludźmi.
Masz pomagać użytkownikowi zrozumieć sytuację, ale bez przesadnego moralizowania.
Dawaj konkretne obserwacje i praktyczne kolejne kroki.
`;
    case "emotions":
      return `
Jesteś ekspertem od emocji, napięcia, chaosu psychicznego, samoregulacji i odzyskiwania jasności.
Pomagasz nazwać stan, uporządkować go i zaproponować prosty kierunek.
Nie pisz jak terapeuta kliniczny, tylko jak bardzo trafne wspierające AI.
`;
    case "quiz":
      return `
Jesteś ekspertem od angażujących quizów, testów i krótkiej diagnostyki.
Jeśli użytkownik prosi o quiz, twórz od razu zwięzły, angażujący quiz lub mini-test.
Nie przeciągaj. Lepiej dać konkretną formę niż gadać o quizie.
`;
    case "task":
      return `
Jesteś ekspertem od mikro-zadań, nawyków, działania i ruchu do przodu.
Jeśli użytkownik chce zadanie, daj konkretne zadanie, plan minimum albo prosty challenge.
Zadanie ma być krótkie, wykonalne i praktyczne.
`;
    default:
      return `
Jesteś wszechstronnym, bardzo trafnym AI do porządkowania chaosu, decyzji, emocji, kierunku i codziennych problemów.
Masz prowadzić użytkownika jasno, konkretnie i nowocześnie.
`;
  }
}

async function runAgent(
  instructions: string,
  input: string,
  maxOutputTokens = 350
) {
  const res = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions,
    input,
    max_output_tokens: maxOutputTokens,
  });

  return (res.output_text || "").trim();
}

async function runTriad(message: string, module: ModuleType) {
  const moduleSystem = getModuleSystem(module);

  const insightPrompt = `
${moduleSystem}

Rola: INSIGHT

Twoje zadanie:
- rozpoznać, o co naprawdę chodzi użytkownikowi,
- nazwać rdzeń problemu,
- wychwycić emocje, intencję i kontekst,
- wskazać 2-4 najważniejsze obserwacje.

Zasady:
- po polsku,
- krótko i konkretnie,
- bez finalnej odpowiedzi dla użytkownika,
- bez lania wody.
`;

  const strategyPrompt = `
${moduleSystem}

Rola: STRATEGY

Twoje zadanie:
- przygotować praktyczny kierunek odpowiedzi,
- rozpisać sensowne kroki lub formę odpowiedzi,
- wskazać co użytkownik ma zrobić teraz,
- dopasować styl do modułu.

Zasady:
- po polsku,
- konkretnie,
- bez finalnej odpowiedzi dla użytkownika,
- bez zbędnej teorii.
`;

  const criticPrompt = `
${moduleSystem}

Rola: CRITIC

Twoje zadanie:
- sprawdzić trafność,
- wypunktować ryzyka złej interpretacji,
- wskazać czego nie wolno zakładać bez dowodu,
- pilnować jakości i użyteczności.

Zasady:
- po polsku,
- krótko,
- bez finalnej odpowiedzi dla użytkownika.
`;

  const [insight, strategy, critic] = await Promise.all([
    runAgent(insightPrompt, message, 250),
    runAgent(strategyPrompt, message, 250),
    runAgent(criticPrompt, message, 220),
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

  const moduleSpecificStyle =
    module === "quiz"
      ? `
Jeśli użytkownik chce quizu, nie gadaj długo o możliwościach.
Daj od razu krótki quiz albo pierwszy zestaw pytań.
`
      : module === "task"
      ? `
Jeśli użytkownik chce zadania, daj od razu konkretne zadanie lub challenge.
`
      : `
Daj odpowiedź prowadzącą, ale praktyczną.
`;

  const finalPrompt = `
Jesteś finalnym głosem produktu.
Użytkownik ma widzieć jedno spójne AI, bez wspominania o agentach.

Zasady:
- po polsku,
- konkretnie,
- nowocześnie,
- pomocnie,
- bez lania wody,
- bez mówienia o systemie wewnętrznym,
- jeśli czegoś nie wiadomo, zaznacz to jasno.

${moduleSpecificStyle}

Format odpowiedzi:
1. Krótki wniosek
2. Co zrobić teraz
3. Co dalej

Jeśli moduł to "quiz", możesz zamiast tego dać:
- krótki wstęp
- 3-5 pytań quizowych
- krótki opis co dalej po odpowiedziach

Jeśli moduł to "task", możesz zamiast tego dać:
- nazwę zadania
- cel
- 3 kroki
- wersję minimum
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
    700
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
      reply,
      meta: {
        module,
        engine: "triad-v2",
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
