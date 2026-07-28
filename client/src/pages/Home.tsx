import { useAuth } from "@/contexts/AuthContext";
import {
  Anchor,
  BarChart3,
  Bell,
  BookOpen,
  ChevronRight,
  Cloud,
  Compass,
  Download,
  Fuel,
  Map,
  MapPin,
  Settings,
  Ship,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

/* ─── Yacht hero image (public domain / Unsplash-style URL) ─── */
const YACHT_IMG =
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80";
const MAP_IMG =
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      {/* ══════════════════════════════════════════
          TOP NAVIGATION BAR — glassmorphism
      ══════════════════════════════════════════ */}
      <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-14">
        <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Anchor className="w-4 h-4 text-[#002b49]" strokeWidth={2.5} />
            <span
              className="text-[13px] font-semibold tracking-wide text-[#002b49]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Great Loop Planner
            </span>
          </div>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-1">
            {["Route", "Weather", "Marinas", "Logbook"].map((item, i) => (
              <a
                key={item}
                href="#"
                className={`px-4 py-1.5 text-[11px] tracking-widest uppercase transition-colors ${
                  i === 0
                    ? "text-[#002b49] border-b-2 border-[#00e3fd] font-medium"
                    : "text-[#42474d] hover:text-[#002b49]"
                }`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-[#42474d] hover:text-[#002b49] transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-[#42474d] hover:text-[#002b49] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            {isAuthenticated ? (
              <Link href="/trips">
                <div className="w-7 h-7 rounded-full bg-[#002b49] flex items-center justify-center cursor-pointer">
                  <span className="text-white text-[10px] font-mono">GL</span>
                </div>
              </Link>
            ) : (
              <Link href="/auth">
                <button className="btn-primary text-[10px] py-1.5 px-4">Sign In</button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          MAIN LAYOUT — sidebar + content
      ══════════════════════════════════════════ */}
      <div className="flex pt-14 min-h-screen">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-[#e2e2e2] bg-white sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* Vessel header */}
          <div className="px-4 py-5 border-b border-[#e2e2e2]">
            <div className="flex items-center gap-2 mb-1">
              <Ship className="w-3.5 h-3.5 text-[#42474d]" />
              <span
                className="text-[11px] font-medium text-[#002b49]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                M/V Sea Mist
              </span>
            </div>
            <p
              className="text-[10px] text-[#42474d] pl-5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Great Loop Expedition
            </p>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {[
              { icon: BarChart3, label: "Dashboard", active: false },
              { icon: Map, label: "Route Map", active: true },
              { icon: Fuel, label: "Fuel Calculator", active: false },
              { icon: Wrench, label: "Maintenance", active: false },
              { icon: Users, label: "Community", active: false },
            ].map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`sidebar-item w-full text-left ${active ? "active" : ""}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* Upgrade CTA */}
          <div className="px-3 pb-4">
            <button className="w-full py-2.5 px-3 bg-[#002b49] text-white rounded text-[10px] font-mono tracking-widest uppercase hover:bg-[#001629] transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-x-hidden">
          {/* ── HERO SECTION ── */}
          <section className="px-8 lg:px-12 py-12 border-b border-[#e2e2e2] bg-white">
            <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: copy */}
              <div className="animate-fade-in-up">
                <span className="badge-maritime mb-5 inline-flex">
                  Maritime Precision
                </span>
                <h1 className="text-display-lg text-[#002b49] mb-4 leading-[1.1]">
                  Navigate the Loop
                  <br />
                  with{" "}
                  <em className="not-italic text-cyan-accent italic">
                    Coastal Luxury.
                  </em>
                </h1>
                <p className="text-body-lg text-[#42474d] mb-8 max-w-md">
                  A high-performance planning suite for the modern mariner.
                  Execute your 6,000-mile journey with technical accuracy,
                  real-time telemetry, and curated coastal insights.
                </p>
                <div className="flex flex-wrap gap-3">
                  {isAuthenticated ? (
                    <Link href="/trips">
                      <button className="btn-primary">
                        Start Planning
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  ) : (
                    <Link href="/auth">
                      <button className="btn-primary">
                        Start Planning
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  )}
                  <button className="btn-ghost">View Charts</button>
                </div>
              </div>

              {/* Right: yacht photo + stat card */}
              <div className="relative animate-fade-in-up delay-200">
                <div className="rounded-lg overflow-hidden border border-[#e2e2e2] shadow-[0_4px_20px_rgba(0,43,73,0.08)]">
                  <img
                    src={YACHT_IMG}
                    alt="Luxury yacht on turquoise water"
                    className="w-full h-64 lg:h-72 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23e8f4f8' width='800' height='400'/%3E%3Ctext fill='%23002b49' font-family='serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EGreat Loop Route%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                {/* Stat overlay card */}
                <div className="absolute top-4 right-4 glass-card rounded-lg px-4 py-3 shadow-[0_4px_16px_rgba(0,43,73,0.12)]">
                  <p
                    className="text-[9px] text-[#42474d] uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Avg. Cruise
                  </p>
                  <p
                    className="text-[22px] font-bold text-[#002b49] leading-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    8 kts
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── STATS BAR ── */}
          <section className="bg-white border-b border-[#e2e2e2] px-8 lg:px-12 py-6">
            <div className="max-w-[1100px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-0">
              {[
                { label: "Total Distance", value: "6,240 NM" },
                { label: "Est. Duration", value: "285 Days" },
                { label: "Ports & Marinas", value: "142" },
                { label: "Fuel Efficiency", value: "1.8 G/NM" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-6 py-2 ${i < 3 ? "border-r border-[#e2e2e2]" : ""} ${i < 2 ? "border-b border-[#e2e2e2] lg:border-b-0" : ""}`}
                >
                  <p
                    className="text-[10px] text-[#42474d] uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-[28px] font-bold text-[#002b49] leading-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── TACTICAL SUITE ── */}
          <section className="px-8 lg:px-12 py-12 bg-[#f9f9f9]">
            <div className="max-w-[1100px] mx-auto">
              <div className="mb-8">
                <h2 className="text-headline-md text-[#002b49] mb-2">
                  Tactical Suite
                </h2>
                <p className="text-body-md text-[#42474d]">
                  Precision-engineered tools to manage every nautical mile of
                  your expedition.
                </p>
              </div>

              {/* Card grid — 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Interactive Route Map (large, spans 1 col but taller) */}
                <div className="card-maritime p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded bg-[#f3f3f4] flex items-center justify-center">
                      <Map className="w-4.5 h-4.5 text-[#002b49]" />
                    </div>
                    <span className="badge-live">Live Sync</span>
                  </div>
                  <h3 className="text-headline-sm text-[#002b49] mb-2">
                    Interactive Route Map
                  </h3>
                  <p className="text-[14px] text-[#42474d] leading-relaxed mb-4">
                    Vector-based routing with real-time AIS overlay and
                    bathymetric data layers for precision docking.
                  </p>
                  {/* Mini map preview */}
                  <div className="mt-auto rounded overflow-hidden border border-[#e2e2e2] h-28 bg-[#e8f4f8] flex items-center justify-center">
                    <div className="text-center">
                      <Compass className="w-8 h-8 text-[#002b49] mx-auto mb-1 opacity-40" />
                      <span
                        className="text-[9px] text-[#42474d] uppercase tracking-widest"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        Great Loop Route
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Itinerary Planner */}
                <div className="card-maritime p-5 flex flex-col">
                  <div className="w-9 h-9 rounded bg-[#f3f3f4] flex items-center justify-center mb-3">
                    <BookOpen className="w-4.5 h-4.5 text-[#002b49]" />
                  </div>
                  <h3 className="text-headline-sm text-[#002b49] mb-2">
                    Itinerary Planner
                  </h3>
                  <p className="text-[14px] text-[#42474d] leading-relaxed">
                    Dynamic scheduling that adapts to weather windows and bridge
                    opening intervals.
                  </p>
                </div>

                {/* Card 3: POI Discovery */}
                <div className="card-maritime p-5 flex flex-col">
                  <div className="w-9 h-9 rounded bg-[#f3f3f4] flex items-center justify-center mb-3">
                    <MapPin className="w-4.5 h-4.5 text-[#002b49]" />
                  </div>
                  <h3 className="text-headline-sm text-[#002b49] mb-2">
                    POI Discovery
                  </h3>
                  <p className="text-[14px] text-[#42474d] leading-relaxed">
                    Curated list of premium marinas, deep-water anchorages, and
                    coastal provisioning.
                  </p>
                </div>

                {/* Card 4: Marine Weather */}
                <div className="card-maritime p-5 flex flex-col">
                  <div className="w-9 h-9 rounded bg-[#f3f3f4] flex items-center justify-center mb-3">
                    <Cloud className="w-4.5 h-4.5 text-[#002b49]" />
                  </div>
                  <h3 className="text-headline-sm text-[#002b49] mb-2">
                    Marine Weather
                  </h3>
                  <p className="text-[14px] text-[#42474d] leading-relaxed">
                    NOAA integration with wave height forecasts and atmospheric
                    pressure tracking.
                  </p>
                </div>

                {/* Card 5: Automated Logbook (dark featured card) */}
                <div className="card-navy p-5 flex flex-col">
                  <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center mb-3">
                    <Zap className="w-4.5 h-4.5 text-[#00e3fd]" />
                  </div>
                  <h3
                    className="text-[18px] font-semibold text-white mb-2 leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Automated Logbook
                  </h3>
                  <p className="text-[14px] text-white/70 leading-relaxed mb-5">
                    Capture engine telemetry, weather conditions, and personal
                    notes automatically with NMEA 2000 hardware integration.
                  </p>
                  <div className="mt-auto">
                    <button className="px-4 py-2 border border-white/30 text-white text-[10px] font-mono tracking-widest uppercase rounded hover:bg-white/10 transition-colors">
                      Explore API
                    </button>
                  </div>
                </div>

                {/* Card 6: Looper Community */}
                <div className="card-maritime p-5 flex flex-col">
                  <div className="w-9 h-9 rounded bg-[#f3f3f4] flex items-center justify-center mb-3">
                    <Users className="w-4.5 h-4.5 text-[#002b49]" />
                  </div>
                  <h3 className="text-headline-sm text-[#002b49] mb-2">
                    Looper Community
                  </h3>
                  <p className="text-[14px] text-[#42474d] leading-relaxed mb-4">
                    Connect with fellow Loopers, share waypoints, and get
                    real-time marina reviews.
                  </p>
                  {/* Avatar stack */}
                  <div className="mt-auto flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["#002b49", "#006875", "#274969", "#42474d", "#00616d"].map(
                        (color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-mono"
                            style={{ backgroundColor: color }}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        )
                      )}
                    </div>
                    <span
                      className="text-[10px] text-[#42474d]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      +5k
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── LIVE TELEMETRY SECTION ── */}
          <section className="px-8 lg:px-12 py-12 bg-[#f0f4f7] border-t border-b border-[#e2e2e2]">
            <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: copy + controls */}
              <div>
                <p
                  className="text-[10px] text-[#42474d] uppercase tracking-widest mb-3 flex items-center gap-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span className="w-6 h-px bg-[#42474d] inline-block" />
                  Live Telemetry
                </p>
                <h2 className="text-headline-md text-[#002b49] mb-4">
                  Chart Your Success
                </h2>
                <p className="text-body-md text-[#42474d] mb-8">
                  Our engine pulls live depth readings, bridge clearances, and
                  current velocities to provide the safest possible passage
                  planning.
                </p>

                {/* Instrument controls */}
                <div className="space-y-4">
                  {[
                    { label: "Bridge Clearance", value: "35' 2\"", pct: 72 },
                    { label: "Draft Margin", value: "4' 6\"", pct: 45 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white border border-[#e2e2e2] rounded px-4 py-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className="text-[10px] text-[#42474d] uppercase tracking-widest"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="text-[12px] font-medium text-[#002b49]"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {item.value}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#e2e2e2] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00e3fd] rounded-full"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: map preview with waypoint overlay */}
              <div className="relative">
                <div className="rounded-lg overflow-hidden border border-[#e2e2e2] shadow-[0_4px_20px_rgba(0,43,73,0.08)]">
                  <img
                    src={MAP_IMG}
                    alt="Great Loop route map"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='400' viewBox='0 0 900 400'%3E%3Crect fill='%23c8dce8' width='900' height='400'/%3E%3Ctext fill='%23002b49' font-family='serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EInteractive Route Map%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* Map header bar */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="glass-card rounded px-3 py-1.5 text-[9px] font-mono text-[#002b49] tracking-widest uppercase">
                      Great Loop Planner · Sea Mist Edition
                    </div>
                    <div className="glass-card rounded px-2 py-1.5 text-[9px] font-mono text-[#42474d]">
                      ↑
                    </div>
                  </div>
                </div>
                {/* Waypoint overlay card */}
                <div className="absolute bottom-4 right-4 bg-[#002b49] text-white rounded-lg px-4 py-3 shadow-lg max-w-[180px]">
                  <p
                    className="text-[8px] text-white/60 uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Next Waypoint
                  </p>
                  <p
                    className="text-[13px] font-semibold text-white leading-snug mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Dismal Swamp Canal
                  </p>
                  <p
                    className="text-[9px] text-[#00e3fd]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Arrival: 14:00 EST
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── CTA SECTION ── */}
          <section className="px-8 lg:px-12 py-20 bg-white text-center">
            <p
              className="text-[10px] text-[#42474d] uppercase tracking-widest mb-5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Ready to Cast Off?
            </p>
            <h2
              className="text-[clamp(32px,4vw,52px)] font-bold text-[#002b49] leading-tight mb-5 max-w-2xl mx-auto"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Great Loop adventure begins with precision.
            </h2>
            <p className="text-body-md text-[#42474d] mb-10 max-w-lg mx-auto">
              Join over 12,000 Loopers who trust Great Loop Planner for their
              voyage of a lifetime. Get started with a free 30-day nautical
              trial.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isAuthenticated ? (
                <Link href="/trips">
                  <button className="btn-primary px-8 py-3 text-[11px]">
                    Create Expedition
                  </button>
                </Link>
              ) : (
                <Link href="/auth">
                  <button className="btn-primary px-8 py-3 text-[11px]">Create Expedition</button>
                </Link>
              )}
              <button className="btn-ghost px-8 py-3 text-[11px]">
                View Pricing
              </button>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="px-8 lg:px-12 py-8 bg-white border-t border-[#e2e2e2]">
            <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Anchor className="w-3.5 h-3.5 text-[#002b49]" />
                  <span
                    className="text-[11px] font-semibold text-[#002b49]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Great Loop Planner
                  </span>
                </div>
                <p
                  className="text-[10px] text-[#42474d]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  © 2026 Great Loop Planner. Maritime Precision Engineering.
                </p>
              </div>
              <nav className="flex items-center gap-6">
                {["Safety Protocol", "Charts", "Support", "Terms"].map(
                  (link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-[10px] text-[#42474d] hover:text-[#002b49] transition-colors"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {link}
                    </a>
                  )
                )}
              </nav>
              <div className="flex items-center gap-3">
                <button className="p-1.5 text-[#42474d] hover:text-[#002b49] transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-[#42474d] hover:text-[#002b49] transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
