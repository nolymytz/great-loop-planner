import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type DreamBoat } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ship, Plus, Trash2, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  researching: { label: 'Researching', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  shortlisted: { label: 'Shortlisted', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  contacted: { label: 'Contacted', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  visited: { label: 'Visited', color: 'bg-green-50 text-green-700 border-green-200' },
  purchased: { label: 'Purchased', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  passed: { label: 'Passed', color: 'bg-gray-50 text-gray-500 border-gray-200' },
};

const BOAT_TYPES = ['sailboat','powerboat','trawler','motoryacht','houseboat','other'];
const HULL_TYPES = ['monohull','catamaran','trawler','powercat','other'];

export default function DreamBoatPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', brand: '', model: '', year_min: '', year_max: '',
    length_min: '', length_max: '', boat_type: '', hull_type: '',
    price_min: '', price_max: '', notes: '', listing_url: '', status: 'researching',
    must_haves: '', nice_to_haves: '', dealbreakers: '',
  });

  const { data: boats = [], isLoading } = useQuery({
    queryKey: ['dream-boats', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('dream_boats').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data as DreamBoat[];
    },
    enabled: !!user,
  });

  const addBoat = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('dream_boats').insert({
        user_id: user!.id,
        name: form.name,
        brand: form.brand || null,
        model: form.model || null,
        year_min: form.year_min ? parseInt(form.year_min) : null,
        year_max: form.year_max ? parseInt(form.year_max) : null,
        length_min: form.length_min ? parseFloat(form.length_min) : null,
        length_max: form.length_max ? parseFloat(form.length_max) : null,
        boat_type: form.boat_type || null,
        hull_type: form.hull_type || null,
        price_min: form.price_min ? parseFloat(form.price_min) : null,
        price_max: form.price_max ? parseFloat(form.price_max) : null,
        notes: form.notes || null,
        listing_url: form.listing_url || null,
        status: form.status,
        must_have_features: form.must_haves ? form.must_haves.split('\n').filter(Boolean) : null,
        nice_to_have_features: form.nice_to_haves ? form.nice_to_haves.split('\n').filter(Boolean) : null,
        dealbreakers: form.dealbreakers ? form.dealbreakers.split('\n').filter(Boolean) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['dream-boats'] }); setOpen(false); toast.success('Boat added to your list'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteBoat = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('dream_boats').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['dream-boats'] }); toast.success('Removed from list'); },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('dream_boats').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dream-boats'] }),
  });

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#002b49]">Dream Boat</h1>
            <p className="text-[#6b7280] text-sm mt-1">Research and track boats you're considering for the Great Loop</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#002b49] hover:bg-[#003a63] text-white gap-2"><Plus className="w-4 h-4" /> Add Boat</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-serif text-[#002b49]">Add a Boat to Research</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Name / Nickname *</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. My Trawler Dream" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Brand / Make</Label><Input value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} placeholder="e.g. Nordhavn, Kadey-Krogen" /></div>
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Model</Label><Input value={form.model} onChange={e => setForm(f => ({...f, model: e.target.value}))} placeholder="e.g. N40, 42" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Boat Type</Label>
                    <Select value={form.boat_type} onValueChange={v => setForm(f => ({...f, boat_type: v}))}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{BOAT_TYPES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Hull Type</Label>
                    <Select value={form.hull_type} onValueChange={v => setForm(f => ({...f, hull_type: v}))}>
                      <SelectTrigger><SelectValue placeholder="Select hull" /></SelectTrigger>
                      <SelectContent>{HULL_TYPES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Length Range (ft)</Label>
                    <div className="flex gap-2"><Input value={form.length_min} onChange={e => setForm(f => ({...f, length_min: e.target.value}))} placeholder="Min" type="number" /><Input value={form.length_max} onChange={e => setForm(f => ({...f, length_max: e.target.value}))} placeholder="Max" type="number" /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Year Range</Label>
                    <div className="flex gap-2"><Input value={form.year_min} onChange={e => setForm(f => ({...f, year_min: e.target.value}))} placeholder="From" type="number" /><Input value={form.year_max} onChange={e => setForm(f => ({...f, year_max: e.target.value}))} placeholder="To" type="number" /></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Price Range ($)</Label>
                    <div className="flex gap-2"><Input value={form.price_min} onChange={e => setForm(f => ({...f, price_min: e.target.value}))} placeholder="Min" type="number" /><Input value={form.price_max} onChange={e => setForm(f => ({...f, price_max: e.target.value}))} placeholder="Max" type="number" /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Status</Label>
                    <Select value={form.status} onValueChange={v => setForm(f => ({...f, status: v}))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(STATUS_LABELS).map(([v, {label}]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Must-Have Features (one per line)</Label><Textarea value={form.must_haves} onChange={e => setForm(f => ({...f, must_haves: e.target.value}))} placeholder="Flybridge&#10;Stabilizers&#10;Generator" rows={3} className="resize-none text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Nice-to-Have Features (one per line)</Label><Textarea value={form.nice_to_haves} onChange={e => setForm(f => ({...f, nice_to_haves: e.target.value}))} placeholder="Watermaker&#10;Bow thruster" rows={2} className="resize-none text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Dealbreakers (one per line)</Label><Textarea value={form.dealbreakers} onChange={e => setForm(f => ({...f, dealbreakers: e.target.value}))} placeholder="No air conditioning&#10;Single engine" rows={2} className="resize-none text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Listing URL</Label><Input value={form.listing_url} onChange={e => setForm(f => ({...f, listing_url: e.target.value}))} placeholder="https://www.yachtworld.com/..." /></div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Your thoughts on this boat..." rows={3} className="resize-none text-sm" /></div>
                <Button onClick={() => addBoat.mutate()} disabled={!form.name || addBoat.isPending} className="w-full bg-[#002b49] hover:bg-[#003a63] text-white">
                  {addBoat.isPending ? 'Adding...' : 'Add to Research List'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[#9ca3af]">Loading boats...</div>
        ) : boats.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-[#e5e7eb]">
            <Ship className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
            <div className="text-[#374151] font-medium font-serif text-lg">No boats in your research list</div>
            <div className="text-[#9ca3af] text-sm mt-1 max-w-xs mx-auto">Start tracking boats you're considering — brands, sizes, features, and more</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boats.map(boat => {
              const statusCfg = STATUS_LABELS[boat.status];
              return (
                <div key={boat.id} className="bg-white rounded-lg border border-[#e5e7eb] p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-serif font-semibold text-[#002b49]">{boat.name}</h3>
                      {(boat.brand || boat.model) && <div className="text-sm text-[#6b7280] mt-0.5">{[boat.brand, boat.model].filter(Boolean).join(' ')}</div>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Select value={boat.status} onValueChange={v => updateStatus.mutate({ id: boat.id, status: v })}>
                        <SelectTrigger className={`h-6 text-xs border px-2 ${statusCfg.color}`}><SelectValue /></SelectTrigger>
                        <SelectContent>{Object.entries(STATUS_LABELS).map(([v, {label}]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}</SelectContent>
                      </Select>
                      <button onClick={() => deleteBoat.mutate(boat.id)} className="text-[#d1d5db] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    {boat.boat_type && <div className="bg-[#f9f9f9] rounded p-2"><div className="text-[#9ca3af]">Type</div><div className="font-medium text-[#374151] capitalize">{boat.boat_type}</div></div>}
                    {(boat.length_min || boat.length_max) && <div className="bg-[#f9f9f9] rounded p-2"><div className="text-[#9ca3af]">Length</div><div className="font-medium text-[#374151]">{boat.length_min && boat.length_max ? `${boat.length_min}–${boat.length_max} ft` : `${boat.length_min || boat.length_max} ft`}</div></div>}
                    {(boat.price_min || boat.price_max) && <div className="bg-[#f9f9f9] rounded p-2"><div className="text-[#9ca3af]">Budget</div><div className="font-medium text-[#374151]">{boat.price_max ? `$${(boat.price_max/1000).toFixed(0)}k` : `$${(boat.price_min!/1000).toFixed(0)}k+`}</div></div>}
                  </div>

                  {boat.must_have_features && boat.must_have_features.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-[#374151] mb-1">Must-Haves</div>
                      <div className="flex flex-wrap gap-1">{boat.must_have_features.map((f, i) => <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">{f}</span>)}</div>
                    </div>
                  )}

                  {boat.notes && <p className="text-xs text-[#6b7280] mt-2 line-clamp-2">{boat.notes}</p>}

                  {boat.listing_url && (
                    <a href={boat.listing_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#002b49] hover:underline mt-2">
                      <ExternalLink className="w-3 h-3" /> View Listing
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

