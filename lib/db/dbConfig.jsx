import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(
  process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_nQK9WsyERt3b@ep-wild-brook-a84ljxyy-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
);
export const db = drizzle(sql, { schema });

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("Database connected:", result);
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}

// Call test on init
testConnection().then((connected) => {
  if (connected) {
    console.log("Database ready to accept connections");
  } else {
    console.error("Failed to connect to database");
  }
});
