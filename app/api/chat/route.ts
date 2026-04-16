import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

async function intentAgent(message: string) {
  return runAgent(
    `Jesteś agentem diagnozy.
Twoje zadanie:
1. Rozpoznaj, czego użytkownik naprawdę chce.
2. Uporządkuj jego intencję.
3. Wskaż, czy potrzebuje:
- informacji,
- planu działania,
- decyzji,
- analizy problemu,
- wsparcia emocjonalnego,
- kreatywnego pomysłu.

Odpowiedz po polsku, krótko i konkretnie.
Format:
INTENCJA: ...
POTRZEBA: ...
TON: ...`,
    message
  );
}

async function expertAgent(message: string, intentAnalysis: string) {
  return runAgent(
    `Jesteś głównym agentem eksperckim.
Masz dawać trafne, praktyczne, konkretne odpowiedzi po polsku.
Nie lej wody.
Jeśli pytanie jest niejasne, zrób najbardziej rozsądne założenie i odpowiedz użytecznie.
Uwzględnij analizę intencji od innego agenta.`,
    `Wiadomość użytkownika:
${message}

Analiza intencji:
${intentAnalysis}

Przygotuj najlepszą merytoryczną odpowiedź dla użytkownika.`
  );
}

async function criticAgent(message: string, draftAnswer: string) {
  return runAgent(
    `Jesteś agentem kontroli jakości.
Sprawdzasz odpowiedź innego agenta.

Masz ocenić:
1. Czy odpowiedź naprawdę odpowiada na pytanie użytkownika.
2. Czy jest logiczna.
3. Czy jest konkretna.
4. Czy nie brzmi zbyt ogólnie.

Jeśli odpowiedź jest dobra, napisz:
WERDYKT: OK
UWAGI: brak

Jeśli słaba, napisz:
WERDYKT: POPRAW
UWAGI: ...`,
    `Pytanie użytkownika:
${message}

Odpowiedź do oceny:
${draftAnswer}`
  );
}

async function supervisorAgent(params: {
  message: string;
  intent: string;
  expertDraft: string;
  criticReview: string;
}) {
  const { message, intent, expertDraft, criticReview } = params;

  return runAgent(
    `Jesteś supervisorem wieloagentowego systemu AI.
Twoje zadanie:
- zebrać wyniki agentów,
- dopilnować spójności,
- dać użytkownikowi jedną finalną odpowiedź po polsku.

Zasady:
- odpowiedź ma być praktyczna i konkretna,
- bez pokazywania technicznego bałaganu,
- ale na końcu dodaj krótką sekcję:
"Jak pracowały agenty:"
i tam w 3 krótkich punktach opisz:
1. co wykrył agent intencji,
2. co zrobił agent ekspercki,
3. co sprawdził agent kontroli.

Jeśli agent kontroli zgłasza problem, popraw odpowiedź przed oddaniem użytkownikowi.`,
    `Wiadomość użytkownika:
${message}

Wynik agenta intencji:
${intent}

Wersja robocza agenta eksperckiego:
${expertDraft}

Ocena agenta kontroli:
${criticReview}

Przygotuj finalną odpowiedź dla użytkownika.`
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
          receivedKeys: Object.keys(body || {}),
        },
        { status: 400 }
      );
    }

    const intent = await intentAgent(message);
    const expertDraft = await expertAgent(message, intent);
    const criticReview = await criticAgent(message, expertDraft);
    const finalReply = await supervisorAgent({
      message,
      intent,
      expertDraft,
      criticReview,
    });

    return Response.json({
      reply: finalReply,
      agents: {
        intent,
        expert: expertDraft,
        critic: criticReview,
      },
      meta: "MULTI_AGENT_OK",
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
