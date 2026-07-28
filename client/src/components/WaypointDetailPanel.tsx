import { supabase, type Waypoint, type JournalEntry } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, BookOpen, Plus, Trash2, CheckSquare, Square, StickyNote } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  waypointId: string;
  tripId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export function WaypointDetailPanel({ waypointId, tripId, onClose, onUpdated }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: wp } = useQuery<Waypoint | null>({
    queryKey: ["waypoint", waypointId],
    queryFn: async () => {
      const { data } = await supabase.from("waypoints").select("*").eq("id", waypointId).single();
      return data;
    },
    enabled: !!waypointId,
  });

  const { data: entries = [], refetch: refetchEntries } = useQuery<JournalEntry[]>({
    queryKey: ["journal", "waypoint", waypointId],
    queryFn: async () => {
      const { data } = await supabase.from("journal_entries").select("*").eq("waypoint_id", waypointId).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!waypointId,
  });

  const [notes, setNotes] = useState("");
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => { if (wp) setNotes(wp.notes ?? ""); }, [wp]);

  const saveNotes = async () => {
    setSavingNotes(true);
    const { error } = await supabase.from("waypoints").update({ notes }).eq("id", waypointId);
    setSavingNotes(false);
    if (error) { toast.error("Failed to save notes"); return; }
    toast.success("Notes saved");
    qc.invalidateQueries({ queryKey: ["waypoint", waypointId] });
    qc.invalidateQueries({ queryKey: ["waypoints", tripId] });
    setEditingNotes(false);
    onUpdated();
  };

  const updateDate = async (plannedDate: string | null, dateTbd: boolean) => {
    await supabase.from("waypoints").update({ planned_date: plannedDate, date_tbd: dateTbd }).eq("id", waypointId);
    qc.invalidateQueries({ queryKey: ["waypoint", waypointId] });
    qc.invalidateQueries({ queryKey: ["waypoints", tripId] });
    onUpdated();
  };

  const addJournalEntry = async () => {
    if (!newEntryTitle.trim() && !newEntryContent.trim()) return;
    const { error } = await supabase.from("journal_entries").insert({
      user_id: user!.id,
      trip_id: tripId,
      waypoint_id: waypointId,
      title: newEntryTitle.trim() || null,
      content: newEntryContent.trim() || null,
      todo_items: [],
    });
    if (error) { toast.error("Failed to save entry"); return; }
    refetchEntries();
    setNewEntryTitle(""); setNewEntryContent(""); setShowNewEntry(false);
  };

  const deleteEntry = async (id: string) => {
    await supabase.from("journal_entries").delete().eq("id", id);
    refetchEntries();
  };

  const toggleTodo = async (entry: JournalEntry, idx: number) => {
    const items = (entry.todo_items ?? []).map((t, i) => i === idx ? { ...t, done: !t.done } : t);
    await supabase.from("journal_entries").update({ todo_items: items }).eq("id", entry.id);
    refetchEntries();
  };

  const addTodo = async (entry: JournalEntry) => {
    if (!newTodoText.trim()) return;
    const items = [...(entry.todo_items ?? []), { text: newTodoText.trim(), done: false }];
    await supabase.from("journal_entries").update({ todo_items: items }).eq("id", entry.id);
    setNewTodoText("");
    refetchEntries();
  };

  if (!wp) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 xl:w-96 bg-white border-l border-border shadow-xl flex flex-col z-20 overflow-hidden">
      <div className="flex items-start justify-between p-4 border-b border-border bg-[#002b49] text-white">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/60 uppercase tracking-wide mb-0.5">Stop Details</p>
          <h3 className="font-serif font-semibold text-base truncate">{wp.name}</h3>
          {wp.address && <p className="text-xs text-white/60 truncate mt-0.5">{wp.address}</p>}
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md transition-colors ml-2 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Date */}
        <div className="px-4 py-3 border-b border-border">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Planned Date</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Input
              type="date"
              className="flex-1 text-sm"
              value={wp.planned_date ? wp.planned_date.slice(0, 10) : ""}
              onChange={e => updateDate(e.target.value || null, !e.target.value)}
            />
            <Button
              size="sm"
              variant={wp.date_tbd ? "default" : "outline"}
              className="text-xs shrink-0"
              onClick={() => updateDate(null, !wp.date_tbd)}
            >
              TBD
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <StickyNote className="w-3 h-3" /> Notes
            </Label>
            {!editingNotes && (
              <button onClick={() => setEditingNotes(true)} className="text-xs text-primary hover:underline">Edit</button>
            )}
          </div>
          {editingNotes ? (
            <div className="space-y-2">
              <Textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="text-sm" placeholder="Add notes about this stop…" />
              <div className="flex gap-2">
                <Button size="sm" onClick={saveNotes} disabled={savingNotes}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => { setEditingNotes(false); setNotes(wp.notes ?? ""); }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {notes || <span className="italic">No notes yet. Click Edit to add.</span>}
            </p>
          )}
        </div>

        {/* Journal Entries */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Journal Entries
            </Label>
            <button onClick={() => setShowNewEntry(v => !v)} className="text-xs text-primary hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Entry
            </button>
          </div>

          {showNewEntry && (
            <div className="mb-3 p-3 bg-secondary rounded-lg space-y-2">
              <Input placeholder="Entry title (optional)" value={newEntryTitle} onChange={e => setNewEntryTitle(e.target.value)} className="text-sm" />
              <Textarea rows={3} placeholder="Write your journal entry…" value={newEntryContent} onChange={e => setNewEntryContent(e.target.value)} className="text-sm" />
              <div className="flex gap-2">
                <Button size="sm" onClick={addJournalEntry}>Save Entry</Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewEntry(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {entries.length === 0 && !showNewEntry && (
              <p className="text-sm text-muted-foreground italic">No journal entries yet.</p>
            )}
            {entries.map((entry, entryIdx) => (
              <div key={entry.id} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    {entry.title && <p className="text-sm font-semibold">{entry.title}</p>}
                    <p className="text-xs text-muted-foreground">{format(new Date(entry.created_at), "MMM d, yyyy")}</p>
                  </div>
                  <button onClick={() => deleteEntry(entry.id)} className="p-1 hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {entry.content && <p className="text-sm text-foreground whitespace-pre-wrap">{entry.content}</p>}

                {Array.isArray(entry.todo_items) && entry.todo_items.length > 0 && (
                  <div className="space-y-1">
                    {entry.todo_items.map((todo, idx) => (
                      <div key={idx} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleTodo(entry, idx)}>
                        {todo.done ? <CheckSquare className="w-4 h-4 text-primary shrink-0" /> : <Square className="w-4 h-4 text-muted-foreground shrink-0" />}
                        <span className={`text-sm ${todo.done ? "line-through text-muted-foreground" : ""}`}>{todo.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-1.5">
                  <Input
                    placeholder="Add to-do item…"
                    value={newTodoText}
                    onChange={e => setNewTodoText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTodo(entry)}
                    className="text-xs h-7"
                  />
                  <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => addTodo(entry)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
