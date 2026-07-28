import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Anchor, Ship, User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function NumberInput({ label, value, onChange, unit, placeholder }: {
  label: string; value: number | null | undefined; onChange: (v: number | null) => void;
  unit: string; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          step="0.1"
          placeholder={placeholder ?? "—"}
          value={value ?? ""}
          onChange={e => onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-16 shrink-0">{unit}</span>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const { data: vessel } = trpc.vessel.get.useQuery(undefined, { enabled: isAuthenticated });
  const upsert = trpc.vessel.upsert.useMutation({ onSuccess: () => toast.success("Vessel profile saved") });

  const [form, setForm] = useState({
    boatName: "", boatType: "",
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

  if (loading) return <div className="min-h-screen bg-background" />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppNav />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center max-w-sm px-4">
            <Anchor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-serif text-2xl mb-2">Sign in to manage settings</h2>
            <Button onClick={() => startLogin()}>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="pt-16">
        <div className="container py-8 max-w-2xl">
          <h1 className="font-serif text-3xl font-semibold mb-1">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your account and vessel profile</p>

          {/* Account */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <User className="w-4 h-4" /> Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm text-primary-foreground font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vessel Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <Ship className="w-4 h-4" /> Vessel Profile
              </CardTitle>
              <CardDescription>
                Your boat's specifications help with route planning and bridge clearance awareness.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Boat Name</Label>
                  <Input placeholder="e.g. Sea Wanderer" value={form.boatName} onChange={e => setForm(f => ({ ...f, boatName: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Boat Type</Label>
                  <Input placeholder="e.g. Trawler, Cruiser" value={form.boatType} onChange={e => setForm(f => ({ ...f, boatType: e.target.value }))} />
                </div>
              </div>

              <Separator />
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Dimensions & Performance</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberInput label="Draft" value={form.draft} onChange={v => setForm(f => ({ ...f, draft: v }))} unit="feet" placeholder="e.g. 3.5" />
                <NumberInput label="Air Draft / Bridge Clearance" value={form.airDraft} onChange={v => setForm(f => ({ ...f, airDraft: v }))} unit="feet" placeholder="e.g. 15.5" />
                <NumberInput label="Cruising Speed" value={form.cruisingSpeed} onChange={v => setForm(f => ({ ...f, cruisingSpeed: v }))} unit="knots" placeholder="e.g. 8" />
                <NumberInput label="Fuel Range" value={form.fuelRange} onChange={v => setForm(f => ({ ...f, fuelRange: v }))} unit="naut. miles" placeholder="e.g. 400" />
                <NumberInput label="Length Overall" value={form.lengthOverall} onChange={v => setForm(f => ({ ...f, lengthOverall: v }))} unit="feet" placeholder="e.g. 42" />
                <NumberInput label="Beam" value={form.beam} onChange={v => setForm(f => ({ ...f, beam: v }))} unit="feet" placeholder="e.g. 14" />
              </div>

              <div className="pt-2">
                <Button onClick={() => upsert.mutate(form)} disabled={upsert.isPending}>
                  {upsert.isPending ? "Saving…" : "Save Vessel Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
