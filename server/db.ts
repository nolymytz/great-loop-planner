import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, JournalEntry, Poi, Trip, VesselProfile, Waypoint,
  journalEntries, pois, trips, users, vesselProfiles, waypoints,
  type InsertJournalEntry, type InsertPoi, type InsertTrip,
  type InsertVesselProfile, type InsertWaypoint,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Trips ────────────────────────────────────────────────────────────────────
export async function getTripsByUserId(userId: number): Promise<Trip[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(trips).where(eq(trips.userId, userId)).orderBy(desc(trips.updatedAt));
}

export async function getTripById(id: number, userId: number): Promise<Trip | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(trips).where(and(eq(trips.id, id), eq(trips.userId, userId))).limit(1);
  return result[0];
}

export async function createTrip(data: InsertTrip): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(trips).values(data);
  return (result[0] as any).insertId;
}

export async function updateTrip(id: number, userId: number, data: Partial<InsertTrip>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(trips).set(data).where(and(eq(trips.id, id), eq(trips.userId, userId)));
}

export async function deleteTrip(id: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(waypoints).where(and(eq(waypoints.tripId, id), eq(waypoints.userId, userId)));
  await db.delete(journalEntries).where(and(eq(journalEntries.tripId, id), eq(journalEntries.userId, userId)));
  await db.delete(trips).where(and(eq(trips.id, id), eq(trips.userId, userId)));
}

// ─── Waypoints ────────────────────────────────────────────────────────────────
export async function getWaypointsByTripId(tripId: number, userId: number): Promise<Waypoint[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(waypoints)
    .where(and(eq(waypoints.tripId, tripId), eq(waypoints.userId, userId)))
    .orderBy(asc(waypoints.sortOrder));
}

export async function addWaypoint(data: InsertWaypoint): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db.select({ sortOrder: waypoints.sortOrder })
    .from(waypoints).where(eq(waypoints.tripId, data.tripId))
    .orderBy(desc(waypoints.sortOrder)).limit(1);
  const maxOrder = existing[0]?.sortOrder ?? -1;
  const result = await db.insert(waypoints).values({ ...data, sortOrder: maxOrder + 1 });
  return (result[0] as any).insertId;
}

export async function updateWaypoint(id: number, userId: number, data: Partial<InsertWaypoint>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(waypoints).set(data).where(and(eq(waypoints.id, id), eq(waypoints.userId, userId)));
}

export async function removeWaypoint(id: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(waypoints).where(and(eq(waypoints.id, id), eq(waypoints.userId, userId)));
}

export async function reorderWaypoints(tripId: number, userId: number, orderedIds: number[]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  for (let i = 0; i < orderedIds.length; i++) {
    await db.update(waypoints).set({ sortOrder: i })
      .where(and(eq(waypoints.id, orderedIds[i]), eq(waypoints.userId, userId), eq(waypoints.tripId, tripId)));
  }
}

// ─── POIs ─────────────────────────────────────────────────────────────────────
export async function getPois(category?: string): Promise<Poi[]> {
  const db = await getDb();
  if (!db) return [];
  if (category && category !== "all") {
    return db.select().from(pois).where(eq(pois.category, category as any)).limit(200);
  }
  return db.select().from(pois).limit(200);
}

export async function getPoiById(id: number): Promise<Poi | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pois).where(eq(pois.id, id)).limit(1);
  return result[0];
}

