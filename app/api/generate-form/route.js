import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { description } = await req.json();
    console.log("Received description:", description);

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = "gemini-2.5-flash";
    const config = { responseModalities: ["TEXT"] };

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `Description: ${description}. On the basis of description please give user-facing form for participants to fill out in JSON format with form title, form subheading, along with fieldName, fieldTitle, fieldType, placeholder, label, required fields.`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    console.log("Gemini raw response:", JSON.stringify(response, null, 2));

    let text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    text = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.warn("Failed to parse JSON, falling back. Raw text:", text);
      parsed = { error: "Invalid JSON", raw: text };
    }

    return NextResponse.json({ form: parsed });
  } catch (error) {
    console.error("Error generating form:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
