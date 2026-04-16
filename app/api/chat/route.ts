import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type WorkflowStep = {
  name: string;
  status: "pending" | "running" | "done" | "failed" | "skipped";
  details: string;
};

type SharedState = {
  userMessage: string;
  diagnosis: string;
  planner: string;
  expert: string;
  critic: string;
  repair: string;
  supervisor: string;
  workflow: WorkflowStep[];
  notes: string[];
};

function extractMessage(body: any): string {
  if (typeof body?.message === "string" && body.message.trim()) {
    return body.message.trim();
  }

  if (Array.isArray(body?.messages)) {
    const lastUserMessage = [...body.messages]
      .reverse()
      .find(
        (m) =>
          m &&
          m.role === "user" &&
          typeof m.content === "string" &&
          m.content.trim()
      );

    if (lastUserMessage) return lastUserMessage.content.trim();
  }

  return "";
}

async function runAgent(systemPrompt: string, userPrompt: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.35,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return res.choices[0]?.message?.content?.trim() || "";
}

function summarizeSharedState(state: SharedState) {
  return `
WIADOMOŚĆ UŻYTKOWNIKA:
${state.userMessage}

DOTYCHCZASOWE WYNIKI:
DIAGNOZA:
${state.diagnosis || "(brak)"}

PLANISTA:
${state.planner || "(brak)"}

EKSPERT:
${state.expert || "(brak)"}

KONTROLA:
${state.critic || "(brak)"}

NAPRAWA:
${state.repair || "(brak)"}

NOTATKI SYSTEMU:
${state.notes.length ? state.notes.join("\n") : "(brak)"}
`.trim();
}

function createInitialWorkflow(): WorkflowStep[] {
  return [
    {
      name: "Diagnoza",
      status: "pending",
      details: "Agent diagnozy jeszcze nie zaczął.",
    },
    {
      name: "Planowanie",
      status: "pending",
      details: "Agent planowania jeszcze nie zaczął.",
    },
    {
      name: "Ekspert",
      status: "pending",
      details: "Agent ekspercki jeszcze nie zaczął.",
    },
    {
      name: "Kontrola jakości",
      status: "pending",
      details: "Agent kontroli jeszcze nie zaczął.",
    },
    {
      name: "Naprawa",
      status: "skipped",
      details: "Etap naprawy uruchomi się tylko jeśli kontrola wykryje problem.",
    },
    {
      name: "Supervisor",
      status: "pending",
      details: "Supervisor jeszcze nie zaczął syntezy.",
    },
  ];
}

function setWorkflowStep(
  state: SharedState,
  stepName: string,
  patch: Partial<WorkflowStep>
) {
  state.workflow = state.workflow.map((step) =>
    step.name === stepName ? { ...step, ...patch } : step
  );
}

function makeEvent(event: Record<string, any>) {
  return `${JSON.stringify(event)}\n`;
}

async function diagnosisAgent(state: SharedState) {
  return runAgent(
    `Jesteś agentem diagnozy.
Masz ustalić, czego użytkownik naprawdę chce.

Zasady:
- nie dawaj porad,
- nie buduj planu,
- tylko diagnoza intencji i braków,
- bądź konkretny i krótki,
- uwzględnij wspólny stan systemu, ale nie duplikuj treści.

Odpowiedz dokładnie w formacie:
INTENCJA_GŁÓWNA: ...
CELE_POBOCZNE: ...
POZIOM_KONKRETNOŚCI: wysoki / średni / niski
BRAKI: ...
ZAŁOŻENIA_ROBOCZE: ...`,
    summarizeSharedState(state)
  );
}

async function planningAgent(state: SharedState) {
  return runAgent(
    `Jesteś agentem planowania.
Widzisz wspólny stan systemu i wyniki wcześniejszych agentów.

Zadanie:
- nie odpowiadaj jeszcze użytkownikowi,
- zbuduj strukturę myślenia dla eksperta i supervisora,
- wskaż 3 najważniejsze bloki odpowiedzi,
- podaj checklistę jakości.

Odpowiedz dokładnie w formacie:
CEL_ODPOWIEDZI: ...
BLOK_1: ...
CO_OCENIĆ_1: ...
BLOK_2: ...
CO_OCENIĆ_2: ...
BLOK_3: ...
CO_OCENIĆ_3: ...
CHECKLISTA:
- ...
- ...
- ...
- ...`,
    summarizeSharedState(state)
  );
}

