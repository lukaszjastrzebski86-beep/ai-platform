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
    temperature: 0.35,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return res.choices[0]?.message?.content?.trim() || "";
}

async function diagnosisAgent(message: string) {
  return runAgent(
    `Jesteś agentem diagnozy intencji użytkownika.

Twoje zadanie:
1. Ustal, czego użytkownik naprawdę chce.
2. Oddziel cel główny od pobocznych.
3. Oceń, czy pytanie jest konkretne czy zbyt szerokie.
4. Wskaż brakujące elementy, ale bez zadawania pytań użytkownikowi.
5. Zrób robocze założenia, jeśli trzeba.

Pisz po polsku.
Bądź konkretny.
Nie dawaj porad ani planu działania.

Odpowiedz dokładnie w tym formacie:

INTENCJA_GŁÓWNA: ...
CELE_POBOCZNE: ...
TYP_POTRZEBY: informacja / plan / decyzja / analiza / strategia / wsparcie
POZIOM_KONKRETNOŚCI: wysoki / średni / niski
BRAKI: ...
ZAŁOŻENIA_ROBOCZE: ...`,
    message
  );
}

async function planningAgent(message: string, diagnosis: string) {
  return runAgent(
    `Jesteś agentem planowania.

Twoje zadanie:
- nie odpowiadać użytkownikowi,
- tylko przygotować strukturę myślenia dla eksperta i supervisora.

Zasady:
1. Nie pisz gotowej odpowiedzi dla użytkownika.
2. Nie dawaj ogólników typu "zrób badanie rynku", jeśli nie doprecyzujesz po co.
3. Rozbij temat na maksymalnie 3 najważniejsze bloki.
4. Dla każdego bloku napisz, co konkretnie trzeba ocenić.
5. Zbuduj checklistę kontroli jakości odpowiedzi.

Pisz po polsku.
Krótko, rzeczowo.

Odpowiedz dokładnie w tym formacie:

CEL_ODPOWIEDZI: ...
BLOK_1: ...
CO_TRZEBA_OCENIĆ_1: ...
BLOK_2: ...
CO_TRZEBA_OCENIĆ_2: ...
BLOK_3: ...
CO_TRZEBA_OCENIĆ_3: ...
CHECKLISTA_JAKOŚCI:
- ...
- ...
- ...
- ...`,
    `Wiadomość użytkownika:
${message}

Diagnoza:
${diagnosis}`
  );
}

