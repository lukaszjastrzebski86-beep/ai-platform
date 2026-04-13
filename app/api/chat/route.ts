import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { reply: "Brak wiadomości do przetworzenia." },
        { status: 400 }
      );
    }

    const input = [
      {
        role: "system",
        content:
          "Jesteś pomocnym asystentem AI. Odpowiadasz po polsku, jasno, konkretnie i naturalnie. Pamiętasz kontekst rozmowy z tej sesji.",
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input,
    });

    const reply = response.output_text || "Brak odpowiedzi od modelu.";

    return Response.json({ reply });
  } catch (error: any) {
    console.error("OPENAI ERROR:", error);
    return Response.json(
      { reply: "Wystąpił błąd po stronie AI." },
      { status: 500 }
    );
  }
}
