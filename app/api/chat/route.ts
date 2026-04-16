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

type AgentResult = {
  agent: "insight" | "strategy" | "critic";
  content: string;
};

function getModuleInstructions(module: ModuleType) {
  switch (module) {
    case "relationships":
      return `
Priorytet: relacje, sygnały, dynamika, granice, komunikacja, intencje, czerwone flagi.
`;
    case "emotions":
      return `
Priorytet: emocje, napięcie, chaos, regulacja, nazwanie stanu, odzyskanie jasności.
`;
    case "quiz":
      return `
Priorytet: forma interaktywna. Jeśli pasuje, dawaj krótkie pytania diagnostyczne lub mini-quiz.
`;
    case "task":
      return `
Priorytet: konkretne działanie. Dawaj mikro-zadania, plan minimum, prosty kolejny krok.
`;
    default:
      return `
Priorytet: ogólne wsparcie, porządkowanie myśli, decyzji, kierunku i problemu.
`;
  }
}

async function runInsightAgent(message: string, module: ModuleType) {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions: `
Jesteś agentem INSIGHT.
Masz rozpoznać:
- o co naprawdę chodzi użytkownikowi,
- jaki jest rdzeń problemu,
- co użytkownik może czuć,
- jakie są 2-4 najważniejsze obserwacje.

Zasady:
- mów po polsku,
- bądź konkretny,
- nie dawaj finalnej odpowiedzi dla użytkownika,
- nie lej wody,
- maksymalnie 180 słów.

${getModuleInstructions(module)}
`,
    input: message,
  });

  return {
    agent: "insight" as const,
    content: (response.output_text || "").trim(),
  };
}

async function runStrategyAgent(message: string, module: ModuleType) {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions: `
Jesteś agentem STRATEGY.
Masz przygotować:
- kierunek odpowiedzi,
- 3-6 praktycznych kroków,
- strukturę rozwiązania,
- co użytkownik ma zrobić teraz.

Zasady:
- mów po polsku,
- bądź praktyczny,
- nie dawaj finalnej odpowiedzi dla użytkownika,
- nie pisz o agentach,
- maksymalnie 180 słów.

${getModuleInstructions(module)}
`,
    input: message,
  });

  return {
    agent: "strategy" as const,
    content: (response.output_text || "").trim(),
  };
}

async function runCriticAgent(message: string, module: ModuleType) {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions: `
Jesteś agentem CRITIC.
Masz zrobić kontrolę jakości:
- czego nie wolno założyć bez dowodu,
- jakie są ryzyka błędnej interpretacji,
- co trzeba doprecyzować,
- jak zachować trafność i użyteczność.

Zasady:
- mów po polsku,
- bądź krytyczny, ale użyteczny,
- nie dawaj finalnej odpowiedzi dla użytkownika,
- nie bądź rozwlekły,
- maksymalnie 150 słów.

${getModuleInstructions(module)}
`,
    input: message,
  });

  return {
    agent: "critic" as const,
    content: (response.output_text || "").trim(),
  };
}

async function synthesizeFinal(params: {
  message: string;
  module: ModuleType;
  insight: string;
  strategy: string;
  critic: string;
}) {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions: `
Jesteś finalnym głosem produktu.
Użytkownik ma widzieć jedno spójne AI, bez agentów.

Twoje zadanie:
- połącz analizę, strategię i kontrolę jakości w jedną odpowiedź,
- bądź celny, pomocny i konkretny,
- jeśli czegoś nie wiesz, zaznacz to jasno,
- jeśli pasuje, zadawaj 1 dobre pytanie doprecyzowujące,
- unikaj lania wody.

Styl:
- nowocześnie,
- ludzko,
- z poczuciem prowadzenia,
- po polsku.

Format:
1. Krótki wniosek
2. Co zrobić teraz
3. Co dalej
`,
    input: `
MODUŁ: ${params.module}

WIADOMOŚĆ UŻYTKOWNIKA:
${params.message}

ANALIZA INSIGHT:
${params.insight}

STRATEGIA:
${params.strategy}

KONTROLA JAKOŚCI:
${params.critic}
`,
  });

  return (response.output_text || "").trim();
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
    const module: ModuleType =
      body?.module &&
      ["general", "relationships", "emotions", "quiz", "task"].includes(
        body.module
      )
        ? body.module
        : "general";

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

    const [insight, strategy, critic] = await Promise.all([
      runInsightAgent(message, module),
      runStrategyAgent(message, module),
      runCriticAgent(message, module),
    ]);

    const reply = await synthesizeFinal({
      message,
      module,
      insight: insight.content,
      strategy: strategy.content,
      critic: critic.content,
    });

    return Response.json({
      ok: true,
      reply,
      meta: {
        module,
        engine: "triad-v1",
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
