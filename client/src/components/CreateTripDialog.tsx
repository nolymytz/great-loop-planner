import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

const BANNER_COLORS = ["#1e3a5f","#0e4d4d","#3b1f5e","#7c3a00","#1a4a2e","#4a1a2e"];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: number) => void;
}

export function CreateTripDialog({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bannerColor, setBannerColor] = useState(BANNER_COLORS[0]);
  const utils = trpc.useUtils();

  const create = trpc.trips.create.useMutation({
    onSuccess: (data) => {
      toast.success("Trip created!");
      utils.trips.list.invalidate();
      onCreated(data.id);
      onClose();
      setName(""); setDescription("");
    },
    onError: () => toast.error("Failed to create trip"),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Create New Trip</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="trip-name">Trip Name</Label>
            <Input id="trip-name" placeholder="e.g. The Great Loop 2027" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trip-desc">Description <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea id="trip-desc" placeholder="Notes about this voyage..." value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Banner Color</Label>
            <div className="flex gap-2">
              {BANNER_COLORS.map(c => (
                <button
                  key={c}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${bannerColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ background: c }}
                  onClick={() => setBannerColor(c)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!name.trim() || create.isPending}
            onClick={() => create.mutate({ name: name.trim(), description: description.trim() || undefined, bannerColor })}
          >
            {create.isPending ? "Creating…" : "Create Trip"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

