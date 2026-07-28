import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Star, Phone, Globe, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { POI_CATEGORIES } from "@shared/types";

// Inline type to avoid importing from server-side drizzle schema
interface Poi {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address?: string | null;
  description?: string | null;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  imageUrl?: string | null;
  tags?: unknown;
}

interface Props {
  poi: Poi;
  tripId: number | null;
  onClose: () => void;
  onAddedToTrip: () => void;
}

export function PoiDetailPanel({ poi, tripId, onClose, onAddedToTrip }: Props) {
  const { isAuthenticated } = useAuth();
  const catInfo = POI_CATEGORIES.find(c => c.value === poi.category);
  const addWaypoint = trpc.waypoints.add.useMutation({
    onSuccess: () => { toast.success(`${poi.name} added to trip!`); onAddedToTrip(); },
    onError: () => toast.error("Failed to add to trip"),
  });

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 xl:w-96 bg-white border-l border-border shadow-xl flex flex-col z-20 overflow-hidden">
      <div className="flex items-start justify-between p-4 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{catInfo?.icon}</span>
            <Badge variant="secondary" className="text-xs capitalize">
              {catInfo?.label ?? poi.category}
            </Badge>
          </div>
          <h3 className="font-serif font-semibold text-lg leading-tight">{poi.name}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-md transition-colors ml-2 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {poi.rating && (
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-4 h-4 ${s <= Math.round(poi.rating!) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
            <span className="text-sm text-muted-foreground ml-1">{poi.rating.toFixed(1)}</span>
          </div>
        )}

        {poi.address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{poi.address}</span>
          </div>
        )}

        {poi.description && (
          <p className="text-sm text-foreground leading-relaxed">{poi.description}</p>
        )}

        {(poi.phone || poi.website) && (
          <>
            <Separator />
            <div className="space-y-2">
              {poi.phone && (
                <a href={`tel:${poi.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Phone className="w-4 h-4" /> {poi.phone}
                </a>
              )}
              {poi.website && (
                <a href={poi.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline truncate">
                  <Globe className="w-4 h-4 shrink-0" /> {poi.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </>
        )}

        {Array.isArray(poi.tags) && poi.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {(poi.tags as string[]).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs capitalize">{tag.replace(/-/g, " ")}</Badge>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        {isAuthenticated && tripId ? (
          <Button
            className="w-full gap-2"
            onClick={() => addWaypoint.mutate({
              tripId,
              name: poi.name,
              lat: poi.lat,
              lng: poi.lng,
              address: poi.address ?? undefined,
              category: poi.category,
              poiId: poi.id,
            })}
            disabled={addWaypoint.isPending}
          >
            <Plus className="w-4 h-4" />
            {addWaypoint.isPending ? "Adding…" : "Add to Trip"}
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground text-center">Sign in and open a trip to add this stop.</p>
        )}
      </div>
    </div>
  );
}
