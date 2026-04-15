import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractMessage(body: any): string {
  // Obsługa prostego formatu: { message: "..." }
  if (typeof body?.message === "string" && body.message.trim()) {
    return body.message.trim();
  }

  // Obsługa formatu chatowego: { messages: [{ role, content }, ...] }
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

async function mainAgent(message: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  });

  return res.choices[0]?.message?.content || "";
}

async function checkAgent(response: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Sprawdź czy odpowiedź ma sens. Odpowiedz tylko: OK albo ERROR",
      },
      { role: "user", content: response },
    ],
  });

  return res.choices[0]?.message?.content || "ERROR";
}

async function metaAgent(checkResult: string) {
  if (!checkResult) return "META_ERROR";
  if (checkResult.includes("OK")) return "ALL_GOOD";
  return "CHECK_FAILED";
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

    const mainResponse = await mainAgent(message);
    const checkResult = await checkAgent(mainResponse);
    const metaResult = await metaAgent(checkResult);

    return Response.json({
      reply: mainResponse,
      check: checkResult,
      meta: metaResult,
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
