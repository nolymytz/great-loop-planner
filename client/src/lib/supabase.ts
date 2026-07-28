import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ── Database type helpers ──────────────────────────────────────────────────
export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type VesselProfile = {
  id: string;
  user_id: string;
  boat_name: string | null;
  boat_type: string | null;
  draft: number | null;
  air_draft: number | null;
  cruising_speed: number | null;
  fuel_range: number | null;
  fuel_capacity: number | null;
  fuel_consumption: number | null;
  length_overall: number | null;
  beam: number | null;
  engine_type: string | null;
  hull_material: string | null;
  year_built: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Trip = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'planning' | 'active' | 'paused' | 'completed';
  start_date: string | null;
  end_date: string | null;
  banner_color: string;
  created_at: string;
  updated_at: string;
};

export type Waypoint = {
  id: string;
  trip_id: string;
  user_id: string;
  name: string;
  lat: number;
  lng: number;
  address: string | null;
  sort_order: number;
  planned_date: string | null;
  date_tbd: boolean;
  notes: string | null;
  poi_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Poi = {
  id: string;
  name: string;
  category: 'marina' | 'anchorage' | 'fuel_dock' | 'restaurant' | 'museum' | 'attraction';
  lat: number;
  lng: number;
  address: string | null;
  description: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  tags: string[] | null;
  created_at: string;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  trip_id: string | null;
  waypoint_id: string | null;
  title: string | null;
  content: string | null;
  todo_items: Array<{ text: string; done: boolean }>;
  created_at: string;
  updated_at: string;
};

export type MaintenanceTask = {
  id: string;
  user_id: string;
  title: string;
  category: 'engine' | 'electrical' | 'hull' | 'rigging' | 'safety' | 'navigation' | 'plumbing' | 'general';
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date: string | null;
  completed_date: string | null;
  interval_months: number | null;
  cost: number | null;
  vendor: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DreamBoat = {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  model: string | null;
  year_min: number | null;
  year_max: number | null;
  length_min: number | null;
  length_max: number | null;
  hull_type: 'monohull' | 'catamaran' | 'trawler' | 'powercat' | 'other' | null;
  boat_type: 'sailboat' | 'powerboat' | 'trawler' | 'motoryacht' | 'houseboat' | 'other' | null;
  price_min: number | null;
  price_max: number | null;
  must_have_features: string[] | null;
  nice_to_have_features: string[] | null;
  dealbreakers: string[] | null;
  notes: string | null;
  rating: number | null;
  status: 'researching' | 'shortlisted' | 'contacted' | 'visited' | 'purchased' | 'passed';
  listing_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  list_type: 'place' | 'activity' | 'gear';
  title: string;
  description: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  category: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'wishlist' | 'planned' | 'done';
  notes: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
};

