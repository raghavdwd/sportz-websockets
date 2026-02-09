import express from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches.js";
import { db } from "../../drizzle/config.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";

export const matchRouter = express.Router();

const MAX_LIMIT = 100; // Maximum number of matches to return in the list endpoint

// Define routes for matches
matchRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }
  console.log("Parsed query parameters:", parsed.data);

  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT); // Limit to a maximum of 100

  try {
    const data = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);
    res.json({ data });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

matchRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }
  console.log("Parsed match data:", parsed.data);

  const { startTime, endTime } = parsed.data;

  try {
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: 0,
        awayScore: 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    console.log("Created match event:", event);
    res.status(201).json({ data: event });
  } catch (error) {
    console.error("Error creating match:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});