export async function seedPoisIfEmpty(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select({ id: pois.id }).from(pois).limit(1);
  if (existing.length > 0) return;
  const seed: InsertPoi[] = [
    // Marinas
    { name: "Annapolis City Dock", category: "marina", lat: 38.9784, lng: -76.4922, address: "1 Dock St, Annapolis, MD", description: "Historic downtown marina in the sailing capital of the US. Full amenities, walking distance to restaurants and shops.", phone: "410-263-7973", website: "https://www.annapolis.gov", rating: 4.7, tags: ["historic", "full-service", "downtown"] },
    { name: "Chicago Riverwalk Marina", category: "marina", lat: 41.8858, lng: -87.6298, address: "Chicago Riverwalk, Chicago, IL", description: "Urban marina in the heart of Chicago, perfect starting point for Great Loop southbound.", phone: "312-744-3370", rating: 4.5, tags: ["urban", "starting-point"] },
    { name: "Mackinac Island Marina", category: "marina", lat: 45.8492, lng: -84.6188, address: "Mackinac Island, MI", description: "Iconic destination marina on the car-free island. Reserve well in advance during peak season.", rating: 4.8, tags: ["iconic", "car-free", "historic"] },
    { name: "Charleston City Marina", category: "marina", lat: 32.7765, lng: -79.9311, address: "17 Lockwood Dr, Charleston, SC", description: "Premier marina in historic Charleston. Walking distance to the French Quarter and King Street.", phone: "843-723-5098", rating: 4.6, tags: ["historic", "full-service"] },
    { name: "Key West Bight Marina", category: "marina", lat: 24.5587, lng: -81.8036, address: "201 William St, Key West, FL", description: "Historic seaport marina in the heart of Key West. Lively atmosphere, great restaurants nearby.", phone: "305-809-3980", rating: 4.5, tags: ["historic", "lively", "florida-keys"] },
    { name: "Norfolk Waterside Marina", category: "marina", lat: 36.8468, lng: -76.2951, address: "333 Waterside Dr, Norfolk, VA", description: "Downtown Norfolk marina with easy access to the city's restaurants and museums.", rating: 4.3, tags: ["downtown", "chesapeake"] },
    { name: "Mobile Municipal Marina", category: "marina", lat: 30.6954, lng: -88.0431, address: "101 Bayfront Dr, Mobile, AL", description: "Gateway marina to the Gulf Coast. Great base for exploring Mobile Bay.", rating: 4.2, tags: ["gulf-coast", "gateway"] },
    // Anchorages
    { name: "Beaufort, NC Anchorage", category: "anchorage", lat: 34.7182, lng: -76.6640, address: "Beaufort, NC", description: "Beloved ICW anchorage with wild horses visible on nearby Shackleford Banks. Protected and scenic.", rating: 4.9, tags: ["scenic", "wild-horses", "icw"] },
    { name: "Hope Town Harbour", category: "anchorage", lat: 26.5418, lng: -76.9597, address: "Hope Town, Abaco, Bahamas", description: "Stunning anchorage with the iconic candy-striped lighthouse. A Bahamas Loop highlight.", rating: 5.0, tags: ["bahamas", "lighthouse", "iconic"] },
    { name: "Presque Isle Bay", category: "anchorage", lat: 42.1334, lng: -80.0851, address: "Erie, PA", description: "Well-protected anchorage on Lake Erie inside Presque Isle peninsula.", rating: 4.4, tags: ["lake-erie", "protected"] },
    { name: "Dismal Swamp Canal Anchorage", category: "anchorage", lat: 36.5318, lng: -76.3614, address: "South Mills, NC", description: "Unique and atmospheric anchorage in the historic Dismal Swamp Canal. Quiet and wildlife-rich.", rating: 4.3, tags: ["historic", "wildlife", "canal"] },
    // Fuel Docks
    { name: "Trawler Supply - Deltaville", category: "fuel_dock", lat: 37.5568, lng: -76.3285, address: "Deltaville, VA", description: "Well-stocked fuel dock on the Chesapeake Bay. Diesel and gas available.", rating: 4.5, tags: ["chesapeake", "diesel"] },
    { name: "Riviera Beach Marina Fuel", category: "fuel_dock", lat: 39.1670, lng: -76.5020, address: "Riviera Beach, MD", description: "Convenient fuel stop on the Patapsco River near Baltimore.", rating: 4.2, tags: ["chesapeake", "convenient"] },
    // Restaurants
    { name: "Middleton Tavern", category: "restaurant", lat: 38.9783, lng: -76.4914, address: "2 Market Space, Annapolis, MD", description: "America's oldest tavern, established 1750. Waterfront dining with colonial atmosphere and fresh Chesapeake seafood.", phone: "410-263-3323", website: "https://middletontavern.com", rating: 4.4, tags: ["historic", "seafood", "waterfront"] },
    { name: "Husk Charleston", category: "restaurant", lat: 32.7752, lng: -79.9371, address: "76 Queen St, Charleston, SC", description: "James Beard Award-winning Southern cuisine in a historic mansion. A must-visit in Charleston.", phone: "843-577-2500", website: "https://huskrestaurant.com", rating: 4.7, tags: ["award-winning", "southern", "historic"] },
    { name: "Sloppy Joe's Bar", category: "restaurant", lat: 24.5590, lng: -81.8040, address: "201 Duval St, Key West, FL", description: "Legendary Key West bar and restaurant, a Hemingway haunt since 1933. Cold drinks and good times.", phone: "305-294-5717", website: "https://sloppyjoes.com", rating: 4.3, tags: ["legendary", "hemingway", "key-west"] },
    { name: "Dooky Chase's Restaurant", category: "restaurant", lat: 29.9612, lng: -90.0798, address: "2301 Orleans Ave, New Orleans, LA", description: "Iconic New Orleans Creole restaurant. A cultural institution with legendary gumbo.", phone: "504-821-0600", rating: 4.6, tags: ["iconic", "creole", "new-orleans"] },
    { name: "The Twisted Rudder", category: "restaurant", lat: 34.7190, lng: -76.6618, address: "104 Middle Ln, Beaufort, NC", description: "Popular waterfront spot in Beaufort, NC. Fresh local seafood and a lively atmosphere.", rating: 4.5, tags: ["waterfront", "seafood", "icw"] },
    // Museums
    { name: "Mystic Seaport Museum", category: "museum", lat: 41.3618, lng: -71.9637, address: "75 Greenmanville Ave, Mystic, CT", description: "The nation's leading maritime museum. Historic ships, a recreated 19th-century village, and world-class collections.", phone: "860-572-0711", website: "https://www.mysticseaport.org", rating: 4.8, tags: ["maritime", "historic-ships", "world-class"] },
    { name: "National Naval Aviation Museum", category: "museum", lat: 30.3520, lng: -87.3098, address: "1750 Radford Blvd, Pensacola, FL", description: "One of the world's largest naval aviation museums with over 150 aircraft. Free admission.", phone: "850-452-3604", website: "https://www.navalaviationmuseum.org", rating: 4.9, tags: ["free", "aviation", "military"] },
    { name: "Erie Maritime Museum", category: "museum", lat: 42.1307, lng: -80.0845, address: "150 E Front St, Erie, PA", description: "Home of the US Brig Niagara, flagship of the Battle of Lake Erie. Excellent Great Lakes history.", phone: "814-452-2744", rating: 4.6, tags: ["lake-erie", "historic-ships", "battle-of-lake-erie"] },
    { name: "The Mariners' Museum", category: "museum", lat: 37.0469, lng: -76.4900, address: "100 Museum Dr, Newport News, VA", description: "World-class maritime museum housing the recovered USS Monitor turret and extensive collections.", phone: "757-596-2222", website: "https://www.marinersmuseum.org", rating: 4.7, tags: ["uss-monitor", "chesapeake", "world-class"] },
    // Attractions
    { name: "Mackinac Island State Park", category: "attraction", lat: 45.8617, lng: -84.6189, address: "Mackinac Island, MI", description: "80% of the island is state park. No cars allowed — explore by bicycle or horse-drawn carriage. Stunning views of the Straits.", rating: 4.9, tags: ["no-cars", "cycling", "great-lakes", "iconic"] },
    { name: "Soo Locks", category: "attraction", lat: 46.5026, lng: -84.3469, address: "Sault Ste. Marie, MI", description: "Engineering marvel connecting Lake Superior to Lake Huron. Watch massive freighters lock through from the observation deck.", rating: 4.7, tags: ["locks", "engineering", "great-lakes"] },
    { name: "Cape Hatteras Lighthouse", category: "attraction", lat: 35.2505, lng: -75.5277, address: "Cape Hatteras, NC", description: "The tallest brick lighthouse in the US at 198 feet. Iconic black-and-white spiral pattern. Climb to the top for panoramic views.", rating: 4.8, tags: ["lighthouse", "iconic", "outer-banks"] },
    { name: "Everglades National Park", category: "attraction", lat: 25.2866, lng: -80.8987, address: "40001 State Road 9336, Homestead, FL", description: "The largest tropical wilderness in the US. Incredible wildlife including manatees, alligators, and rare birds.", rating: 4.8, tags: ["wildlife", "tropical", "national-park"] },
    { name: "French Quarter, New Orleans", category: "attraction", lat: 29.9584, lng: -90.0644, address: "French Quarter, New Orleans, LA", description: "The historic heart of New Orleans. Jazz music, Creole architecture, world-class food, and vibrant nightlife.", rating: 4.8, tags: ["historic", "jazz", "food", "nightlife"] },
  ];
  await db.insert(pois).values(seed);
}

