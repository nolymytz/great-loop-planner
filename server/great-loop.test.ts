import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: { name: string; options: Record<string, unknown> }[] } {
  const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-openid",
    email: "test@example.com",
    name: "Test Looper",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

// Mock the db module so tests don't need a real database
vi.mock("./db", () => ({
  getTripsByUserId: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, name: "My Great Loop 2027", description: "The big adventure", status: "planning", bannerColor: "#1e3a5f", createdAt: new Date(), updatedAt: new Date() },
  ]),
  getTripById: vi.fn().mockImplementation(async (id: number) => {
    if (id === 1) return { id: 1, userId: 1, name: "My Great Loop 2027", status: "planning", bannerColor: "#1e3a5f", createdAt: new Date(), updatedAt: new Date() };
    return undefined;
  }),
  createTrip: vi.fn().mockResolvedValue(42),
  updateTrip: vi.fn().mockResolvedValue(undefined),
  deleteTrip: vi.fn().mockResolvedValue(undefined),
  getWaypointsByTripId: vi.fn().mockResolvedValue([
    { id: 1, tripId: 1, userId: 1, name: "Annapolis", lat: 38.9784, lng: -76.4922, sortOrder: 0, dateTbd: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, tripId: 1, userId: 1, name: "Norfolk", lat: 36.8468, lng: -76.2951, sortOrder: 1, dateTbd: true, createdAt: new Date(), updatedAt: new Date() },
  ]),
  addWaypoint: vi.fn().mockResolvedValue(99),
  updateWaypoint: vi.fn().mockResolvedValue(undefined),
  removeWaypoint: vi.fn().mockResolvedValue(undefined),
  reorderWaypoints: vi.fn().mockResolvedValue(undefined),
  getPois: vi.fn().mockResolvedValue([]),
  getPoiById: vi.fn().mockResolvedValue(undefined),
  seedPoisIfEmpty: vi.fn().mockResolvedValue(undefined),
  getJournalEntriesByTrip: vi.fn().mockResolvedValue([]),
  getJournalEntriesByWaypoint: vi.fn().mockResolvedValue([]),
  createJournalEntry: vi.fn().mockResolvedValue(10),
  updateJournalEntry: vi.fn().mockResolvedValue(undefined),
  deleteJournalEntry: vi.fn().mockResolvedValue(undefined),
  getVesselProfile: vi.fn().mockResolvedValue({
    id: 1, userId: 1, boatName: "Sea Wanderer", boatType: "Trawler",
    draft: 3.5, airDraft: 15.5, cruisingSpeed: 8, fuelRange: 400,
    lengthOverall: 42, beam: 14, createdAt: new Date(), updatedAt: new Date(),
  }),
  upsertVesselProfile: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
  });
});

describe("trips router", () => {
  it("lists trips for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const trips = await caller.trips.list();
    expect(Array.isArray(trips)).toBe(true);
    expect(trips[0]?.name).toBe("My Great Loop 2027");
  });

  it("gets a trip by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const trip = await caller.trips.get({ id: 1 });
    expect(trip.id).toBe(1);
    expect(trip.name).toBe("My Great Loop 2027");
  });

  it("throws NOT_FOUND for unknown trip id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.trips.get({ id: 999 })).rejects.toThrow();
  });

  it("creates a trip and returns an id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.trips.create({ name: "Test Trip", description: "A test voyage" });
    expect(result.id).toBe(42);
  });

  it("updates a trip", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.trips.update({ id: 1, name: "Updated Name", status: "active" });
    expect(result.success).toBe(true);
  });

  it("deletes a trip", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.trips.delete({ id: 1 });
    expect(result.success).toBe(true);
  });
});

describe("waypoints router", () => {
  it("lists waypoints for a trip", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const wps = await caller.waypoints.list({ tripId: 1 });
    expect(wps).toHaveLength(2);
    expect(wps[0]?.name).toBe("Annapolis");
  });

  it("adds a waypoint", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.waypoints.add({ tripId: 1, name: "Charleston", lat: 32.7765, lng: -79.9311 });
    expect(result.id).toBe(99);
  });

  it("removes a waypoint", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.waypoints.remove({ id: 1 });
    expect(result.success).toBe(true);
  });
});

describe("vessel router", () => {
  it("gets vessel profile", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const vessel = await caller.vessel.get();
    expect(vessel?.boatName).toBe("Sea Wanderer");
    expect(vessel?.draft).toBe(3.5);
    expect(vessel?.airDraft).toBe(15.5);
    expect(vessel?.cruisingSpeed).toBe(8);
    expect(vessel?.fuelRange).toBe(400);
  });

  it("upserts vessel profile", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.vessel.upsert({ boatName: "New Boat", draft: 4.0, cruisingSpeed: 10 });
    expect(result.success).toBe(true);
  });
});
