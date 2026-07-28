import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Trips ────────────────────────────────────────────────────────────────
  trips: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getTripsByUserId(ctx.user.id);
    }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const trip = await db.getTripById(input.id, ctx.user.id);
        if (!trip) throw new TRPCError({ code: "NOT_FOUND" });
        return trip;
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        bannerColor: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createTrip({ ...input, userId: ctx.user.id });
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        status: z.enum(["planning", "active", "paused", "completed"]).optional(),
        startDate: z.date().optional().nullable(),
        endDate: z.date().optional().nullable(),
        bannerColor: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateTrip(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteTrip(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ─── Waypoints ────────────────────────────────────────────────────────────
  waypoints: router({
    list: protectedProcedure
      .input(z.object({ tripId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getWaypointsByTripId(input.tripId, ctx.user.id);
      }),
    add: protectedProcedure
      .input(z.object({
        tripId: z.number(),
        name: z.string().min(1).max(255),
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
        notes: z.string().optional(),
        category: z.string().optional(),
        poiId: z.number().optional(),
        plannedDate: z.date().optional().nullable(),
        dateTbd: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.addWaypoint({ ...input, userId: ctx.user.id });
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        notes: z.string().optional(),
        plannedDate: z.date().optional().nullable(),
        dateTbd: z.boolean().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        address: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateWaypoint(id, ctx.user.id, data);
        return { success: true };
      }),
    remove: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeWaypoint(input.id, ctx.user.id);
        return { success: true };
      }),
    reorder: protectedProcedure
      .input(z.object({
        tripId: z.number(),
        orderedIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.reorderWaypoints(input.tripId, ctx.user.id, input.orderedIds);
        return { success: true };
      }),
  }),

  // ─── POIs ─────────────────────────────────────────────────────────────────
  pois: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => {
        await db.seedPoisIfEmpty();
        return db.getPois(input.category);
      }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const poi = await db.getPoiById(input.id);
        if (!poi) throw new TRPCError({ code: "NOT_FOUND" });
        return poi;
      }),
  }),

  // ─── Journal ──────────────────────────────────────────────────────────────
  journal: router({
    listByTrip: protectedProcedure
      .input(z.object({ tripId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getJournalEntriesByTrip(input.tripId, ctx.user.id);
      }),
    listByWaypoint: protectedProcedure
      .input(z.object({ waypointId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getJournalEntriesByWaypoint(input.waypointId, ctx.user.id);
      }),
    create: protectedProcedure
      .input(z.object({
        tripId: z.number(),
        waypointId: z.number().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        todoItems: z.array(z.object({ id: z.string(), text: z.string(), done: z.boolean() })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createJournalEntry({ ...input, userId: ctx.user.id });
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        todoItems: z.array(z.object({ id: z.string(), text: z.string(), done: z.boolean() })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateJournalEntry(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteJournalEntry(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ─── Vessel Profile ───────────────────────────────────────────────────────
  vessel: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getVesselProfile(ctx.user.id);
    }),
    upsert: protectedProcedure
      .input(z.object({
        boatName: z.string().optional(),
        boatType: z.string().optional(),
        draft: z.number().optional().nullable(),
        airDraft: z.number().optional().nullable(),
        cruisingSpeed: z.number().optional().nullable(),
        fuelRange: z.number().optional().nullable(),
        lengthOverall: z.number().optional().nullable(),
        beam: z.number().optional().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertVesselProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
