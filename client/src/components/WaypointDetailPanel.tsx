import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { X, BookOpen, Plus, Trash2, CheckSquare, Square, StickyNote } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { format } from "date-fns";

interface Props {
  waypointId: number;
  tripId: number;
  onClose: () => void;
  onUpdated: () => void;
}

export function WaypointDetailPanel({ waypointId, tripId, onClose, onUpdated }: Props) {
  const { data: entries = [], refetch } = trpc.journal.listByWaypoint.useQuery({ waypointId });
  const { data: waypoints = [] } = trpc.waypoints.list.useQuery({ tripId });
  const wp = waypoints.find(w => w.id === waypointId);

  const updateWp = trpc.waypoints.update.useMutation({ onSuccess: () => { onUpdated(); toast.success("Stop updated"); } });
  const createEntry = trpc.journal.create.useMutation({ onSuccess: () => refetch() });
  const updateEntry = trpc.journal.update.useMutation({ onSuccess: () => refetch() });
  const deleteEntry = trpc.journal.delete.useMutation({ onSuccess: () => refetch() });

  const [notes, setNotes] = useState("");
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);

  useEffect(() => { if (wp) setNotes(wp.notes ?? ""); }, [wp]);

  if (!wp) return null;

  const saveNotes = () => {
    updateWp.mutate({ id: waypointId, notes });
    setEditingNotes(false);
  };

  const addJournalEntry = () => {
    if (!newEntryTitle.trim() && !newEntryContent.trim()) return;
    createEntry.mutate({ tripId, waypointId, title: newEntryTitle, content: newEntryContent });
    setNewEntryTitle(""); setNewEntryContent(""); setShowNewEntry(false);
  };

  const toggleTodo = (entry: typeof entries[0], todoId: string) => {
    const items = (entry.todoItems as any[] ?? []).map((t: any) => t.id === todoId ? { ...t, done: !t.done } : t);
    updateEntry.mutate({ id: entry.id, todoItems: items });
  };

  const addTodo = (entry: typeof entries[0]) => {
    if (!newTodoText.trim()) return;
    const items = [...(entry.todoItems as any[] ?? []), { id: nanoid(), text: newTodoText, done: false }];
    updateEntry.mutate({ id: entry.id, todoItems: items });
    setNewTodoText("");
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 xl:w-96 bg-white border-l border-border shadow-xl flex flex-col z-20 overflow-hidden">
      <div className="flex items-start justify-between p-4 border-b border-border bg-navy-950 text-white">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-navy-300 uppercase tracking-wide mb-0.5">Stop Details</p>
          <h3 className="font-serif font-semibold text-base truncate">{wp.name}</h3>
          {wp.address && <p className="text-xs text-navy-300 truncate mt-0.5">{wp.address}</p>}
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
              value={wp.plannedDate ? format(new Date(wp.plannedDate), "yyyy-MM-dd") : ""}
              onChange={e => updateWp.mutate({ id: waypointId, plannedDate: e.target.value ? new Date(e.target.value) : null, dateTbd: !e.target.value })}
            />
            <Button
              size="sm"
              variant={wp.dateTbd ? "default" : "outline"}
              className="text-xs shrink-0"
              onClick={() => updateWp.mutate({ id: waypointId, dateTbd: !wp.dateTbd })}
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
                <Button size="sm" onClick={saveNotes} disabled={updateWp.isPending}>Save</Button>
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
                <Button size="sm" onClick={addJournalEntry} disabled={createEntry.isPending}>Save Entry</Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewEntry(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {entries.length === 0 && !showNewEntry && (
              <p className="text-sm text-muted-foreground italic">No journal entries yet.</p>
            )}
            {entries.map(entry => (
              <div key={entry.id} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    {entry.title && <p className="text-sm font-semibold">{entry.title}</p>}
                    <p className="text-xs text-muted-foreground">{format(new Date(entry.createdAt), "MMM d, yyyy")}</p>
                  </div>
                  <button onClick={() => deleteEntry.mutate({ id: entry.id })} className="p-1 hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {entry.content && <p className="text-sm text-foreground whitespace-pre-wrap">{entry.content}</p>}

                {/* Todo items */}
                {Array.isArray(entry.todoItems) && entry.todoItems.length > 0 && (
                  <div className="space-y-1">
                    {(entry.todoItems as any[]).map((todo: any) => (
                      <div key={todo.id} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleTodo(entry, todo.id)}>
                        {todo.done ? <CheckSquare className="w-4 h-4 text-primary shrink-0" /> : <Square className="w-4 h-4 text-muted-foreground shrink-0" />}
                        <span className={`text-sm ${todo.done ? "line-through text-muted-foreground" : ""}`}>{todo.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add todo */}
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
