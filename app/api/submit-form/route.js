import { NextResponse } from "next/server";
import { db } from "@/config";
import { formResponses } from "@/config/schema";
import moment from "moment";

export async function POST(req) {
  try {
    const { formId, formData } = await req.json();

    if (!formId || !formData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await db.insert(formResponses).values({
      formId: parseInt(formId),
      jsonResponse: JSON.stringify(formData),
      submittedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    return NextResponse.json({ success: true, message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}