async function expertAgent(state: SharedState) {
  return runAgent(
    `Jesteś agentem eksperckim.
Widzisz wspólny stan systemu oraz wyniki innych agentów.

Masz stworzyć roboczą odpowiedź dla użytkownika.

Zasady:
- zero lania wody,
- zero generycznych porad,
- konkret, priorytety, ruchy do wdrożenia,
- jeśli temat jest szeroki, zawężaj go rozsądnie na podstawie diagnozy i planu,
- pisz po polsku,
- nie opisuj procesu systemu.

Forma:
- krótki wstęp
- konkretne sekcje
- 3 najbliższe kroki
- sekcja: "Jak AI może realnie pomóc"`,
    summarizeSharedState(state)
  );
}

async function criticAgent(state: SharedState) {
  return runAgent(
    `Jesteś bardzo surowym agentem kontroli jakości.
Widzisz wspólny stan i całą roboczą odpowiedź eksperta.

Masz ocenić:
- czy odpowiedź trafia w intencję użytkownika,
- czy jest konkretna,
- czy ma priorytety,
- czy nie jest generyczna,
- czy użytkownik może coś wdrożyć od razu.

Jeśli odpowiedź jest zbyt ogólna albo za miękka, ustaw POPRAW.

Odpowiedz dokładnie w formacie:
WERDYKT: OK albo POPRAW
OCENA_KONKRETU: 1-10
NAJWIĘKSZY_PROBLEM: ...
CO_TRZEBA_POPRAWIĆ:
- ...
- ...
- ...`,
    summarizeSharedState(state)
  );
}

async function repairAgent(state: SharedState) {
  return runAgent(
    `Jesteś agentem naprawczym.
Widzisz wspólny stan, roboczą odpowiedź eksperta i krytykę kontroli jakości.

Twoje zadanie:
- popraw odpowiedź,
- usuń ogólniki,
- dodaj konkrety,
- nie przedłużaj sztucznie,
- zachowaj tylko to, co mocne.

Pisz po polsku.`,
    summarizeSharedState(state)
  );
}

