+import { NextResponse } from "next/server";
+import { db } from "@/config";
+import { formResponses } from "@/config/schema";
+import moment from "moment";
+
+export async function POST(req) {
+  try {
+    const { formId, formData } = await req.json();
+
+    const result = await db.insert(formResponses).values({
+      formId: parseInt(formId),
+      jsonResponse: JSON.stringify(formData),
+      submittedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
+    });

+    return NextResponse.json({ success: true, id: result.insertId });
+  } catch (error) {
+    console.error("Error submitting form:", error);
+    return NextResponse.json({ error: error.message }, { status: 500 });
+  }
+}
+