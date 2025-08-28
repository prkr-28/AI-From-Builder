import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import { writeFile } from "fs";

// To run this code you need to install the following dependencies:
// npm install @google/genai mime

import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import { writeFile } from "fs";

function saveBinaryFile(fileName, content) {
  writeFile(fileName, content, "utf8", (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    responseModalities: ["IMAGE", "TEXT"],
  };

  const model = "gemini-2.5-flash-image-preview";

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Description: Student registration for coding workshop on React & react native , On the basis of description please give form in json format with form title, form subheading, Form field, form name, placeholder name, and form label, In Json format`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `\`\`\`json
{
  "form_title": "Coding Workshop Registration",
  "form_subheading": "Mastering React & React Native",
  "form_fields": [
    {
      "field_type": "text",
      "field_name": "full_name",
      "label": "Full Name",
      "placeholder": "Enter your full name"
    },
    {
      "field_type": "email",
      "field_name": "email_address",
      "label": "Email Address",
      "placeholder": "Enter your email address"
    },
    {
      "field_type": "tel",
      "field_name": "phone_number",
      "label": "Phone Number",
      "placeholder": "Enter your phone number (optional)"
    },
    {
      "field_type": "select",
      "field_name": "workshop_preference",
      "label": "Which workshop are you interested in?",
      "options": [
        {"value": "react", "label": "React"},
        {"value": "react_native", "label": "React Native"},
        {"value": "both", "label": "Both React & React Native"}
      ]
    },
    {
      "field_type": "textarea",
      "field_name": "experience_level",
      "label": "Tell us about your coding experience (optional)",
      "placeholder": "e.g., Beginner, Intermediate, Advanced, etc."
    },
    {
      "field_type": "checkbox",
      "field_name": "newsletter_signup",
      "label": "Subscribe to our newsletter for future workshop updates"
    }
  ],
  "submit_button_text": "Register Now"
}
\`\`\``,
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fileIndex = 0;
  for await (const chunk of response) {
    if (
      !chunk.candidates ||
      !chunk.candidates[0].content ||
      !chunk.candidates[0].content.parts
    ) {
      continue;
    }

    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const fileName = `ENTER_FILE_NAME_${fileIndex++}`;
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      const fileExtension = mime.getExtension(inlineData.mimeType || "");
      const buffer = Buffer.from(inlineData.data || "", "base64");
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    } else {
      console.log(chunk.text);
    }
  }
}

main();
