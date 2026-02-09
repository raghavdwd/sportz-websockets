import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  pgEnum,
  jsonb,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Match status enum: scheduled, live, finished
export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

// Matches table
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  sport: varchar("sport", { length: 100 }).notNull(),
  homeTeam: varchar("home_team", { length: 256 }).notNull(),
  awayTeam: varchar("away_team", { length: 256 }).notNull(),
  status: matchStatusEnum("status").default("scheduled").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  homeScore: integer("home_score").default(0).notNull(),
  awayScore: integer("away_score").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});

// Commentary table
export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .references(() => matches.id)
    .notNull(),
  minute: integer("minute"),
  sequence: integer("sequence").notNull(),
  period: varchar("period", { length: 50 }), // e.g., "1st Half", "Q1"
  eventType: varchar("event_type", { length: 100 }).notNull(),
  actor: varchar("actor", { length: 256 }), // The player or person involved
  team: varchar("team", { length: 256 }),
  message: text("message").notNull(),
  metadata: jsonb("metadata").default({}),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});
