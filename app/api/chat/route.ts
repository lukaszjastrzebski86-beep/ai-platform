import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { reply: "Brakuje wiadomości." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content: "Jesteś pomocnym asystentem AI. Odpowiadasz po polsku, jasno i konkretnie."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.output_text || "Brak odpowiedzi od modelu.";

    return Response.json({ reply });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { reply: "Wystąpił błąd po stronie AI." },
      { status: 500 }
    );
  }
}
