import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type WorkflowStep = {
  name: string;
  status: "done" | "failed" | "skipped";
  details: string;
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

    if (lastUserMessage) {
      return lastUserMessage.content.trim();
    }
  }

  return "";
}

async function runAgent(systemPrompt: string, userPrompt: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return res.choices[0]?.message?.content?.trim() || "";
}

async function diagnosisAgent(message: string) {
  return runAgent(
    `Jesteś agentem diagnozy.
Twoje zadanie:
1. Rozpoznaj prawdziwą intencję użytkownika.
2. Ustal czego potrzebuje.
3. Oceń ton wypowiedzi.
4. Wskaż, czy problem jest jasny czy niejasny.

Odpowiedz po polsku.
Format:
INTENCJA: ...
POTRZEBA: ...
TON: ...
JASNOŚĆ: jasne / częściowo jasne / niejasne
RYZYKO_BŁĘDNEJ_INTERPRETACJI: niskie / średnie / wysokie`,
    message
  );
}

async function planningAgent(message: string, diagnosis: string) {
  return runAgent(
    `Jesteś agentem planowania.
Masz przygotować schemat działania zanim agent ekspercki odpowie.

Zadanie:
1. Rozbij problem na etapy.
2. Ustal kolejność myślenia.
3. Wskaż, co trzeba sprawdzić przed finalną odpowiedzią.
4. Podaj checklistę kontroli.

Odpowiedź po polsku.
Format:
CEL: ...
ETAPY:
1. ...
2. ...
3. ...
CHECKLISTA:
- ...
- ...
- ...`,
    `Wiadomość użytkownika:
${message}

Diagnoza:
${diagnosis}`
  );
}

async function expertAgent(
  message: string,
  diagnosis: string,
  plan: string
) {
  return runAgent(
    `Jesteś agentem eksperckim.
Masz stworzyć najlepszą możliwą odpowiedź dla użytkownika po polsku.

Zasady:
- praktycznie
- konkretnie
- bez lania wody
- bez chaosu
- jeśli coś jest niejasne, zrób rozsądne założenie, ale nie odlatuj

Masz korzystać z diagnozy i planu przygotowanego przez inne agenty.`,
    `Wiadomość użytkownika:
${message}

Diagnoza:
${diagnosis}

Plan:
${plan}

Przygotuj roboczą odpowiedź ekspercką.`
  );
}

async function criticAgent(
  message: string,
  diagnosis: string,
  plan: string,
  draftAnswer: string
) {
  return runAgent(
    `Jesteś agentem kontroli jakości.
Masz ocenić odpowiedź ekspercką.

Sprawdź:
1. Czy odpowiada na realną intencję użytkownika.
2. Czy jest zgodna z planem.
3. Czy jest konkretna.
4. Czy nie pomija ważnych elementów.
5. Czy nie brzmi zbyt ogólnie.

Jeśli jest dobrze, napisz dokładnie:
WERDYKT: OK
PROBLEM: brak
POPRAWKI: brak

Jeśli nie jest dobrze, napisz dokładnie:
WERDYKT: POPRAW
PROBLEM: ...
POPRAWKI: ...`,
    `Wiadomość użytkownika:
${message}

Diagnoza:
${diagnosis}

Plan:
${plan}

Odpowiedź ekspercka:
${draftAnswer}`
  );
}

