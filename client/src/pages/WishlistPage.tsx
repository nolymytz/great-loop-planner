import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type WishlistItem } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Plus, Trash2, MapPin, Activity, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const LIST_TYPES = [
  { value: 'place', label: 'Places to Visit', icon: MapPin, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'activity', label: 'Things to Do', icon: Activity, color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'gear', label: 'Boat Must-Haves', icon: Package, color: 'text-purple-600 bg-purple-50 border-purple-200' },
];

export default function WishlistPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'place' | 'activity' | 'gear'>('place');
  const [form, setForm] = useState({ title: '', description: '', location: '', category: '', notes: '', url: '', priority: 'medium', list_type: 'place' });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('wishlist_items').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!user,
  });

  const addItem = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('wishlist_items').insert({
        user_id: user!.id,
        list_type: form.list_type,
        title: form.title,
        description: form.description || null,
        location: form.location || null,
        category: form.category || null,
        notes: form.notes || null,
        url: form.url || null,
        priority: form.priority,
        status: 'wishlist',
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['wishlist'] }); setOpen(false); setForm({ title: '', description: '', location: '', category: '', notes: '', url: '', priority: 'medium', list_type: activeTab }); toast.success('Added to wishlist'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleDone = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('wishlist_items').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wishlist_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['wishlist'] }); toast.success('Removed'); },
  });

  const filtered = items.filter(i => i.list_type === activeTab);
  const tabCfg = LIST_TYPES.find(t => t.value === activeTab)!;
  const TabIcon = tabCfg.icon;

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#002b49]">Wishlist</h1>
            <p className="text-[#6b7280] text-sm mt-1">Places to visit, things to do, and gear for your vessel</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setForm(f => ({...f, list_type: activeTab}))} className="bg-[#002b49] hover:bg-[#003a63] text-white gap-2"><Plus className="w-4 h-4" /> Add Item</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle className="font-serif text-[#002b49]">Add to Wishlist</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Category</Label>
                  <Select value={form.list_type} onValueChange={v => setForm(f => ({...f, list_type: v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{LIST_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Title *</Label><Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder={form.list_type === 'place' ? 'e.g. Beaufort, NC waterfront' : form.list_type === 'activity' ? 'e.g. Kayaking in the Everglades' : 'e.g. Watermaker — Spectra Newport 400'} /></div>
                {form.list_type !== 'gear' && <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Location</Label><Input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="City, State or waterway" /></div>}
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Why do you want this?" rows={2} className="resize-none text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Priority</Label>
                    <Select value={form.priority} onValueChange={v => setForm(f => ({...f, priority: v}))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Link / URL</Label><Input value={form.url} onChange={e => setForm(f => ({...f, url: e.target.value}))} placeholder="https://..." /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={2} className="resize-none text-sm" /></div>
                <Button onClick={() => addItem.mutate()} disabled={!form.title || addItem.isPending} className="w-full bg-[#002b49] hover:bg-[#003a63] text-white">
                  {addItem.isPending ? 'Adding...' : 'Add to Wishlist'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {LIST_TYPES.map(tab => {
            const Icon = tab.icon;
            const count = items.filter(i => i.list_type === tab.value).length;
            return (
              <button key={tab.value} onClick={() => setActiveTab(tab.value as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${activeTab === tab.value ? 'bg-[#002b49] text-white border-[#002b49]' : 'bg-white text-[#374151] border-[#d1d5db] hover:border-[#002b49]/40'}`}>
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[#9ca3af]">Loading wishlist...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-[#e5e7eb]">
            <TabIcon className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
            <div className="text-[#374151] font-medium font-serif text-lg">No {tabCfg.label.toLowerCase()} yet</div>
            <div className="text-[#9ca3af] text-sm mt-1">Start building your list for the Great Loop</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(item => (
              <div key={item.id} className={`bg-white rounded-lg border p-4 flex items-start gap-3 transition-all ${item.status === 'done' ? 'opacity-60 border-[#e5e7eb]' : 'border-[#e5e7eb] hover:border-[#002b49]/20'}`}>
                <button onClick={() => toggleDone.mutate({ id: item.id, status: item.status === 'done' ? 'wishlist' : 'done' })}
                  className={`mt-0.5 flex-shrink-0 transition-colors ${item.status === 'done' ? 'text-green-500' : 'text-[#d1d5db] hover:text-[#002b49]'}`}>
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm text-[#002b49] ${item.status === 'done' ? 'line-through' : ''}`}>{item.title}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${item.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200' : item.priority === 'low' ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>{item.priority}</span>
                  </div>
                  {item.location && <div className="flex items-center gap-1 text-xs text-[#6b7280] mt-0.5"><MapPin className="w-3 h-3" />{item.location}</div>}
                  {item.description && <p className="text-xs text-[#6b7280] mt-1">{item.description}</p>}
                  {item.notes && <p className="text-xs text-[#9ca3af] mt-0.5 italic">{item.notes}</p>}
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#002b49] hover:underline mt-1 inline-block">View link →</a>}
                </div>
                <button onClick={() => deleteItem.mutate(item.id)} className="text-[#d1d5db] hover:text-red-500 transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

