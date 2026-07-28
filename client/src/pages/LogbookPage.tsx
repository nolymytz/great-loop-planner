import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type JournalEntry, type Trip } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function LogbookPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', trip_id: '' });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('trips').select('id, name').eq('user_id', user!.id).order('created_at', { ascending: false });
      return (data || []) as Pick<Trip, 'id' | 'name'>[];
    },
    enabled: !!user,
  });

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journal', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('journal_entries').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data as JournalEntry[];
    },
    enabled: !!user,
  });

  const addEntry = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('journal_entries').insert({
        user_id: user!.id,
        title: form.title || null,
        content: form.content,
        trip_id: form.trip_id || null,
        todo_items: [],
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['journal'] }); setOpen(false); setForm({ title: '', content: '', trip_id: '' }); toast.success('Entry added to logbook'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('journal_entries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['journal'] }); toast.success('Entry deleted'); },
  });

  const tripName = (id: string | null) => trips.find(t => t.id === id)?.name;

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#002b49]">Logbook</h1>
            <p className="text-[#6b7280] text-sm mt-1">Your personal voyage journal — notes, memories, and observations</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#002b49] hover:bg-[#003a63] text-white gap-2"><Plus className="w-4 h-4" /> New Entry</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle className="font-serif text-[#002b49]">New Logbook Entry</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Title (optional)</Label>
                  <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Arrived in Beaufort, NC" />
                </div>
                {trips.length > 0 && (
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Associate with Trip</Label>
                    <Select value={form.trip_id} onValueChange={v => setForm(f => ({...f, trip_id: v}))}>
                      <SelectTrigger><SelectValue placeholder="No trip (general entry)" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No trip</SelectItem>
                        {trips.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Entry *</Label>
                  <Textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} placeholder="Write your logbook entry here..." rows={6} className="resize-none" />
                </div>
                <Button onClick={() => addEntry.mutate()} disabled={!form.content || addEntry.isPending} className="w-full bg-[#002b49] hover:bg-[#003a63] text-white">
                  {addEntry.isPending ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[#9ca3af]">Loading logbook...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-[#e5e7eb]">
            <BookOpen className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
            <div className="text-[#374151] font-medium font-serif text-lg">Your logbook is empty</div>
            <div className="text-[#9ca3af] text-sm mt-1 max-w-xs mx-auto">Start recording your voyage notes, observations, and memories here</div>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className="bg-white rounded-lg border border-[#e5e7eb] p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    {entry.title && <h3 className="font-serif font-semibold text-[#002b49]">{entry.title}</h3>}
                    <div className="flex items-center gap-2 text-xs text-[#9ca3af] mt-0.5">
                      <span>{new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      {entry.trip_id && tripName(entry.trip_id) && (
                        <><span>·</span><span className="text-[#002b49] font-medium">{tripName(entry.trip_id)}</span></>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deleteEntry.mutate(entry.id)} className="text-[#d1d5db] hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

