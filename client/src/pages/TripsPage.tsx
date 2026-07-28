import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Map, Anchor, Calendar, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { TRIP_STATUS_COLORS, TRIP_STATUS_LABELS } from "@shared/types";
import { CreateTripDialog } from "@/components/CreateTripDialog";
import { format } from "date-fns";

export default function TripsPage() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [showCreate, setShowCreate] = useState(false);

  const { data: trips = [], refetch } = trpc.trips.list.useQuery(undefined, { enabled: isAuthenticated });
  const deleteTrip = trpc.trips.delete.useMutation({
    onSuccess: () => { toast.success("Trip deleted"); refetch(); },
  });

  if (loading) return <div className="min-h-screen bg-background" />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppNav />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center max-w-sm px-4">
            <Anchor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-serif text-2xl mb-2">Sign in to plan your voyage</h2>
            <p className="text-muted-foreground mb-6 text-sm">Your trips are saved securely to your account and sync across all devices.</p>
            <Button onClick={() => startLogin()}>Sign In to Continue</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="pt-16">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-semibold">My Trips</h1>
              <p className="text-muted-foreground mt-1">Plan and manage your Great Loop voyages</p>
            </div>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-4 h-4" /> New Trip
            </Button>
          </div>

          {trips.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
              <Anchor className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-serif text-xl mb-1">No trips yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Create your first Great Loop trip to get started.</p>
              <Button onClick={() => setShowCreate(true)} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> Create Your First Trip
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map(trip => (
                <Card key={trip.id} className="group overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div
                    className="h-2"
                    style={{ background: trip.bannerColor ?? "#1e3a5f" }}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-semibold text-lg truncate">{trip.name}</h3>
                        {trip.description && (
                          <p className="text-muted-foreground text-sm mt-0.5 line-clamp-2">{trip.description}</p>
                        )}
                      </div>
                      <Badge className={`ml-2 shrink-0 text-xs ${TRIP_STATUS_COLORS[trip.status]}`}>
                        {TRIP_STATUS_LABELS[trip.status]}
                      </Badge>
                    </div>

                    {(trip.startDate || trip.endDate) && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {trip.startDate && format(new Date(trip.startDate), "MMM yyyy")}
                        {trip.startDate && trip.endDate && " – "}
                        {trip.endDate && format(new Date(trip.endDate), "MMM yyyy")}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={() => navigate(`/planner/${trip.id}`)}
                      >
                        <Map className="w-3.5 h-3.5" /> Open Planner
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-9 h-9 p-0"
                        onClick={(e) => { e.stopPropagation(); deleteTrip.mutate({ id: trip.id }); }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <CreateTripDialog open={showCreate} onClose={() => setShowCreate(false)} onCreated={(id) => navigate(`/planner/${id}`)} />
    </div>
  );
}
