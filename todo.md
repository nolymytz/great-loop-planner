# Great Loop Planner — TODO

## Design System & Foundation
- [x] Set up elegant design system: deep navy palette, Playfair Display + Inter typography
- [x] Configure global CSS variables, fonts, and Tailwind theme
- [x] Create app shell with top navigation and layout structure

## Database Schema
- [x] trips table: id, userId, name, description, status, startDate, endDate, bannerColor
- [x] waypoints table: id, tripId, name, lat, lng, address, sortOrder, plannedDate, dateTbd, notes, poiId
- [x] pois table: id, name, category, lat, lng, address, description, phone, website, rating, tags
- [x] journal_entries table: id, waypointId, tripId, userId, title, content, todoItems
- [x] vessel_profiles table: id, userId, boatName, boatType, draft, airDraft, cruisingSpeed, fuelRange, lengthOverall, beam

## tRPC Routers
- [x] trips router: list, get, create, update, delete
- [x] waypoints router: list, add, update, remove, reorder
- [x] pois router: list (with category filter), get, seedPoisIfEmpty
- [x] journal router: listByTrip, listByWaypoint, create, update, delete
- [x] vessel router: get, upsert

## Map & Route Display
- [x] Interactive map centered on Great Loop route (eastern US)
- [x] Primary Great Loop route polyline highlighted (blue)
- [x] Alternate routes: Champlain Canal (purple), Lower Mississippi (amber), Trent-Severn (green)
- [x] Route legend on map
- [x] Waypoint markers on map with numbered pins and click-to-select
- [x] POI markers with emoji category icons

## Itinerary Sidebar Panel
- [x] Collapsible sidebar with ordered list of waypoints
- [x] Per-leg distance (nautical miles) and estimated travel time
- [x] Trip summary totals (total nmi, total underway hours)
- [x] Date assignment per waypoint (or mark TBD)
- [x] Add waypoints by clicking map (with geocoding)
- [x] Remove waypoints from sidebar
- [ ] Drag-to-reorder waypoints (future enhancement)

## POI Discovery
- [x] Category filter bar: Marinas, Anchorages, Fuel Docks, Restaurants, Museums, Attractions
- [x] POI markers on map filtered by category
- [x] POI detail panel with rating, address, phone, website, tags
- [x] "Add to Trip" button on POI detail view
- [x] Seed database with 25+ curated Great Loop POIs

## Trip Journal & Notes
- [x] Journal entry creation per waypoint
- [x] Notes field per waypoint
- [x] To-do list per journal entry (add, toggle done)
- [x] Journal entries list view per waypoint

## Vessel Profile
- [x] Vessel profile form: boat name, boat type, draft, air draft/bridge clearance, cruising speed, fuel range, length overall, beam
- [x] Save vessel profile per user account
- [x] Display vessel profile in settings page

## Multi-Trip Management
- [x] Trip list/dashboard page with trip cards
- [x] Create new trip dialog with name, description, banner color
- [x] Trip status: Planning, Active, Paused, Completed
- [x] Delete trips
- [x] Open trip in planner

## Authentication & User Flow
- [x] Login/sign-up with Supabase Auth (email + password)
- [x] Persistent session across devices (cloud sync via Supabase)
  - [x] Elegant landing page for unauthenticated users
  - [x] Auth-gated pages with sign-in prompts

## Polish & Branding
- [x] App logo / anchor icon branding
- [x] Empty states for all major views
- [x] Responsive layout
- [x] Smooth transitions and hover effects
- [x] Vitest test suite (13 tests passing)
- [x] Redesign: Sea Mist design system (glassmorphism nav, Playfair Display + JetBrains Mono)
- [x] Redesign: Landing page — hero, stats bar, Tactical Suite cards, telemetry section, CTA
- [x] Redesign: AppNav with glassmorphism top bar and JetBrains Mono typography
- [x] Redesign: TripsPage with cockpit dashboard sidebar layout and premium trip cards
- [x] Redesign: SettingsPage with technical instrument-style form fields
## Supabase Migration (completed)
- [x] Supabase PostgreSQL database created (project: idfsanqtjyrmuqqxwasz, us-east-1)
- [x] All 9 tables with Row Level Security (users, trips, waypoints, pois, journal_entries, vessel_profiles, maintenance_tasks, wishlist_items, dream_boats)
- [x] supabase.ts client singleton + all TypeScript types
- [x] AuthContext.tsx — Supabase Auth (signIn, signUp, signOut, user, isAuthenticated)
- [x] AuthPage.tsx — sign in / sign up page
- [x] AppLayout.tsx — Supabase-native sidebar layout with all 10 nav items
- [x] AppNav.tsx — Supabase Auth, removed tRPC/Manus
- [x] CreateTripDialog.tsx — Supabase insert, removed tRPC
- [x] TripsPage.tsx — Supabase queries, removed tRPC
- [x] SettingsPage.tsx — Supabase vessel_profiles upsert, removed tRPC
- [x] PlannerPage.tsx — Supabase queries for trips/waypoints/pois/vessel, removed tRPC
- [x] WaypointDetailPanel.tsx — Supabase journal_entries + waypoints, removed tRPC
- [x] PoiDetailPanel.tsx — Supabase waypoints insert, removed tRPC
- [x] Home.tsx — Supabase AuthContext, Link to /auth, removed Manus OAuth
- [x] New pages: FuelCalcPage, WeatherPage, CommunityPage, MaintenancePage, LogbookPage, MarinasPage, DreamBoatPage, WishlistPage

## Future Enhancements
- [ ] Drag-to-reorder waypoints in sidebar (v2)
- [ ] Trip date range picker (v2)
- [ ] Export itinerary as PDF (v2)
- [ ] Weather integration at waypoints (v2)
- [ ] Fuel range overlay on map (v2)
- [ ] Bridge clearance warnings based on air draft (v2)
- [ ] Mobile app (iOS/Android via Expo) (v2)
- [ ] Shared trip view (read-only link) (v2)
- [ ] Community POI contributions (v2)
- [ ] Boat services directory: searchable listings for boatyards, mechanics, riggers, canvas/upholstery, diesel/outboard specialists, and marine electricians along the Great Loop — with reviews, contact info, specialties, and "Add to Trip" for scheduling haul-outs or repairs at a stop (v2)
- [ ] Marina real-time availability portal: marina-facing dashboard where marinas can submit and update live slip/mooring/anchorage availability, transient rates, amenities, and wait times — displayed to cruisers on the map and POI detail panels with a "last updated" timestamp (v2)
- [ ] "Places I'd Like to Visit" wishlist board — pre-trip bucket list of destinations, separate from the active itinerary (v2)
- [ ] "Things I'd Like to Do" activity wishlist — experiences, events, and activities to consider along the route (v2)
- [ ] "Boat Must-Haves" gear and equipment checklist — provisioning, safety gear, and upgrades to complete before departure (v2)
- [ ] DockTails — social feature for loopers in the same area to connect and organize dock cocktail hours, card games, and casual gatherings; includes location-based discovery of nearby loopers, event creation, RSVP, and in-app messaging (v2)
- [ ] YouTube Location Tags — tag marinas, anchorages, and attractions with linked YouTube videos from loopers and cruising YouTubers who visited; searchable by location with embedded video previews in the POI detail panel, and the ability for users to submit video links (v2)