async function expertAgent(message: string, diagnosis: string, plan: string) {
  return runAgent(
    `Jesteś agentem eksperckim.

Masz stworzyć mocną roboczą odpowiedź dla użytkownika.

Zasady krytyczne:
1. Zero lania wody.
2. Zero fraz typu: "warto rozważyć", "możesz także", "dobrym pomysłem jest" bez konkretu.
3. Odpowiedź ma być praktyczna, ostra i użyteczna.
4. Jeśli temat dotyczy budowy produktu, biznesu, systemu albo platformy:
   - wskaż realne opcje,
   - odetnij zbędne kierunki,
   - zaproponuj najbliższe sensowne kroki,
   - pokaż priorytety.
5. Jeśli pytanie jest szerokie, zawęź je rozsądnie na podstawie diagnozy.
6. Nie pisz jak coach motywacyjny.
7. Nie powtarzaj tego samego innymi słowami.

Forma:
- krótki wstęp 1–2 zdania
- potem konkretne sekcje
- potem 3 najbliższe kroki
- potem sekcja "Jak AI może realnie pomóc"

Pisz po polsku.`,
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
    `Jesteś bardzo surowym agentem kontroli jakości.

Masz ocenić odpowiedź ekspercką bez pobłażania.

Masz sprawdzić:
1. Czy odpowiedź naprawdę odpowiada na intencję użytkownika.
2. Czy jest konkretna.
3. Czy zawiera realne priorytety.
4. Czy unika pustych ogólników.
5. Czy daje użytkownikowi coś, co może wdrożyć od razu.
6. Czy nie brzmi jak generyczna odpowiedź chatbotowa.

Masz oznaczyć WERDYKT: POPRAW, jeśli:
- są ogólniki,
- brakuje priorytetów,
- odpowiedź jest zbyt szeroka,
- odpowiedź brzmi ładnie, ale mało operacyjnie.

Odpowiedz dokładnie w tym formacie:

WERDYKT: OK albo POPRAW
OCENA_KONKRETU: 1-10
NAJWIĘKSZY_PROBLEM: ...
CO_TRZEBA_POPRAWIĆ:
- ...
- ...
- ...`,
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

async function repairAgent(
  message: string,
  diagnosis: string,
  plan: string,
  draftAnswer: string,
  criticReview: string
) {
  return runAgent(
    `Jesteś agentem naprawczym.

Dostajesz odpowiedź ekspercką i krytykę kontroli jakości.
Masz poprawić odpowiedź tak, aby była:
- bardziej konkretna,
- bardziej praktyczna,
- bardziej priorytetyzowana,
- mniej generyczna.

Zasady:
1. Zachowaj tylko to, co mocne.
2. Usuń puste ogólniki.
3. Dodaj konkretne następne ruchy.
4. Nie rób odpowiedzi dłuższej tylko po to, żeby była dłuższa.
5. Efekt ma być wyraźnie lepszy niż wersja pierwotna.

Pisz po polsku.`,
    `Wiadomość użytkownika:
${message}

Diagnoza:
${diagnosis}

Plan:
${plan}

Pierwotna odpowiedź ekspercka:
${draftAnswer}

Uwagi kontroli jakości:
${criticReview}

Przygotuj poprawioną wersję odpowiedzi.`
  );
}

async function supervisorAgent(params: {
  message: string;
  diagnosis: string;
  plan: string;
  finalDraft: string;
  criticReview: string;
  workflowSummary: string;
  wasRepaired: boolean;
}) {
  const {
    message,
    diagnosis,
    plan,
    finalDraft,
    criticReview,
    workflowSummary,
    wasRepaired,
  } = params;

  return runAgent(
    `Jesteś supervisorem systemu wieloagentowego.

Pilnujesz, żeby finalna odpowiedź była:
- spójna,
- konkretna,
- użyteczna,
- niegeneryczna.

Zasady:
1. Nie pokazuj użytkownikowi bałaganu technicznego.
2. Jeśli odpowiedź była poprawiana, uwzględnij lepszą wersję.
3. Finalna odpowiedź ma brzmieć jak rezultat mocnego procesu, nie jak automatyczny szablon.
4. Na końcu dodaj sekcję:
"Jak pracował system:"
i tam w 4 krótkich punktach opisz:
- co wykryła diagnoza,
- jak ustawiono plan,
- co zrobił ekspert,
- co zrobiła kontrola jakości.
5. Ta sekcja ma być krótka, konkretna, bez lania wody.

Pisz po polsku.`,
    `Wiadomość użytkownika:
${message}

Diagnoza:
${diagnosis}

Plan:
${plan}

Finalny draft do syntezy:
${finalDraft}

Kontrola jakości:
${criticReview}

Czy była naprawa odpowiedzi: ${wasRepaired ? "TAK" : "NIE"}

Podsumowanie workflow:
${workflowSummary}

Przygotuj finalną odpowiedź dla użytkownika.`
  );
}

function buildWorkflow(params: {
  diagnosis: string;
  plan: string;
  expertDraft: string;
  criticReview: string;
  repairedDraft?: string;
}) {
  const { diagnosis, plan, expertDraft, criticReview, repairedDraft } = params;

  const criticOk = criticReview.includes("WERDYKT: OK");
  const criticImprove = criticReview.includes("WERDYKT: POPRAW");
  const usedRepair = Boolean(repairedDraft);

  const workflow: WorkflowStep[] = [
    {
      name: "Diagnoza intencji użytkownika",
      status: diagnosis ? "done" : "failed",
      details: diagnosis
        ? "Agent diagnozy ustalił główną intencję, poziom konkretu i robocze założenia."
        : "Brak diagnozy.",
    },
    {
      name: "Planowanie struktury odpowiedzi",
      status: plan ? "done" : "failed",
      details: plan
        ? "Agent planowania przygotował bloki analizy i checklistę jakości."
        : "Brak planu.",
    },
    {
      name: "Wersja robocza odpowiedzi eksperckiej",
      status: expertDraft ? "done" : "failed",
      details: expertDraft
        ? "Agent ekspercki przygotował pierwszą wersję odpowiedzi."
        : "Brak odpowiedzi eksperckiej.",
    },
    {
      name: "Kontrola jakości odpowiedzi",
      status: criticOk ? "done" : criticImprove ? "failed" : "failed",
      details: criticOk
        ? "Kontrola jakości zatwierdziła odpowiedź bez potrzeby poprawy."
        : criticImprove
        ? "Kontrola jakości wykryła zbyt niski poziom konkretu i wymusiła poprawę."
        : "Nie udało się jednoznacznie ocenić odpowiedzi.",
    },
    {
      name: "Naprawa odpowiedzi po kontroli",
      status: criticImprove ? (usedRepair ? "done" : "failed") : "skipped",
      details: criticImprove
        ? usedRepair
          ? "Agent naprawczy poprawił odpowiedź zgodnie z uwagami kontroli."
          : "Wymagana była poprawa, ale nie powstała poprawiona wersja."
        : "Ten etap nie był potrzebny.",
    },
    {
      name: "Synteza supervisora",
      status: "done",
      details:
        "Supervisor zebrał wyniki, sprawdził proces i złożył finalną odpowiedź.",
    },
  ];

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

    const needsRepair = criticReview.includes("WERDYKT: POPRAW");

    let repairedDraft = "";
    if (needsRepair) {
      repairedDraft = await repairAgent(
        message,
        diagnosis,
        plan,
        expertDraft,
        criticReview
      );
    }

    const finalDraft = repairedDraft || expertDraft;

    const workflow = buildWorkflow({
      diagnosis,
      plan,
      expertDraft,
      criticReview,
      repairedDraft,
    });

    const workflowSummary = workflowToText(workflow);

    const finalReply = await supervisorAgent({
      message,
      diagnosis,
      plan,
      finalDraft,
      criticReview,
      workflowSummary,
      wasRepaired: needsRepair,
    });

    return Response.json({
      reply: finalReply,
      workflow,
      agents: {
        diagnosis,
        planner: plan,
        expert: expertDraft,
        critic: criticReview,
        supervisor: needsRepair
          ? "Supervisor użył wersji poprawionej po krytyce jakości."
          : "Supervisor zatwierdził i zsyntetyzował odpowiedź bez etapu naprawy.",
      },
      meta: "SUPERVISOR_STRICT_WORKFLOW_OK",
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
