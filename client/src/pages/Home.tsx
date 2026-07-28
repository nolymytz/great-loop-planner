import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { AppNav } from "@/components/AppNav";
import { Anchor, Map, BookOpen, Ship, Star, ArrowRight, Navigation, Compass } from "lucide-react";
import { useLocation } from "wouter";

const FEATURES = [
  {
    icon: Map,
    title: "Interactive Route Map",
    description: "Visualize the full Great Loop with the primary route and all popular alternates — Erie Canal, Champlain Canal, Trent-Severn, and Lower Mississippi — displayed on a live map.",
  },
  {
    icon: Navigation,
    title: "Itinerary & Distance Planner",
    description: "Build your stop-by-stop itinerary with per-leg distance and estimated travel time calculations. Assign dates or mark stops as TBD as your plans evolve over the years.",
  },
  {
    icon: Compass,
    title: "POI Discovery",
    description: "Discover Marinas, Anchorages, Fuel Docks, Restaurants, Museums, and Attractions along the route. Filter by category, read details, and add any stop directly to your trip.",
  },
  {
    icon: BookOpen,
    title: "Trip Journal & Notes",
    description: "Attach personal notes, journal entries, and to-do lists to individual stops. Capture your research, dreams, and plans in one organized place.",
  },
  {
    icon: Ship,
    title: "Vessel Profile",
    description: "Store your boat's draft, air draft/bridge clearance, cruising speed, and fuel range. Your specs inform planning and help you identify potential route constraints.",
  },
  {
    icon: Star,
    title: "Multi-Trip & Long-Term Planning",
    description: "Save multiple trips and plan across years. Pause, resume, and refine your voyage as your departure date approaches — the app grows with your plans.",
  },
];

const STATS = [
  { value: "6,000+", label: "Nautical Miles" },
  { value: "35+", label: "States & Provinces" },
  { value: "1 Year", label: "Typical Journey" },
  { value: "∞", label: "Memories Made" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Anchor className="w-5 h-5 text-gold-400" />
              </div>
              <span className="text-gold-300 text-sm font-medium tracking-wider uppercase">America's Great Loop</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Plan Your<br />
              <span className="text-gradient-gold">Great Loop</span><br />
              Voyage
            </h1>

            <p className="text-navy-200 text-xl leading-relaxed mb-10 max-w-xl">
              The dedicated planning tool for Loopers. Map your route, discover stops, journal your plans, and build your dream voyage — one stop at a time, over as many years as it takes.
            </p>

            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  className="gap-2 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold text-base px-8"
                  onClick={() => navigate("/trips")}
                >
                  Open My Trips <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="gap-2 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold text-base px-8"
                    onClick={() => startLogin()}
                  >
                    Start Planning Free <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-white/30 text-white hover:bg-white/10 text-base px-8"
                    onClick={() => navigate("/planner")}
                  >
                    Explore the Map
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
          <div className="w-px h-8 bg-white/20 animate-pulse" />
          <span className="text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-border py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-3xl font-bold text-navy-900">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-semibold mb-4">Everything a Looper Needs</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built specifically for the Great Loop — not a generic trip planner adapted for boats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-4 group-hover:bg-navy-100 transition-colors">
                  <feature.icon className="w-5 h-5 text-navy-700" />
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Route highlight */}
      <section className="py-20 bg-navy-950 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <Anchor className="w-10 h-10 mx-auto mb-6 text-gold-400" />
            <h2 className="font-serif text-4xl font-semibold mb-4">The Loop in Numbers</h2>
            <p className="text-navy-200 text-lg leading-relaxed mb-8">
              America's Great Loop is a continuous waterway circumnavigating the eastern United States — through the Atlantic Intracoastal Waterway, the Gulf of Mexico, the Mississippi River system, the Great Lakes, and the Canadian canals. It is one of the world's great cruising adventures.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { label: "Primary Route", value: "Erie Canal", sub: "Troy, NY → Buffalo, NY" },
                { label: "Alternate Route", value: "Champlain Canal", sub: "Troy, NY → Montreal, QC" },
                { label: "Southern Alternate", value: "Lower Mississippi", sub: "Cairo, IL → New Orleans, LA" },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-navy-400 uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="font-serif font-semibold text-lg text-gold-300">{item.value}</p>
                  <p className="text-xs text-navy-300 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="font-serif text-4xl font-semibold mb-4">Ready to start planning?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Create your account and begin mapping your Great Loop voyage today. Your trip will be waiting whenever you return.
          </p>
          {isAuthenticated ? (
            <Button size="lg" className="gap-2 px-8" onClick={() => navigate("/trips")}>
              Go to My Trips <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="lg" className="gap-2 px-8" onClick={() => startLogin()}>
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Anchor className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-serif">Great Loop Planner</span>
          </div>
          <p className="text-xs text-muted-foreground">Built for Loopers, by Loopers. Happy cruising. ⚓</p>
        </div>
      </footer>
    </div>
  );
}
