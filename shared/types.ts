export type PoiCategory = "marina" | "anchorage" | "fuel_dock" | "restaurant" | "museum" | "attraction";
export type TripStatus = "planning" | "active" | "paused" | "completed";

export const POI_CATEGORIES: { value: PoiCategory | "all"; label: string; icon: string; color: string }[] = [
  { value: "all",         label: "All",        icon: "🗺️",  color: "#4B5563" },
  { value: "marina",      label: "Marinas",    icon: "⚓",  color: "#1D4ED8" },
  { value: "anchorage",   label: "Anchorages", icon: "🪝",  color: "#0891B2" },
  { value: "fuel_dock",   label: "Fuel Docks", icon: "⛽",  color: "#D97706" },
  { value: "restaurant",  label: "Restaurants",icon: "🍽️",  color: "#DC2626" },
  { value: "museum",      label: "Museums",    icon: "🏛️",  color: "#7C3AED" },
  { value: "attraction",  label: "Attractions",icon: "⭐",  color: "#059669" },
];

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  planning:  "Planning",
  active:    "Active",
  paused:    "Paused",
  completed: "Completed",
};

export const TRIP_STATUS_COLORS: Record<TripStatus, string> = {
  planning:  "bg-blue-100 text-blue-800",
  active:    "bg-green-100 text-green-800",
  paused:    "bg-amber-100 text-amber-800",
  completed: "bg-gray-100 text-gray-700",
};
