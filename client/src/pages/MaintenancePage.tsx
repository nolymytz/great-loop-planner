import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type MaintenanceTask } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, XCircle, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CATEGORIES = ['engine','electrical','hull','rigging','safety','navigation','plumbing','general'] as const;
const PRIORITIES = ['low','medium','high','critical'] as const;
const STATUSES = ['pending','in_progress','completed','overdue'] as const;

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  in_progress: { label: 'In Progress', icon: Wrench, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200' },
  overdue: { label: 'Overdue', icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200' },
};

const priorityColor = { low: 'bg-gray-100 text-gray-600', medium: 'bg-amber-100 text-amber-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' };

export default function MaintenancePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [form, setForm] = useState({ title: '', category: 'general', priority: 'medium', description: '', due_date: '', vendor: '', cost: '', notes: '' });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['maintenance', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('maintenance_tasks').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data as MaintenanceTask[];
    },
    enabled: !!user,
  });

  const addTask = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('maintenance_tasks').insert({
        user_id: user!.id,
        title: form.title,
        category: form.category,
        priority: form.priority,
        description: form.description || null,
        due_date: form.due_date || null,
        vendor: form.vendor || null,
        cost: form.cost ? parseFloat(form.cost) : null,
        notes: form.notes || null,
        status: 'pending',
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['maintenance'] }); setOpen(false); setForm({ title: '', category: 'general', priority: 'medium', description: '', due_date: '', vendor: '', cost: '', notes: '' }); toast.success('Task added'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('maintenance_tasks').update({ status, ...(status === 'completed' ? { completed_date: new Date().toISOString().split('T')[0] } : {}) }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['maintenance'] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('maintenance_tasks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['maintenance'] }); toast.success('Task deleted'); },
  });

  const filtered = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: tasks.filter(t => t.status === s).length }), {} as Record<string, number>);

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#002b49]">Maintenance Tracker</h1>
            <p className="text-[#6b7280] text-sm mt-1">Track service tasks, repairs, and scheduled maintenance for your vessel</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#002b49] hover:bg-[#003a63] text-white gap-2"><Plus className="w-4 h-4" /> Add Task</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle className="font-serif text-[#002b49]">Add Maintenance Task</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Task Title *</Label><Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Oil change — main engine" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Category</Label>
                    <Select value={form.category} onValueChange={v => setForm(f => ({...f, category: v}))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Priority</Label>
                    <Select value={form.priority} onValueChange={v => setForm(f => ({...f, priority: v}))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Description</Label><Input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Details about the task..." /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({...f, due_date: e.target.value}))} /></div>
                  <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Est. Cost ($)</Label><Input type="number" value={form.cost} onChange={e => setForm(f => ({...f, cost: e.target.value}))} placeholder="0.00" /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-[#374151]">Vendor / Shop</Label><Input value={form.vendor} onChange={e => setForm(f => ({...f, vendor: e.target.value}))} placeholder="e.g. Diesel Dave's Marine" /></div>
                <Button onClick={() => addTask.mutate()} disabled={!form.title || addTask.isPending} className="w-full bg-[#002b49] hover:bg-[#003a63] text-white">
                  {addTask.isPending ? 'Adding...' : 'Add Task'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {STATUSES.map(s => {
            const cfg = statusConfig[s];
            const Icon = cfg.icon;
            return (
              <button key={s} onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                className={`p-3 rounded-lg border text-left transition-all ${filterStatus === s ? cfg.color + ' ring-1 ring-current' : 'bg-white border-[#e5e7eb] hover:border-[#002b49]/20'}`}>
                <Icon className="w-4 h-4 mb-1" />
                <div className="text-lg font-bold">{counts[s] || 0}</div>
                <div className="text-xs">{cfg.label}</div>
              </button>
            );
          })}
        </div>

        {/* Task list */}
        {isLoading ? (
          <div className="text-center py-12 text-[#9ca3af]">Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-[#e5e7eb]">
            <Wrench className="w-10 h-10 text-[#d1d5db] mx-auto mb-3" />
            <div className="text-[#374151] font-medium">No maintenance tasks yet</div>
            <div className="text-[#9ca3af] text-sm mt-1">Add tasks to track service, repairs, and scheduled maintenance</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(task => {
              const cfg = statusConfig[task.status];
              const Icon = cfg.icon;
              return (
                <div key={task.id} className="bg-white rounded-lg border border-[#e5e7eb] p-4 flex items-start gap-4">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color.split(' ')[0]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[#002b49] text-sm">{task.title}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityColor[task.priority]}`}>{task.priority}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[#f3f4f6] text-[#6b7280]">{task.category}</span>
                    </div>
                    {task.description && <div className="text-xs text-[#6b7280] mt-1">{task.description}</div>}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[#9ca3af]">
                      {task.due_date && <span>Due: {task.due_date}</span>}
                      {task.vendor && <span>· {task.vendor}</span>}
                      {task.cost && <span>· ${task.cost}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select value={task.status} onValueChange={v => updateStatus.mutate({ id: task.id, status: v })}>
                      <SelectTrigger className="h-7 text-xs w-32 border-[#d1d5db]"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{statusConfig[s].label}</SelectItem>)}</SelectContent>
                    </Select>
                    <button onClick={() => deleteTask.mutate(task.id)} className="text-[#d1d5db] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

