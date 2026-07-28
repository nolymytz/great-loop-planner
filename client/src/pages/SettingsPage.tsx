import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type VesselProfile } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Anchor, Ship, Save, Ruler, Gauge, Wind } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type FormState = {
  boat_name: string; boat_type: string; length_overall: string; beam: string;
  draft: string; air_draft: string; cruising_speed: string; fuel_capacity: string;
  fuel_consumption: string; fuel_range: string; engine_type: string;
  hull_material: string; year_built: string; notes: string;
};
const EMPTY: FormState = {
  boat_name:'',boat_type:'',length_overall:'',beam:'',draft:'',air_draft:'',
  cruising_speed:'',fuel_capacity:'',fuel_consumption:'',fuel_range:'',
  engine_type:'',hull_material:'',year_built:'',notes:'',
};

export default function SettingsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY);

  const { data: vessel, isLoading } = useQuery({
    queryKey: ['vessel', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('vessel_profiles').select('*').eq('user_id', user!.id).maybeSingle();
      return data as VesselProfile | null;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (vessel) setForm({
      boat_name: vessel.boat_name ?? '', boat_type: vessel.boat_type ?? '',
      length_overall: vessel.length_overall?.toString() ?? '', beam: vessel.beam?.toString() ?? '',
      draft: vessel.draft?.toString() ?? '', air_draft: vessel.air_draft?.toString() ?? '',
      cruising_speed: vessel.cruising_speed?.toString() ?? '', fuel_capacity: vessel.fuel_capacity?.toString() ?? '',
      fuel_consumption: vessel.fuel_consumption?.toString() ?? '', fuel_range: vessel.fuel_range?.toString() ?? '',
      engine_type: vessel.engine_type ?? '', hull_material: vessel.hull_material ?? '',
      year_built: vessel.year_built?.toString() ?? '', notes: vessel.notes ?? '',
    });
  }, [vessel]);

  const save = useMutation({
    mutationFn: async () => {
      const p = {
        user_id: user!.id,
        boat_name: form.boat_name || null, boat_type: form.boat_type || null,
        length_overall: form.length_overall ? parseFloat(form.length_overall) : null,
        beam: form.beam ? parseFloat(form.beam) : null,
        draft: form.draft ? parseFloat(form.draft) : null,
        air_draft: form.air_draft ? parseFloat(form.air_draft) : null,
        cruising_speed: form.cruising_speed ? parseFloat(form.cruising_speed) : null,
        fuel_capacity: form.fuel_capacity ? parseFloat(form.fuel_capacity) : null,
        fuel_consumption: form.fuel_consumption ? parseFloat(form.fuel_consumption) : null,
        fuel_range: form.fuel_range ? parseFloat(form.fuel_range) : null,
        engine_type: form.engine_type || null, hull_material: form.hull_material || null,
        year_built: form.year_built ? parseInt(form.year_built) : null,
        notes: form.notes || null,
      };
      const { error } = await supabase.from('vessel_profiles').upsert(p, { onConflict: 'user_id' });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vessel'] }); toast.success('Vessel profile saved'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-[#6b7280] uppercase tracking-widest mb-1 font-mono">Configuration</p>
          <h1 className="font-serif text-3xl font-bold text-[#002b49]">Vessel Profile</h1>
          <p className="text-sm text-[#6b7280] mt-1">Your boat's specifications are used for travel time and fuel calculations throughout the planner.</p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-24"><Anchor className="w-8 h-8 text-[#002b49] animate-pulse" /></div>
        ) : (
          <div className="space-y-6">
            {/* Identity */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <div className="flex items-center gap-2 mb-5"><Ship className="w-4 h-4 text-[#002b49]" /><h2 className="font-semibold text-[#002b49] text-sm uppercase tracking-wider font-mono">Vessel Identity</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151] font-mono">Boat Name</Label><Input value={form.boat_name} onChange={set('boat_name')} placeholder="e.g. Sea Mist" /></div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151] font-mono">Boat Type</Label>
                  <Select value={form.boat_type} onValueChange={v => setForm(f=>({...f,boat_type:v}))}>
                    <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                    <SelectContent>
                      {['trawler','motoryacht','sailboat','powerboat','houseboat','catamaran','other'].map(t=><SelectItem key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151] font-mono">Year Built</Label><Input value={form.year_built} onChange={set('year_built')} placeholder="e.g. 2018" type="number" /></div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151] font-mono">Hull Material</Label>
                  <Select value={form.hull_material} onValueChange={v => setForm(f=>({...f,hull_material:v}))}>
                    <SelectTrigger><SelectValue placeholder="Select material..." /></SelectTrigger>
                    <SelectContent>
                      {['fiberglass','aluminum','steel','wood','composite'].map(m=><SelectItem key={m} value={m}>{m.charAt(0).toUpperCase()+m.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* Dimensions */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <div className="flex items-center gap-2 mb-5"><Ruler className="w-4 h-4 text-[#002b49]" /><h2 className="font-semibold text-[#002b49] text-sm uppercase tracking-wider font-mono">Dimensions</h2></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {([['length_overall','Length Overall','ft'],['beam','Beam','ft'],['draft','Draft','ft'],['air_draft','Air Draft / Bridge Clearance','ft']] as const).map(([k,l,u])=>(
                  <div key={k} className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151] font-mono">{l} <span className="text-[#9ca3af] normal-case">({u})</span></Label><Input value={form[k]} onChange={set(k)} placeholder="0.0" type="number" step="0.1" /></div>
                ))}
              </div>
            </div>
            {/* Performance */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <div className="flex items-center gap-2 mb-5"><Gauge className="w-4 h-4 text-[#002b49]" /><h2 className="font-semibold text-[#002b49] text-sm uppercase tracking-wider font-mono">Performance &amp; Fuel</h2></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {([['cruising_speed','Cruising Speed','kts'],['fuel_capacity','Fuel Capacity','gal'],['fuel_consumption','Fuel Consumption','gph'],['fuel_range','Fuel Range','nm']] as const).map(([k,l,u])=>(
                  <div key={k} className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151] font-mono">{l} <span className="text-[#9ca3af] normal-case">({u})</span></Label><Input value={form[k]} onChange={set(k)} placeholder="0" type="number" step="0.1" /></div>
                ))}
              </div>
            </div>
            {/* Engine & Notes */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <div className="flex items-center gap-2 mb-5"><Wind className="w-4 h-4 text-[#002b49]" /><h2 className="font-semibold text-[#002b49] text-sm uppercase tracking-wider font-mono">Engine &amp; Notes</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151] font-mono">Engine Type</Label>
                  <Select value={form.engine_type} onValueChange={v => setForm(f=>({...f,engine_type:v}))}>
                    <SelectTrigger><SelectValue placeholder="Select engine..." /></SelectTrigger>
                    <SelectContent>
                      {[['diesel_single','Diesel Single'],['diesel_twin','Diesel Twin'],['gas_single','Gas Single'],['gas_twin','Gas Twin'],['electric','Electric'],['hybrid','Hybrid'],['sail','Sail']].map(([v,l])=><SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs uppercase tracking-wider text-[#374151] font-mono">Notes</Label><Textarea value={form.notes} onChange={set('notes')} placeholder="Any additional notes about your vessel..." rows={3} className="resize-none" /></div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => save.mutate()} disabled={save.isPending} className="bg-[#002b49] hover:bg-[#003a63] text-white gap-2">
                <Save className="w-4 h-4" />{save.isPending ? 'Saving...' : 'Save Vessel Profile'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
