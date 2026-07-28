import { pgTable, pgEnum, serial, text, varchar, timestamp, doublePrecision, boolean, jsonb, integer } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 16 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Trips ───────────────────────────────────────────────────────────────────
export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 32 }).default("planning").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  bannerColor: varchar("bannerColor", { length: 32 }).default("#1e3a5f"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;

// ─── Waypoints ────────────────────────────────────────────────────────────────
export const waypoints = pgTable("waypoints", {
  id: serial("id").primaryKey(),
  tripId: integer("tripId").notNull(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  plannedDate: timestamp("plannedDate"),
  dateTbd: boolean("dateTbd").default(true).notNull(),
  notes: text("notes"),
  category: varchar("category", { length: 64 }).default("stop"),
  poiId: integer("poiId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Waypoint = typeof waypoints.$inferSelect;
export type InsertWaypoint = typeof waypoints.$inferInsert;

// ─── Points of Interest ───────────────────────────────────────────────────────
export const pois = pgTable("pois", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  address: text("address"),
  description: text("description"),
  phone: varchar("phone", { length: 32 }),
  website: varchar("website", { length: 512 }),
  rating: doublePrecision("rating"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Poi = typeof pois.$inferSelect;
export type InsertPoi = typeof pois.$inferInsert;

// ─── Journal Entries ──────────────────────────────────────────────────────────
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  tripId: integer("tripId").notNull(),
  waypointId: integer("waypointId"),
  userId: integer("userId").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  todoItems: jsonb("todoItems").$type<{ id: string; text: string; done: boolean }[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

// ─── Vessel Profiles ──────────────────────────────────────────────────────────
export const vesselProfiles = pgTable("vessel_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(),
  boatName: varchar("boatName", { length: 255 }),
  boatType: varchar("boatType", { length: 128 }),
  draft: doublePrecision("draft"),
  airDraft: doublePrecision("airDraft"),
  cruisingSpeed: doublePrecision("cruisingSpeed"),
  fuelRange: doublePrecision("fuelRange"),
  lengthOverall: doublePrecision("lengthOverall"),
  beam: doublePrecision("beam"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type VesselProfile = typeof vesselProfiles.$inferSelect;
export type InsertVesselProfile = typeof vesselProfiles.$inferInsert;
