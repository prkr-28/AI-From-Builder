import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { description } = await req.json();
    console.log("Received description:", description);

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = "gemini-2.0-flash-exp";
    const config = { responseModalities: ["TEXT"] };

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `Create a form based on this description: "${description}". 

Return ONLY a valid JSON object with this exact structure:
{
  "formTitle": "Form Title Here",
  "formSubheading": "Form description here",
  "fields": [
    {
      "fieldName": "unique_field_name",
      "fieldType": "text|email|number|tel|textarea|select|radio|checkbox|date",
      "label": "Field Label",
      "placeholder": "Placeholder text",
      "required": true|false,
      "options": [{"label": "Option 1", "value": "option1"}] // only for select, radio, checkbox
    }
  ]
}

Make sure to:
- Use appropriate field types for the data being collected
- Include relevant validation (required fields)
- Create meaningful labels and placeholders
- For select/radio/checkbox fields, provide realistic options
- Return ONLY the JSON, no other text`,
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
      // Fallback form structure
      parsed = {
        formTitle: "Contact Form",
        formSubheading: "Please fill out this form",
        fields: [
          {
            fieldName: "name",
            fieldType: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true
          },
          {
            fieldName: "email",
            fieldType: "email", 
            label: "Email Address",
            placeholder: "Enter your email",
            required: true
          },
          {
            fieldName: "message",
            fieldType: "textarea",
            label: "Message",
            placeholder: "Enter your message",
            required: false
          }
        ]
      };
    }

    return NextResponse.json({ form: parsed });
  } catch (error) {
    console.error("Error generating form:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}