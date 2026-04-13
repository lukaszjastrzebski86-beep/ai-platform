import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body); // 🔥 debug

    const messages = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { reply: "Błąd: brak wiadomości (messages)." },
        { status: 400 }
      );
    }

    const input = [
      {
        role: "system",
        content:
          "Jesteś konkretnym, inteligentnym asystentem. Odpowiadasz jasno, bez pierdolenia, po polsku.",
      },
      ...messages,
    ];

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input,
    });

    const reply =
      response.output_text || "Brak odpowiedzi od modelu.";

    return Response.json({ reply });
  } catch (error: any) {
    console.error("OPENAI ERROR:", error);

    return Response.json(
      {
        reply:
          error?.message ||
          "Wystąpił błąd po stronie AI.",
      },
      { status: 500 }
    );
  }
}
