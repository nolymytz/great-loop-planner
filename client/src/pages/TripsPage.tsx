import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Trip } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Anchor, Calendar, Compass, Map, Plus, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

const STATUS_STYLE: Record<string, string> = {
  planning:  'bg-blue-50 text-blue-700 border border-blue-200',
  active:    'bg-green-50 text-green-700 border border-green-200',
  paused:    'bg-amber-50 text-amber-700 border border-amber-200',
  completed: 'bg-gray-50 text-gray-500 border border-gray-200',
};

const COLORS = ['#002b49','#0ea5e9','#10b981','#f59e0b','#8b5cf6','#ef4444','#ec4899','#14b8a6'];

export default function TripsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', status: 'planning', banner_color: '#002b49', start_date: '', end_date: '' });

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('trips').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!user,
  });

  const createTrip = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.from('trips').insert({
        user_id: user!.id,
        name: form.name,
        description: form.description || null,
        status: form.status,
        banner_color: form.banner_color,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      }).select().single();
      if (error) throw error;
      return data as Trip;
    },
    onSuccess: (trip) => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      setOpen(false);
      setForm({ name: '', description: '', status: 'planning', banner_color: '#002b49', start_date: '', end_date: '' });
      toast.success('Expedition created');
      navigate(`/planner/${trip.id}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteTrip = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('trips').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['trips'] }); toast.success('Trip deleted'); },
  });

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-[#6b7280] uppercase tracking-widest mb-1 font-mono">My Expeditions</p>
            <h1 className="font-serif text-3xl font-bold text-[#002b49]">Route Map</h1>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#002b49] hover:bg-[#003a63] text-white gap-2"><Plus className="w-4 h-4" /> New Expedition</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle className="font-serif text-[#002b49]">Create New Expedition</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Name *</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Great Loop 2027" /></div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Notes about this trip..." rows={2} className="resize-none" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Status</Label>
                    <Select value={form.status} onValueChange={v => setForm(f => ({...f, status: v}))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Color</Label>
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      {COLORS.map(c => (
                        <button key={c} onClick={() => setForm(f => ({...f, banner_color: c}))}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${form.banner_color === c ? 'border-[#002b49] scale-110' : 'border-transparent'}`}
                          style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Start Date</Label><Input type="date" value={form.start_date} onChange={e => setForm(f => ({...f, start_date: e.target.value}))} /></div>
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm(f => ({...f, end_date: e.target.value}))} /></div>
                </div>
                <Button onClick={() => createTrip.mutate()} disabled={!form.name || createTrip.isPending} className="w-full bg-[#002b49] hover:bg-[#003a63] text-white">
                  {createTrip.isPending ? 'Creating...' : 'Create Expedition'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Anchor className="w-8 h-8 text-[#002b49] animate-pulse" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#e5e7eb] rounded-xl bg-white">
            <div className="w-14 h-14 rounded-full bg-[#f3f4f6] flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-[#6b7280]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#002b49] mb-2">No expeditions yet</h3>
            <p className="text-[#6b7280] text-sm mb-6">Create your first Great Loop expedition to begin planning.</p>
            <Button onClick={() => setOpen(true)} variant="outline" className="gap-2 border-[#002b49] text-[#002b49]"><Plus className="w-4 h-4" /> Create Your First Expedition</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trips.map(trip => (
              <div key={trip.id} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden cursor-pointer hover:shadow-md hover:border-[#002b49]/20 transition-all group"
                onClick={() => navigate(`/planner/${trip.id}`)}>
                <div className="h-1.5" style={{ background: trip.banner_color ?? '#002b49' }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold text-[#002b49] truncate">{trip.name}</h3>
                      {trip.description && <p className="text-sm text-[#6b7280] mt-0.5 line-clamp-2">{trip.description}</p>}
                    </div>
                    <span className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[trip.status] ?? STATUS_STYLE.planning}`}>{trip.status}</span>
                  </div>
                  {(trip.start_date || trip.end_date) && (
                    <div className="flex items-center gap-1.5 mb-3 text-xs text-[#6b7280]">
                      <Calendar className="w-3 h-3" />
                      <span className="font-mono">
                        {trip.start_date && format(new Date(trip.start_date), 'MMM yyyy')}
                        {trip.start_date && trip.end_date && ' – '}
                        {trip.end_date && format(new Date(trip.end_date), 'MMM yyyy')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#f3f4f6]">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#002b49] text-white rounded-lg text-xs font-medium hover:bg-[#003a63] transition-colors"
                      onClick={e => { e.stopPropagation(); navigate(`/planner/${trip.id}`); }}>
                      <Map className="w-3 h-3" /> Open Planner
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-[#e5e7eb] rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                      onClick={e => { e.stopPropagation(); deleteTrip.mutate(trip.id); }}>
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="border border-dashed border-[#e5e7eb] rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-[#002b49]/40 hover:bg-[#f9f9f9] transition-colors min-h-[180px] group"
              onClick={() => setOpen(true)}>
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#d1d5db] group-hover:border-[#002b49]/40 flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-4 h-4 text-[#9ca3af]" />
              </div>
              <p className="text-xs text-[#9ca3af] uppercase tracking-widest font-mono">New Expedition</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
