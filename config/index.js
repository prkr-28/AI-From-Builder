import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://neondb_owner:npg_aDot4n5PwSRG@ep-holy-sky-adgo3ev5-pooler.c-2.us-east-1.aws.neon.tech/AI-From-Builder?sslmode=require&channel_binding=require"
);
export const db = drizzle({ client: sql, schema });