async function supervisorAgent(params: {
  message: string;
  diagnosis: string;
  plan: string;
  expertDraft: string;
  criticReview: string;
  workflowSummary: string;
}) {
  const {
    message,
    diagnosis,
    plan,
    expertDraft,
    criticReview,
    workflowSummary,
  } = params;

  return runAgent(
    `Jesteś supervisorem systemu wieloagentowego.
Pilnujesz procesu i wydajesz finalną odpowiedź tylko wtedy, gdy etapy są logiczne i spójne.

Twoje zadania:
1. Zbierz wyniki agentów.
2. Sprawdź zgodność procesu.
3. Jeśli agent kontroli zgłasza problem, popraw odpowiedź przed oddaniem.
4. Zwróć jedną finalną odpowiedź po polsku.
5. Na końcu dodaj sekcję:
"Jak pracował system:"
i w 4 krótkich punktach opisz:
- diagnozę,
- plan,
- odpowiedź ekspercką,
- kontrolę jakości.

Nie pokazuj technicznego chaosu. Ma być czytelnie.`,
    `Wiadomość użytkownika:
${message}

Diagnoza:
${diagnosis}

Plan:
${plan}

Odpowiedź ekspercka:
${expertDraft}

Kontrola jakości:
${criticReview}

Podsumowanie checklisty:
${workflowSummary}

Przygotuj finalną odpowiedź dla użytkownika.`
  );
}

function buildWorkflow(params: {
  diagnosis: string;
  plan: string;
  expertDraft: string;
  criticReview: string;
}): WorkflowStep[] {
  const { diagnosis, plan, expertDraft, criticReview } = params;

  const workflow: WorkflowStep[] = [];

  workflow.push({
    name: "Diagnoza intencji użytkownika",
    status: diagnosis ? "done" : "failed",
    details: diagnosis
      ? "Agent diagnozy określił intencję, potrzebę i poziom jasności problemu."
      : "Brak wyniku diagnozy.",
  });

  workflow.push({
    name: "Ułożenie planu działania",
    status: plan ? "done" : "failed",
    details: plan
      ? "Agent planowania przygotował etapy i checklistę kontroli."
      : "Brak planu działania.",
  });

  workflow.push({
    name: "Przygotowanie odpowiedzi eksperckiej",
    status: expertDraft ? "done" : "failed",
    details: expertDraft
      ? "Agent ekspercki przygotował roboczą odpowiedź."
      : "Brak odpowiedzi eksperckiej.",
  });

  const criticOk = criticReview.includes("WERDYKT: OK");
  const criticImprove = criticReview.includes("WERDYKT: POPRAW");

  workflow.push({
    name: "Kontrola jakości odpowiedzi",
    status: criticOk ? "done" : criticImprove ? "failed" : "failed",
    details: criticOk
      ? "Agent kontroli zatwierdził odpowiedź."
      : criticImprove
      ? "Agent kontroli wykrył problem i wymusił korektę przez supervisora."
      : "Nie udało się ustalić poprawnego werdyktu kontroli.",
  });

  workflow.push({
    name: "Decyzja supervisora",
    status: "done",
    details:
      "Supervisor zebrał wyniki agentów, sprawdził spójność procesu i przygotował finalną odpowiedź.",
  });

  return workflow;
}

function workflowToText(workflow: WorkflowStep[]) {
  return workflow
    .map(
      (step, index) =>
        `${index + 1}. ${step.name} | status: ${step.status} | ${step.details}`
    )
    .join("\n");
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
          receivedKeys: Object.keys(body || {}),
        },
        { status: 400 }
      );
    }

    const diagnosis = await diagnosisAgent(message);
    const plan = await planningAgent(message, diagnosis);
    const expertDraft = await expertAgent(message, diagnosis, plan);
    const criticReview = await criticAgent(
      message,
      diagnosis,
      plan,
      expertDraft
    );

    const workflow = buildWorkflow({
      diagnosis,
      plan,
      expertDraft,
      criticReview,
    });

    const workflowSummary = workflowToText(workflow);

    const finalReply = await supervisorAgent({
      message,
      diagnosis,
      plan,
      expertDraft,
      criticReview,
      workflowSummary,
    });

    return Response.json({
      reply: finalReply,
      workflow,
      agents: {
        diagnosis,
        planner: plan,
        expert: expertDraft,
        critic: criticReview,
        supervisor: "Supervisor wykonał końcową syntezę i kontrolę procesu.",
      },
      meta: "SUPERVISOR_WORKFLOW_OK",
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
