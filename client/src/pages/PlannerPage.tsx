import { useRef, useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { MapView } from "@/components/Map";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Anchor, ChevronLeft, ChevronRight, Plus, Trash2, GripVertical, Calendar, StickyNote, X, Star, Phone, Globe, MapPin, Navigation, Fuel, Utensils, Building2, Binoculars, BookOpen, ChevronDown } from "lucide-react";
import { CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import { POI_CATEGORIES } from "@shared/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { WaypointDetailPanel } from "@/components/WaypointDetailPanel";
import { PoiDetailPanel } from "@/components/PoiDetailPanel";

// Great Loop route coordinates (simplified key waypoints)
const GREAT_LOOP_PRIMARY: google.maps.LatLngLiteral[] = [
  { lat: 41.8858, lng: -87.6298 },  // Chicago
  { lat: 41.5250, lng: -88.0800 },  // Joliet
  { lat: 40.6936, lng: -89.5890 },  // Peoria
  { lat: 38.9517, lng: -90.0650 },  // Grafton, IL (Illinois → Mississippi)
  { lat: 38.6270, lng: -90.1994 },  // St. Louis
  { lat: 37.0050, lng: -89.1764 },  // Cairo, IL
  { lat: 36.8618, lng: -88.3144 },  // Kentucky Lake
  { lat: 35.0456, lng: -88.1980 },  // Iuka, MS (Tenn-Tom junction)
  { lat: 32.6099, lng: -87.9000 },  // Demopolis, AL
  { lat: 30.6954, lng: -88.0431 },  // Mobile, AL
  { lat: 30.3960, lng: -87.0500 },  // Pensacola, FL
  { lat: 30.1588, lng: -85.6602 },  // Panama City, FL
  { lat: 29.9012, lng: -84.7441 },  // Apalachicola, FL
  { lat: 27.7731, lng: -82.6400 },  // Tampa, FL
  { lat: 26.6406, lng: -81.8723 },  // Fort Myers, FL
  { lat: 24.5587, lng: -81.8036 },  // Key West, FL
  { lat: 25.7617, lng: -80.1918 },  // Miami, FL
  { lat: 26.7153, lng: -80.0534 },  // West Palm Beach
  { lat: 29.1902, lng: -81.0462 },  // Daytona Beach
  { lat: 30.3322, lng: -81.6557 },  // Jacksonville, FL
  { lat: 31.1499, lng: -81.4915 },  // Brunswick, GA
  { lat: 32.0835, lng: -80.9001 },  // Hilton Head, SC
  { lat: 32.7765, lng: -79.9311 },  // Charleston, SC
  { lat: 33.9760, lng: -78.0270 },  // Wilmington, NC
  { lat: 34.7182, lng: -76.6640 },  // Beaufort, NC
  { lat: 35.9132, lng: -76.0000 },  // Albemarle Sound
  { lat: 36.8468, lng: -76.2951 },  // Norfolk, VA
  { lat: 38.9784, lng: -76.4922 },  // Annapolis, MD
  { lat: 39.2904, lng: -76.6122 },  // Baltimore, MD
  { lat: 39.6837, lng: -75.7497 },  // C&D Canal
  { lat: 38.9343, lng: -74.9060 },  // Cape May, NJ
  { lat: 40.7128, lng: -74.0060 },  // New York City
  { lat: 41.7658, lng: -73.9385 },  // Hudson River
  { lat: 42.7284, lng: -73.6918 },  // Troy, NY (Erie Canal start)
  { lat: 43.0481, lng: -76.1474 },  // Syracuse, NY
  { lat: 42.8864, lng: -78.8784 },  // Buffalo, NY
  { lat: 42.3314, lng: -83.0458 },  // Detroit, MI
  { lat: 43.6532, lng: -79.3832 },  // Toronto, ON (via Lake Ontario)
  { lat: 44.7866, lng: -80.5000 },  // Georgian Bay
  { lat: 45.8492, lng: -84.6188 },  // Mackinac Island
  { lat: 43.0125, lng: -86.2284 },  // Muskegon, MI
  { lat: 41.8858, lng: -87.6298 },  // Back to Chicago
];

// Alternate: Champlain Canal (from Troy north to Montreal)
const CHAMPLAIN_ALTERNATE: google.maps.LatLngLiteral[] = [
  { lat: 42.7284, lng: -73.6918 },  // Troy, NY
  { lat: 43.2994, lng: -73.5782 },  // Fort Edward
  { lat: 44.6995, lng: -73.4529 },  // Lake Champlain
  { lat: 45.5017, lng: -73.5673 },  // Montreal, QC
];

// Erie Canal (Troy → Buffalo — primary northern NY route)
const ERIE_CANAL: google.maps.LatLngLiteral[] = [
  { lat: 42.7284, lng: -73.6918 },  // Troy, NY
  { lat: 43.0481, lng: -76.1474 },  // Syracuse, NY
  { lat: 42.8864, lng: -78.8784 },  // Buffalo, NY
];

// Lower Mississippi alternate (Cairo → New Orleans → Gulf ICW)
const LOWER_MISSISSIPPI: google.maps.LatLngLiteral[] = [
  { lat: 37.0050, lng: -89.1764 },  // Cairo, IL
  { lat: 35.1495, lng: -90.0490 },  // Memphis, TN
  { lat: 32.2988, lng: -90.1848 },  // Jackson, MS
  { lat: 29.9511, lng: -90.0715 },  // New Orleans, LA
  { lat: 30.3960, lng: -88.8853 },  // Gulfport, MS (rejoins Gulf ICW)
];

// Alternate: Trent-Severn Waterway (Canada)
const TRENT_SEVERN: google.maps.LatLngLiteral[] = [
  { lat: 43.9455, lng: -78.1673 },  // Trenton, ON
  { lat: 44.3594, lng: -78.7439 },  // Peterborough, ON
  { lat: 44.8300, lng: -79.8700 },  // Barrie, ON
  { lat: 44.7866, lng: -80.5000 },  // Georgian Bay
];

const POI_ICON_MAP: Record<string, string> = {
  marina: "⚓", anchorage: "🪝", fuel_dock: "⛽",
  restaurant: "🍽️", museum: "🏛️", attraction: "⭐",
};

function computeDistance(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral): number {
  const R = 3440.065; // nautical miles
  const lat1 = (a.lat * Math.PI) / 180, lat2 = (b.lat * Math.PI) / 180;
  const dLat = lat2 - lat1, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

export default function PlannerPage() {
  const { tripId } = useParams<{ tripId?: string }>();
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const poiMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const routePolyRef = useRef<google.maps.Polyline[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"itinerary" | "discover">("itinerary");
  const [journalOpen, setJournalOpen] = useState(false);
  const [selectedPoiCategory, setSelectedPoiCategory] = useState<string>("all");
  const [selectedPoi, setSelectedPoi] = useState<number | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<number | null>(null);
  const [addingWaypoint, setAddingWaypoint] = useState(false);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const numericTripId = tripId ? parseInt(tripId) : null;

  const { data: trip } = trpc.trips.get.useQuery(
    { id: numericTripId! },
    { enabled: !!numericTripId && isAuthenticated }
  );
  const { data: vessel } = trpc.vessel.get.useQuery(undefined, { enabled: isAuthenticated });
  const { data: waypoints = [], refetch: refetchWaypoints } = trpc.waypoints.list.useQuery(
    { tripId: numericTripId! },
    { enabled: !!numericTripId && isAuthenticated }
  );
  const { data: pois = [] } = trpc.pois.list.useQuery({ category: selectedPoiCategory });
  const { data: poiDetail } = trpc.pois.get.useQuery({ id: selectedPoi! }, { enabled: !!selectedPoi });

  const addWaypoint = trpc.waypoints.add.useMutation({
    onSuccess: () => { refetchWaypoints(); setAddingWaypoint(false); toast.success("Stop added to trip"); },
    onError: () => toast.error("Failed to add stop"),
  });
  const removeWaypoint = trpc.waypoints.remove.useMutation({
    onSuccess: () => { refetchWaypoints(); setSelectedWaypoint(null); },
  });

  // Draw Great Loop route on map
  const drawRoutes = useCallback((map: google.maps.Map) => {
    routePolyRef.current.forEach(p => p.setMap(null));
    routePolyRef.current = [];

    const primaryPoly = new google.maps.Polyline({
      path: GREAT_LOOP_PRIMARY,
      geodesic: true,
      strokeColor: "#1D4ED8",
      strokeOpacity: 0.85,
      strokeWeight: 3,
      map,
    });
    routePolyRef.current.push(primaryPoly);

  const champlainPoly = new google.maps.Polyline({
    path: CHAMPLAIN_ALTERNATE,
    geodesic: true,
    strokeColor: "#7C3AED",
    strokeOpacity: 0.7,
    strokeWeight: 2,
    map,
  });
  routePolyRef.current.push(champlainPoly);

  const missPoly = new google.maps.Polyline({
    path: LOWER_MISSISSIPPI,
    geodesic: true,
    strokeColor: "#D97706",
    strokeOpacity: 0.7,
    strokeWeight: 2,
    map,
  });
  routePolyRef.current.push(missPoly);

  const trentPoly = new google.maps.Polyline({
    path: TRENT_SEVERN,
    geodesic: true,
    strokeColor: "#059669",
    strokeOpacity: 0.7,
    strokeWeight: 2,
    map,
  });
    routePolyRef.current.push(trentPoly);
  }, []);

  // Draw waypoint markers
  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach(m => { m.map = null; });
    markersRef.current = [];
    waypoints.forEach((wp, idx) => {
      const el = document.createElement("div");
      el.className = "waypoint-marker";
      el.innerHTML = `<div style="
        width:28px;height:28px;border-radius:50%;
        background:${selectedWaypoint === wp.id ? "#1D4ED8" : "#1e3a5f"};
        border:2px solid white;
        color:white;font-size:11px;font-weight:700;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
        cursor:pointer;transition:transform 0.15s;
      ">${idx + 1}</div>`;
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current!,
        position: { lat: wp.lat, lng: wp.lng },
        title: wp.name,
        content: el,
      });
      marker.addListener("click", () => setSelectedWaypoint(wp.id));
      markersRef.current.push(marker);
    });
  }, [waypoints, selectedWaypoint]);

  // Draw POI markers
  useEffect(() => {
    if (!mapRef.current) return;
    poiMarkersRef.current.forEach(m => { m.map = null; });
    poiMarkersRef.current = [];
    if (activeTab !== "discover") return;
    pois.forEach(poi => {
      const el = document.createElement("div");
      const icon = POI_ICON_MAP[poi.category] ?? "📍";
      el.innerHTML = `<div style="
        width:30px;height:30px;border-radius:50%;
        background:white;border:2px solid #e2e8f0;
        display:flex;align-items:center;justify-content:center;
        font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.2);
        cursor:pointer;transition:transform 0.15s;
      ">${icon}</div>`;
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current!,
        position: { lat: poi.lat, lng: poi.lng },
        title: poi.name,
        content: el,
      });
      marker.addListener("click", () => { setSelectedPoi(poi.id); setActiveTab("discover"); });
      poiMarkersRef.current.push(marker);
    });
  }, [pois, activeTab]);

  // Map click to add waypoint
  useEffect(() => {
    if (!mapRef.current) return;
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }
    if (addingWaypoint && numericTripId && isAuthenticated) {
      clickListenerRef.current = mapRef.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat(), lng = e.latLng.lng();
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          const address = status === "OK" && results?.[0] ? results[0].formatted_address : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          const name = status === "OK" && results?.[0]?.address_components?.[0]?.long_name
            ? results[0].address_components[0].long_name
            : "New Stop";
          addWaypoint.mutate({ tripId: numericTripId, name, lat, lng, address });
        });
      });
    }
    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [addingWaypoint, numericTripId, isAuthenticated]);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    drawRoutes(map);
  }, [drawRoutes]);

  // Calculate leg distances
  const legs = waypoints.map((wp, i) => {
    if (i === 0) return null;
    const prev = waypoints[i - 1];
    const dist = computeDistance({ lat: prev.lat, lng: prev.lng }, { lat: wp.lat, lng: wp.lng });
    const speed = vessel?.cruisingSpeed ?? 8;
    return { dist: dist.toFixed(1), hours: (dist / speed).toFixed(1) };
  });
  const totalDist = waypoints.reduce((sum, wp, i) => {
    if (i === 0) return sum;
    return sum + computeDistance({ lat: waypoints[i-1].lat, lng: waypoints[i-1].lng }, { lat: wp.lat, lng: wp.lng });
  }, 0);

  if (loading) return <div className="min-h-screen bg-background" />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppNav />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center max-w-sm px-4">
            <Anchor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-serif text-2xl mb-2">Sign in to access the Planner</h2>
            <p className="text-muted-foreground text-sm mb-6">Create an account to start planning your Great Loop voyage.</p>
            <Button onClick={() => startLogin()}>Sign In to Continue</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!numericTripId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppNav />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center max-w-sm px-4">
            <Anchor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-serif text-2xl mb-2">Select a trip to plan</h2>
            <p className="text-muted-foreground text-sm mb-6">Open a trip from My Trips, or create a new one.</p>
            <Button onClick={() => navigate("/trips")}>Go to My Trips</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppNav />
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <aside className={cn(
          "relative flex flex-col bg-white border-r border-border shadow-md transition-all duration-300 ease-in-out z-10",
          sidebarOpen ? "w-80 xl:w-96" : "w-0 overflow-hidden"
        )}>
          {sidebarOpen && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Sidebar Header */}
              <div className="px-4 py-3 border-b border-border bg-navy-950 text-white">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h2 className="font-serif font-semibold text-base truncate">{trip?.name ?? "Loading…"}</h2>
                    {waypoints.length > 0 && (
                      <p className="text-xs text-navy-300 mt-0.5">
                        {waypoints.length} stop{waypoints.length !== 1 ? "s" : ""} · {totalDist.toFixed(0)} nmi total
                      </p>
                    )}
                  </div>
                  <button onClick={() => navigate("/trips")} className="text-navy-300 hover:text-white transition-colors ml-2 shrink-0">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-3">
                  {(["itinerary", "discover"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex-1 py-1.5 rounded text-xs font-medium capitalize transition-colors",
                        activeTab === tab ? "bg-white/20 text-white" : "text-navy-300 hover:text-white"
                      )}
                    >
                      {tab === "itinerary" ? "Itinerary" : "Discover"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === "itinerary" && (
                  <div className="p-3 space-y-1">
                    {/* Add Stop Button */}
                    <button
                      onClick={() => setAddingWaypoint(v => !v)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium transition-all",
                        addingWaypoint
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      )}
                    >
                      {addingWaypoint ? (
                        <><X className="w-4 h-4" /> Click map to add stop (cancel)</>
                      ) : (
                        <><Plus className="w-4 h-4" /> Click map to add a stop</>
                      )}
                    </button>

                    {waypoints.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No stops yet.</p>
                        <p className="text-xs mt-1">Click the button above, then tap the map to add your first stop.</p>
                      </div>
                    ) : (
                      waypoints.map((wp, idx) => (
                        <div key={wp.id}>
                          {/* Leg info */}
                          {idx > 0 && legs[idx] && (
                            <div className="flex items-center gap-2 py-1 px-2 text-xs text-muted-foreground">
                              <div className="flex-1 border-t border-dashed border-border" />
                              <Navigation className="w-3 h-3" />
                              <span>{legs[idx]!.dist} nmi · ~{legs[idx]!.hours}h</span>
                              <div className="flex-1 border-t border-dashed border-border" />
                            </div>
                          )}
                          {/* Waypoint card */}
                          <div
                            onClick={() => setSelectedWaypoint(selectedWaypoint === wp.id ? null : wp.id)}
                            className={cn(
                              "group flex items-start gap-2 p-2.5 rounded-lg cursor-pointer transition-colors",
                              selectedWaypoint === wp.id ? "bg-blue-50 border border-blue-200" : "hover:bg-secondary"
                            )}
                          >
                            <div className="w-6 h-6 rounded-full bg-navy-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{wp.name}</p>
                              {wp.address && <p className="text-xs text-muted-foreground truncate">{wp.address}</p>}
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {wp.dateTbd ? "Date TBD" : wp.plannedDate ? format(new Date(wp.plannedDate), "MMM d, yyyy") : "Date TBD"}
                              </p>
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); removeWaypoint.mutate({ id: wp.id }); }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}

                    {waypoints.length > 1 && (
                      <div className="mt-3 p-3 bg-secondary rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Trip Summary</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Distance</span>
                          <span className="font-semibold">{totalDist.toFixed(0)} nmi</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-muted-foreground">Est. Underway Time</span>
                          <span className="font-semibold">{(totalDist / (vessel?.cruisingSpeed ?? 8)).toFixed(0)}h at {vessel?.cruisingSpeed ?? 8} kts</span>
                        </div>
                        {vessel?.fuelRange && (
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Fuel Stops (est.)</span>
                            <span className="font-semibold">~{Math.ceil(totalDist / vessel.fuelRange)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {numericTripId && (
                      <button
                        onClick={() => setJournalOpen(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary border border-dashed border-border transition-colors mt-2"
                      >
                        <BookOpen className="w-4 h-4" /> View Trip Journal
                      </button>
                    )}
                  </div>
                )}

                {activeTab === "discover" && (
                  <div className="flex flex-col h-full">
                    {/* Category filters */}
                    <div className="p-3 border-b border-border">
                      <div className="flex flex-wrap gap-1.5">
                        {POI_CATEGORIES.map(cat => (
                          <button
                            key={cat.value}
                            onClick={() => setSelectedPoiCategory(cat.value)}
                            className={cn(
                              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                              selectedPoiCategory === cat.value
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-white border-border text-muted-foreground hover:border-primary hover:text-foreground"
                            )}
                          >
                            <span>{cat.icon}</span> {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* POI list */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {pois.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="text-sm">No points of interest found.</p>
                        </div>
                      ) : (
                        pois.map(poi => (
                          <div
                            key={poi.id}
                            onClick={() => { setSelectedPoi(poi.id); mapRef.current?.panTo({ lat: poi.lat, lng: poi.lng }); }}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                              selectedPoi === poi.id ? "border-primary bg-blue-50" : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg shrink-0">{POI_ICON_MAP[poi.category]}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{poi.name}</p>
                                {poi.address && <p className="text-xs text-muted-foreground truncate">{poi.address}</p>}
                                {poi.rating && (
                                  <div className="flex items-center gap-0.5 mt-0.5">
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    <span className="text-xs text-muted-foreground">{poi.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-5 h-12 bg-white border border-border rounded-r-md shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
          style={{ left: sidebarOpen ? (window.innerWidth >= 1280 ? "24rem" : "20rem") : "0" }}
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            className="w-full h-full"
            initialCenter={{ lat: 37.5, lng: -82.0 }}
            initialZoom={5}
            onMapReady={handleMapReady}
          />

          {/* Route legend */}
          <div className="absolute bottom-6 right-4 glass rounded-xl p-3 shadow-lg text-xs space-y-1.5">
            <p className="font-semibold text-foreground mb-2">Route Legend</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-600 rounded" />
              <span className="text-muted-foreground">Primary Loop (Tenn-Tom)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-400 rounded" />
              <span className="text-muted-foreground">Erie Canal (primary N)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6" style={{ borderTop: "2px dashed #7C3AED" }} />
              <span className="text-muted-foreground">Champlain Canal Alt.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6" style={{ borderTop: "2px dashed #D97706" }} />
              <span className="text-muted-foreground">Lower Mississippi Alt.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6" style={{ borderTop: "2px dashed #059669" }} />
              <span className="text-muted-foreground">Trent-Severn Alt.</span>
            </div>
          </div>

          {addingWaypoint && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-2 text-sm font-medium shadow-lg text-blue-700 border border-blue-200">
              Click anywhere on the map to add a stop
            </div>
          )}
        </div>

        {/* POI Detail Panel */}
        {selectedPoi && poiDetail && (
          <PoiDetailPanel
            poi={poiDetail}
            tripId={numericTripId}
            onClose={() => setSelectedPoi(null)}
            onAddedToTrip={() => { refetchWaypoints(); setSelectedPoi(null); setActiveTab("itinerary"); }}
          />
        )}

        {/* Waypoint Detail Panel */}
        {selectedWaypoint && (
          <WaypointDetailPanel
            waypointId={selectedWaypoint}
            tripId={numericTripId!}
            onClose={() => setSelectedWaypoint(null)}
            onUpdated={refetchWaypoints}
          />
        )}

        {journalOpen && numericTripId && (
          <TripJournalPanel tripId={numericTripId} onClose={() => setJournalOpen(false)} />
        )}
      </div>
    </div>
  );
}

function TripJournalPanel({ tripId, onClose }: { tripId: number; onClose: () => void }) {
  const { data: entries = [], refetch } = trpc.journal.listByTrip.useQuery({ tripId });
  const { data: waypoints = [] } = trpc.waypoints.list.useQuery({ tripId });
  const deleteEntry = trpc.journal.delete.useMutation({ onSuccess: () => refetch() });

  const getWaypointName = (id: number | null | undefined) =>
    id ? (waypoints.find(w => w.id === id)?.name ?? "Unknown Stop") : "Trip-Level Note";

  return (
    <div className="absolute inset-0 bg-black/40 z-30 flex items-center justify-end" onClick={onClose}>
      <div
        className="h-full w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-navy-950 text-white">
          <div>
            <p className="text-xs text-navy-300 uppercase tracking-wide font-medium">Trip Journal</p>
            <h3 className="font-serif font-semibold text-lg">All Entries</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No journal entries yet.</p>
              <p className="text-xs mt-1">Click a stop in the itinerary to add notes and journal entries.</p>
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="border border-border rounded-xl p-4 space-y-2 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {entry.title && <p className="font-semibold text-sm">{entry.title}</p>}
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-navy-700">{getWaypointName(entry.waypointId)}</span>
                      {" · "}{format(new Date(entry.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <button onClick={() => deleteEntry.mutate({ id: entry.id })} className="p-1 hover:text-destructive transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {entry.content && <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{entry.content}</p>}
                {Array.isArray(entry.todoItems) && (entry.todoItems as any[]).length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">To-Do</p>
                    {(entry.todoItems as any[]).map((todo: any) => (
                      <div key={todo.id} className="flex items-center gap-2 text-sm">
                        {todo.done ? <CheckSquare className="w-4 h-4 text-primary shrink-0" /> : <Square className="w-4 h-4 text-muted-foreground shrink-0" />}
                        <span className={todo.done ? "line-through text-muted-foreground" : ""}>{todo.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