// ─── Journal Entries ──────────────────────────────────────────────────────────
export async function getJournalEntriesByTrip(tripId: number, userId: number): Promise<JournalEntry[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(journalEntries)
    .where(and(eq(journalEntries.tripId, tripId), eq(journalEntries.userId, userId)))
    .orderBy(desc(journalEntries.updatedAt));
}

export async function getJournalEntriesByWaypoint(waypointId: number, userId: number): Promise<JournalEntry[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(journalEntries)
    .where(and(eq(journalEntries.waypointId, waypointId), eq(journalEntries.userId, userId)))
    .orderBy(desc(journalEntries.updatedAt));
}

export async function createJournalEntry(data: InsertJournalEntry): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(journalEntries).values(data);
  return (result[0] as any).insertId;
}

export async function updateJournalEntry(id: number, userId: number, data: Partial<InsertJournalEntry>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(journalEntries).set(data).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
}

export async function deleteJournalEntry(id: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(journalEntries).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
}

// ─── Vessel Profiles ──────────────────────────────────────────────────────────
export async function getVesselProfile(userId: number): Promise<VesselProfile | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vesselProfiles).where(eq(vesselProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function upsertVesselProfile(userId: number, data: Partial<InsertVesselProfile>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(vesselProfiles)
    .values({ ...data, userId })
    .onDuplicateKeyUpdate({ set: data });
}
