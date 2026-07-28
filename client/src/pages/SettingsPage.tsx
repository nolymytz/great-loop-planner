import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { AppNav } from "@/components/AppNav";
import {
  Anchor,
  BarChart3,
  Fuel,
  Gauge,
  Layers,
  Ruler,
  Settings,
  Ship,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function TechInput({
  label,
  value,
  onChange,
  unit,
  placeholder,
  type = "number",
}: {
  label: string;
  value: string | number | null | undefined;
  onChange: (v: string | number | null) => void;
  unit?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="bg-[#f9f9f9] border border-[#e2e2e2] rounded px-4 py-3">
      <label
        className="block text-[9px] text-[#42474d] uppercase tracking-widest mb-2"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          step={type === "number" ? "0.1" : undefined}
          placeholder={placeholder ?? "—"}
          value={value ?? ""}
          onChange={(e) =>
            onChange(
              type === "number"
                ? e.target.value === ""
                  ? null
                  : parseFloat(e.target.value)
                : e.target.value
            )
          }
          className="flex-1 bg-transparent border-none outline-none text-[15px] font-semibold text-[#002b49] placeholder:text-[#c0c4c8]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        />
        {unit && (
          <span
            className="text-[10px] text-[#42474d] shrink-0"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const { data: vessel } = trpc.vessel.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const upsert = trpc.vessel.upsert.useMutation({
    onSuccess: () => toast.success("Vessel profile saved"),
  });

  const [form, setForm] = useState({
    boatName: "",
    boatType: "",
    draft: null as number | null,
    airDraft: null as number | null,
    cruisingSpeed: null as number | null,
    fuelRange: null as number | null,
    lengthOverall: null as number | null,
    beam: null as number | null,
  });

  useEffect(() => {
    if (vessel) {
      setForm({
        boatName: vessel.boatName ?? "",
        boatType: vessel.boatType ?? "",
        draft: vessel.draft ?? null,
        airDraft: vessel.airDraft ?? null,
        cruisingSpeed: vessel.cruisingSpeed ?? null,
        fuelRange: vessel.fuelRange ?? null,
        lengthOverall: vessel.lengthOverall ?? null,
        beam: vessel.beam ?? null,
      });
    }
  }, [vessel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <Anchor className="w-8 h-8 text-[#002b49] animate-pulse" />
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
              Sign in to manage settings
            </h2>
            <button onClick={() => startLogin()} className="btn-primary px-8">
              Sign In
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
          <div className="px-4 py-5 border-b border-[#e2e2e2]">
            <div className="flex items-center gap-2 mb-1">
              <Ship className="w-3.5 h-3.5 text-[#42474d]" />
              <span
                className="text-[11px] font-medium text-[#002b49] truncate"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {form.boatName || user?.name || "My Vessel"}
              </span>
            </div>
            <p
              className="text-[10px] text-[#42474d] pl-5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {form.boatType || "Great Loop Expedition"}
            </p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {[
              { icon: BarChart3, label: "Dashboard" },
              { icon: Layers, label: "Route Map" },
              { icon: Fuel, label: "Fuel Calculator" },
              { icon: Wrench, label: "Maintenance" },
              { icon: Users, label: "Community" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="sidebar-item w-full text-left"
                onClick={() => toast.info("Feature coming soon")}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

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
            <div className="max-w-[800px] mx-auto">
              <p
                className="text-[10px] text-[#42474d] uppercase tracking-widest mb-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Configuration
              </p>
              <h1
                className="text-[28px] font-bold text-[#002b49]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Vessel Profile
              </h1>
            </div>
          </div>

          <div className="px-8 lg:px-10 py-8">
            <div className="max-w-[800px] mx-auto space-y-6">

              {/* Account card */}
              <div className="card-maritime p-6">
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-4 h-4 text-[#002b49]" />
                  <h2
                    className="text-[13px] font-semibold text-[#002b49] uppercase tracking-widest"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Account
                  </h2>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-[15px] font-semibold text-[#002b49]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {user?.name}
                    </p>
                    <p
                      className="text-[11px] text-[#42474d] mt-0.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {user?.email}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#002b49] flex items-center justify-center">
                    <span
                      className="text-white text-[13px] font-semibold"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() ?? "GL"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vessel identity */}
              <div className="card-maritime p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Ship className="w-4 h-4 text-[#002b49]" />
                  <h2
                    className="text-[13px] font-semibold text-[#002b49] uppercase tracking-widest"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Vessel Identity
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TechInput
                    label="Boat Name"
                    type="text"
                    value={form.boatName}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, boatName: v as string }))
                    }
                    placeholder="e.g. Sea Wanderer"
                  />
                  <TechInput
                    label="Boat Type"
                    type="text"
                    value={form.boatType}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, boatType: v as string }))
                    }
                    placeholder="e.g. Trawler, Cruiser"
                  />
                </div>
              </div>

              {/* Dimensions & Performance */}
              <div className="card-maritime p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-4 h-4 text-[#002b49]" />
                  <h2
                    className="text-[13px] font-semibold text-[#002b49] uppercase tracking-widest"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Dimensions &amp; Performance
                  </h2>
                </div>
                <p
                  className="text-[11px] text-[#42474d] mb-5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Used for bridge clearance warnings and travel time calculations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TechInput
                    label="Draft"
                    value={form.draft}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, draft: v as number | null }))
                    }
                    unit="feet"
                    placeholder="e.g. 3.5"
                  />
                  <TechInput
                    label="Air Draft / Bridge Clearance"
                    value={form.airDraft}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, airDraft: v as number | null }))
                    }
                    unit="feet"
                    placeholder="e.g. 15.5"
                  />
                  <TechInput
                    label="Cruising Speed"
                    value={form.cruisingSpeed}
                    onChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        cruisingSpeed: v as number | null,
                      }))
                    }
                    unit="knots"
                    placeholder="e.g. 8"
                  />
                  <TechInput
                    label="Fuel Range"
                    value={form.fuelRange}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, fuelRange: v as number | null }))
                    }
                    unit="naut. miles"
                    placeholder="e.g. 400"
                  />
                  <TechInput
                    label="Length Overall"
                    value={form.lengthOverall}
                    onChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        lengthOverall: v as number | null,
                      }))
                    }
                    unit="feet"
                    placeholder="e.g. 42"
                  />
                  <TechInput
                    label="Beam"
                    value={form.beam}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, beam: v as number | null }))
                    }
                    unit="feet"
                    placeholder="e.g. 14"
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  onClick={() => upsert.mutate(form)}
                  disabled={upsert.isPending}
                  className="btn-primary px-8 disabled:opacity-60"
                >
                  {upsert.isPending ? "Saving…" : "Save Vessel Profile"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
