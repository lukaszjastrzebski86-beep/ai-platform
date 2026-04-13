import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    input: message,
  });

  return Response.json({
    reply: response.output_text,
  });
}
