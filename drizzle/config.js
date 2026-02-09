import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(client);
export const runMigrations = async () => {
  await client.connect();
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  await client.end();
};
