"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { updateRepoNote } from "@/lib/supabase/mutations";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface EditNoteDialogProps {
  repoId: string;
  initialNote: string;
  onClose: () => void;
  onSuccess: () => void;
  onError?: (message: string) => void;
}

export function EditNoteDialog({ repoId, initialNote, onClose, onSuccess, onError }: EditNoteDialogProps) {
  const [note, setNote] = useState(initialNote);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateRepoNote(supabase, repoId, note);
      onSuccess();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      onError?.("Failed to update note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
               <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
               <Button type="submit" disabled={loading}>Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
