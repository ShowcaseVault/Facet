"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { updateCollection } from "@/lib/supabase/mutations";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface EditCollectionModalProps {
  collection: { id: string; title: string; description?: string };
  onClose: () => void;
  onSuccess: () => void;
  onError?: (message: string) => void;
}

export function EditCollectionModal({ collection, onClose, onSuccess, onError }: EditCollectionModalProps) {
  const [title, setTitle] = useState(collection.title);
  const [description, setDescription] = useState(collection.description || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await updateCollection(supabase, collection.id, { title, description });
      onSuccess();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      onError?.("Failed to update collection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>Edit Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Name</label>
              <Input
                placeholder="e.g. AI Projects"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Description (Optional)</label>
              <Input
                placeholder="What's this collection about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !title.trim()}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
