import { pgTable, serial, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  jsonform: text("jsonform").notNull(),
  theme: text("theme").default("default"),
  background: varchar("background").default("white"),
  enabledFields: text("enabled_fields"),
  createdBy: varchar("created_by").notNull(),
  createdAt: varchar("created_at").notNull(),
  updatedAt: varchar("updated_at"),
});

export const formResponses = pgTable("form_responses", {
  id: serial("id").primaryKey(),
  formId: serial("form_id").references(() => forms.id),
  jsonResponse: text("json_response").notNull(),
  submittedAt: varchar("submitted_at").notNull(),
});
