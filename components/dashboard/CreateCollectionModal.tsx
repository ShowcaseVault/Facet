"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { createCollection } from "@/lib/supabase/mutations";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

interface CreateCollectionModalProps {
  onClose: () => void;
  onSuccess: (newCollectionId: string) => void;
  onError?: (message: string) => void;
}

export function CreateCollectionModal({ onClose, onSuccess, onError }: CreateCollectionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const newCollection = await createCollection(supabase, title, description);
      onSuccess(newCollection.id);
      router.refresh(); // Refresh server components to show new list
      onClose();
    } catch (error) {
      console.error(error);
      onError?.("Failed to create collection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>New Collection</CardTitle>
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
                {loading ? "Creating..." : "Create Collection"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
