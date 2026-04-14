import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function mainAgent(message) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  });

  return res.choices[0]?.message?.content || "";
}

async function checkAgent(response) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Sprawdź czy odpowiedź ma sens. Odpowiedz tylko: OK albo ERROR",
      },
      { role: "user", content: response },
    ],
  });

  return res.choices[0]?.message?.content || "ERROR";
}

async function metaAgent(checkResult) {
  if (!checkResult) return "META_ERROR";

  if (checkResult.includes("OK")) return "ALL_GOOD";

  return "CHECK_FAILED";
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    // 1. main agent
    const mainResponse = await mainAgent(message);

    // 2. check agent
    const checkResult = await checkAgent(mainResponse);

    // 3. meta agent
    const metaResult = await metaAgent(checkResult);

    return Response.json({
      reply: mainResponse,
      check: checkResult,
      meta: metaResult,
    });
  } catch (err) {
    return Response.json({
      error: "SYSTEM_CRASH",
      details: err.message,
    });
  }
}