async function supervisorAgent(state: SharedState) {
  return runAgent(
    `Jesteś supervisorem wieloagentowego systemu.
Widzisz wspólny stan całego procesu.

Masz przygotować finalną odpowiedź dla użytkownika.

Zasady:
- odpowiedź ma być spójna, konkretna i użyteczna,
- ma brzmieć jak wynik mocnego procesu, nie szablon,
- nie pokazuj technicznego bałaganu,
- na końcu dodaj krótką sekcję:
"Jak pracował system:"
i tam w 4 krótkich punktach opisz:
- diagnozę,
- plan,
- pracę eksperta,
- kontrolę jakości / naprawę.`,
    summarizeSharedState(state)
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = extractMessage(body);

    if (!message) {
      return Response.json(
        {
          error: "NO_VALID_MESSAGE",
          details:
            "Backend nie dostał poprawnego pola 'message' ani 'messages'.",
        },
        { status: 400 }
      );
    }

    const state: SharedState = {
      userMessage: message,
      diagnosis: "",
      planner: "",
      expert: "",
      critic: "",
      repair: "",
      supervisor: "",
      workflow: createInitialWorkflow(),
      notes: [],
    };

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (payload: Record<string, any>) => {
          controller.enqueue(encoder.encode(makeEvent(payload)));
        };

        try {
          send({
            type: "init",
            workflow: state.workflow,
            agents: {
              diagnosis: "",
              planner: "",
              expert: "",
              critic: "",
              repair: "",
              supervisor: "",
            },
          });

          setWorkflowStep(state, "Diagnoza", {
            status: "running",
            details: "Agent diagnozy analizuje intencję użytkownika.",
          });
          send({ type: "workflow", workflow: state.workflow });

          state.diagnosis = await diagnosisAgent(state);
          state.notes.push("Diagnoza ukończona.");
          setWorkflowStep(state, "Diagnoza", {
            status: "done",
            details: "Agent diagnozy określił intencję, braki i założenia.",
          });
          send({
            type: "agent",
            agent: "diagnosis",
            content: state.diagnosis,
            workflow: state.workflow,
          });

          setWorkflowStep(state, "Planowanie", {
            status: "running",
            details: "Planista układa strukturę odpowiedzi w oparciu o diagnozę.",
          });
          send({ type: "workflow", workflow: state.workflow });

          state.planner = await planningAgent(state);
          state.notes.push("Planowanie ukończone.");
          setWorkflowStep(state, "Planowanie", {
            status: "done",
            details: "Planista przygotował bloki odpowiedzi i checklistę jakości.",
          });
          send({
            type: "agent",
            agent: "planner",
            content: state.planner,
            workflow: state.workflow,
          });

          setWorkflowStep(state, "Ekspert", {
            status: "running",
            details: "Ekspert buduje roboczą odpowiedź, widząc wspólny stan.",
          });
          send({ type: "workflow", workflow: state.workflow });

          state.expert = await expertAgent(state);
          state.notes.push("Wersja ekspercka gotowa.");
          setWorkflowStep(state, "Ekspert", {
            status: "done",
            details: "Ekspert przygotował pierwszą wersję odpowiedzi.",
          });
          send({
            type: "agent",
            agent: "expert",
            content: state.expert,
            workflow: state.workflow,
          });

          setWorkflowStep(state, "Kontrola jakości", {
            status: "running",
            details: "Kontrola jakości sprawdza trafność i poziom konkretu.",
          });
          send({ type: "workflow", workflow: state.workflow });

          state.critic = await criticAgent(state);
          state.notes.push("Kontrola jakości zakończona.");

          const needsRepair = state.critic.includes("WERDYKT: POPRAW");

          setWorkflowStep(state, "Kontrola jakości", {
            status: needsRepair ? "failed" : "done",
            details: needsRepair
              ? "Kontrola jakości odrzuciła wersję ekspercką i wymusiła naprawę."
              : "Kontrola jakości zatwierdziła wersję ekspercką.",
          });
          send({
            type: "agent",
            agent: "critic",
            content: state.critic,
            workflow: state.workflow,
          });

          if (needsRepair) {
            setWorkflowStep(state, "Naprawa", {
              status: "running",
              details: "Agent naprawczy poprawia odpowiedź po krytyce.",
            });
            send({ type: "workflow", workflow: state.workflow });

            state.repair = await repairAgent(state);
            state.notes.push("Naprawa wykonana.");
            setWorkflowStep(state, "Naprawa", {
              status: "done",
              details: "Agent naprawczy przygotował lepszą wersję odpowiedzi.",
            });
            send({
              type: "agent",
              agent: "repair",
              content: state.repair,
              workflow: state.workflow,
            });
          }

          setWorkflowStep(state, "Supervisor", {
            status: "running",
            details: "Supervisor scala wszystko w jedną finalną odpowiedź.",
          });
          send({ type: "workflow", workflow: state.workflow });

          if (state.repair) {
            state.expert = state.repair;
          }

          state.supervisor = await supervisorAgent(state);
          state.notes.push("Supervisor zakończył syntezę.");
          setWorkflowStep(state, "Supervisor", {
            status: "done",
            details: "Supervisor przygotował finalną odpowiedź dla użytkownika.",
          });

          send({
            type: "final",
            reply: state.supervisor,
            workflow: state.workflow,
            agents: {
              diagnosis: state.diagnosis,
              planner: state.planner,
              expert: state.expert,
              critic: state.critic,
              repair: state.repair,
              supervisor:
                state.repair
                  ? "Supervisor użył poprawionej wersji odpowiedzi."
                  : "Supervisor zatwierdził odpowiedź bez etapu naprawy.",
            },
            meta: "LIVE_SHARED_STATE_OK",
          });

          controller.close();
        } catch (error: any) {
          send({
            type: "error",
            error: "SYSTEM_CRASH",
            details: error?.message || "Unknown error",
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    return Response.json(
      {
        error: "SYSTEM_CRASH",
        details: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
