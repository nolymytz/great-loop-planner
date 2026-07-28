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
- [x] Login/sign-up with Manus OAuth
- [x] Persistent session across devices (cloud sync)
- [x] Elegant landing page for unauthenticated users
- [x] Auth-gated pages with sign-in prompts

## Polish & Branding
- [x] App logo / anchor icon branding
- [x] Empty states for all major views
- [x] Responsive layout
- [x] Smooth transitions and hover effects
- [x] Vitest test suite (13 tests passing)

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
