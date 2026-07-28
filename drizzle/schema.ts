import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { double, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Trips ───────────────────────────────────────────────────────────────────
export const trips = mysqlTable("trips", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["planning", "active", "paused", "completed"]).default("planning").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  bannerColor: varchar("bannerColor", { length: 32 }).default("#1e3a5f"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;

// ─── Waypoints ────────────────────────────────────────────────────────────────
export const waypoints = mysqlTable("waypoints", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  lat: double("lat").notNull(),
  lng: double("lng").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  plannedDate: timestamp("plannedDate"),
  dateTbd: boolean("dateTbd").default(true).notNull(),
  notes: text("notes"),
  category: varchar("category", { length: 64 }).default("stop"),
  poiId: int("poiId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Waypoint = typeof waypoints.$inferSelect;
export type InsertWaypoint = typeof waypoints.$inferInsert;

// ─── Points of Interest ───────────────────────────────────────────────────────
export const pois = mysqlTable("pois", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["marina", "anchorage", "fuel_dock", "restaurant", "museum", "attraction"]).notNull(),
  lat: double("lat").notNull(),
  lng: double("lng").notNull(),
  address: text("address"),
  description: text("description"),
  phone: varchar("phone", { length: 32 }),
  website: varchar("website", { length: 512 }),
  rating: double("rating"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Poi = typeof pois.$inferSelect;
export type InsertPoi = typeof pois.$inferInsert;

// ─── Journal Entries ──────────────────────────────────────────────────────────
export const journalEntries = mysqlTable("journal_entries", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  waypointId: int("waypointId"),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  todoItems: json("todoItems").$type<{ id: string; text: string; done: boolean }[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

// ─── Vessel Profiles ──────────────────────────────────────────────────────────
export const vesselProfiles = mysqlTable("vessel_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  boatName: varchar("boatName", { length: 255 }),
  boatType: varchar("boatType", { length: 128 }),
  draft: double("draft"),           // feet
  airDraft: double("airDraft"),     // feet (bridge clearance)
  cruisingSpeed: double("cruisingSpeed"), // knots
  fuelRange: double("fuelRange"),   // nautical miles
  lengthOverall: double("lengthOverall"), // feet
  beam: double("beam"),             // feet
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VesselProfile = typeof vesselProfiles.$inferSelect;
export type InsertVesselProfile = typeof vesselProfiles.$inferInsert;
