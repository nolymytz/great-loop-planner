import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { AppNav } from "@/components/AppNav";
import { CreateTripDialog } from "@/components/CreateTripDialog";
import { TRIP_STATUS_COLORS, TRIP_STATUS_LABELS } from "@shared/types";
import type { TripStatus } from "@shared/types";
import { format } from "date-fns";
import {
  Anchor,
  BarChart3,
  Calendar,
  Compass,
  Fuel,
  Map,
  Plus,
  Ship,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const STATUS_STYLE: Record<string, string> = {
  planning: "bg-[#e0fbff] text-[#00616d] border border-[#00e3fd]/30",
  active: "bg-[#e8f5e9] text-[#2e7d32] border border-green-200",
  paused: "bg-[#fff8e1] text-[#f57f17] border border-yellow-200",
  completed: "bg-[#f3f3f4] text-[#42474d] border border-[#e2e2e2]",
};

export default function TripsPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();
  const [showCreate, setShowCreate] = useState(false);

  const { data: trips = [], refetch } = trpc.trips.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const deleteTrip = trpc.trips.delete.useMutation({
    onSuccess: () => {
      toast.success("Trip deleted");
      refetch();
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Anchor className="w-8 h-8 text-[#002b49] animate-pulse" />
          <p
            className="text-[11px] text-[#42474d] uppercase tracking-widest"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f9f9f9]">
        <AppNav />
        <div className="flex-1 flex items-center justify-center pt-14 min-h-screen">
          <div className="text-center max-w-sm px-4">
            <div className="w-16 h-16 rounded-full bg-[#002b49] flex items-center justify-center mx-auto mb-6">
              <Anchor className="w-7 h-7 text-white" />
            </div>
            <h2
              className="text-[28px] font-bold text-[#002b49] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Sign in to plan your voyage
            </h2>
            <p className="text-[#42474d] text-[15px] mb-8 leading-relaxed">
              Your trips are saved securely to your account and sync across all
              devices.
            </p>
            <button onClick={() => startLogin()} className="btn-primary px-8">
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <AppNav />

      <div className="flex pt-14 min-h-screen">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-[#e2e2e2] bg-white sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* Vessel header */}
          <div className="px-4 py-5 border-b border-[#e2e2e2]">
            <div className="flex items-center gap-2 mb-1">
              <Ship className="w-3.5 h-3.5 text-[#42474d]" />
              <span
                className="text-[11px] font-medium text-[#002b49] truncate"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {user?.name ?? "My Vessel"}
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
                onClick={() => {
                  if (label === "Route Map") return;
                  toast.info("Feature coming soon");
                }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* Trip count */}
          <div className="px-4 py-3 border-t border-[#e2e2e2]">
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] text-[#42474d] uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Expeditions
              </span>
              <span
                className="text-[12px] font-semibold text-[#002b49]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {trips.length}
              </span>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="px-3 pb-4">
            <button className="w-full py-2.5 px-3 bg-[#002b49] text-white rounded text-[10px] font-mono tracking-widest uppercase hover:bg-[#001629] transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-x-hidden">
          {/* Page header */}
          <div className="bg-white border-b border-[#e2e2e2] px-8 lg:px-10 py-6">
            <div className="max-w-[1100px] mx-auto flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] text-[#42474d] uppercase tracking-widest mb-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  My Expeditions
                </p>
                <h1
                  className="text-[28px] font-bold text-[#002b49]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Route Map
                </h1>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                New Expedition
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 lg:px-10 py-8">
            <div className="max-w-[1100px] mx-auto">
              {trips.length === 0 ? (
                <div className="text-center py-24 border border-dashed border-[#e2e2e2] rounded-lg bg-white">
                  <div className="w-14 h-14 rounded-full bg-[#f3f3f4] flex items-center justify-center mx-auto mb-4">
                    <Compass className="w-6 h-6 text-[#42474d]" />
                  </div>
                  <h3
                    className="text-[20px] font-semibold text-[#002b49] mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    No expeditions yet
                  </h3>
                  <p className="text-[#42474d] text-[14px] mb-6">
                    Create your first Great Loop expedition to begin planning.
                  </p>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="btn-ghost gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Your First Expedition
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      className="card-maritime overflow-hidden cursor-pointer group"
                      onClick={() => navigate(`/planner/${trip.id}`)}
                    >
                      {/* Color bar */}
                      <div
                        className="h-1.5"
                        style={{ background: trip.bannerColor ?? "#002b49" }}
                      />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3
                              className="text-[17px] font-semibold text-[#002b49] truncate"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              {trip.name}
                            </h3>
                            {trip.description && (
                              <p className="text-[13px] text-[#42474d] mt-0.5 line-clamp-2 leading-relaxed">
                                {trip.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase ${STATUS_STYLE[trip.status] ?? STATUS_STYLE.planning}`}
                          >
                            {TRIP_STATUS_LABELS[trip.status as TripStatus] ??
                              trip.status}
                          </span>
                        </div>

                        {(trip.startDate || trip.endDate) && (
                          <div className="flex items-center gap-1.5 mb-3">
                            <Calendar className="w-3 h-3 text-[#42474d]" />
                            <span
                              className="text-[10px] text-[#42474d]"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {trip.startDate &&
                                format(new Date(trip.startDate), "MMM yyyy")}
                              {trip.startDate && trip.endDate && " – "}
                              {trip.endDate &&
                                format(new Date(trip.endDate), "MMM yyyy")}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#f3f3f4]">
                          <button
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#002b49] text-white rounded text-[10px] font-mono tracking-widest uppercase hover:bg-[#001629] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/planner/${trip.id}`);
                            }}
                          >
                            <Map className="w-3 h-3" />
                            Open Planner
                          </button>
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-[#e2e2e2] rounded hover:border-red-300 hover:bg-red-50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTrip.mutate({ id: trip.id });
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add new trip card */}
                  <div
                    className="border border-dashed border-[#e2e2e2] rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:border-[#00e3fd] hover:bg-[#f0fbff] transition-colors min-h-[180px] group"
                    onClick={() => setShowCreate(true)}
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#e2e2e2] group-hover:border-[#00e3fd] flex items-center justify-center mb-3 transition-colors">
                      <Plus className="w-4 h-4 text-[#42474d] group-hover:text-[#006875] transition-colors" />
                    </div>
                    <p
                      className="text-[10px] text-[#42474d] uppercase tracking-widest group-hover:text-[#006875] transition-colors"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      New Expedition
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <CreateTripDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(id) => navigate(`/planner/${id}`)}
      />
    </div>
  );
}
