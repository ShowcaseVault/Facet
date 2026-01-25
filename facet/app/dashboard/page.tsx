"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { RepoList } from "@/components/shared/RepoList";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { getUserCollections, getCollectionRepos } from "@/lib/supabase/queries";
import { deleteCollection, removeRepoFromCollection, upsertProfile } from "@/lib/supabase/mutations";
import { CreateCollectionModal } from "@/components/dashboard/CreateCollectionModal";
import { AddRepoDialog } from "@/components/dashboard/AddRepoDialog";
import { EditNoteDialog } from "@/components/dashboard/EditNoteDialog";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddRepoModalOpen, setIsAddRepoModalOpen] = useState(false);
  const [editingNoteRepo, setEditingNoteRepo] = useState<any>(null);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get active collection from URL or default to first
  const activeCollectionId = searchParams.get("collection") || (collections.length > 0 ? collections[0].id : null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // --- Sync Profile ---
        const githubUsername = user.user_metadata?.preferred_username || user.user_metadata?.user_name;
        if (githubUsername) {
           await upsertProfile(supabase, {
             id: user.id,
             github_username: githubUsername,
             display_name: user.user_metadata?.full_name || githubUsername,
             avatar_url: user.user_metadata?.avatar_url || "",
             bio: user.user_metadata?.bio || ""
           });
        }

        const userCollections = await getUserCollections(supabase, user.id);
        setCollections(userCollections || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  // Fetch repos when active collection changes
  useEffect(() => {
    const fetchRepos = async () => {
      if (activeCollectionId) {
        const { data } = await getCollectionRepos(supabase, activeCollectionId, 1, 100); 
        setRepos(data || []);
      } else {
        setRepos([]);
      }
    };
    fetchRepos();
  }, [activeCollectionId, supabase]);

  const handleSelectCollection = (id: string) => {
    router.push(`?collection=${id}`);
  };

  const handleDeleteCollection = async () => {
    if (!activeCollectionId || !confirm("Are you sure you want to delete this collection?")) return;
    try {
      await deleteCollection(supabase, activeCollectionId);
      const userCollections = await getUserCollections(supabase, user.id);
      setCollections(userCollections || []);
      if (activeCollectionId) {
          router.push("/dashboard");
      }
    } catch (e) {
      alert("Failed to delete collection");
    }
  };

  const handleRemoveRepo = async (repoId: string) => {
      if (!confirm("Remove this repository from the collection?")) return;
      try {
          await removeRepoFromCollection(supabase, repoId.toString());
          setRepos(repos.filter(r => r.id !== repoId));
      } catch (e) {
          console.error(e);
          alert("Failed to remove repo");
      }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <>
      <Sidebar
        mode="edit"
        collections={collections}
        activeCollectionId={activeCollectionId || undefined}
        onSelectCollection={handleSelectCollection}
        onAddCollection={() => setIsCreateModalOpen(true)}
        className="w-64 flex-shrink-0"
      />

      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {collections.find(c => c.id === activeCollectionId)?.title || "Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                 {collections.find(c => c.id === activeCollectionId)?.description ? (
                   collections.find(c => c.id === activeCollectionId)?.description
                 ) : (
                   "Manage your collection's repositories and details."
                 )}
              </p>
            </div>
            {activeCollectionId && (
                <div className="flex gap-2">
                    <Button variant="destructive" size="sm" onClick={handleDeleteCollection}>
                        Delete Collection
                    </Button>
                    <Button onClick={() => setIsAddRepoModalOpen(true)}>
                        Add Repository
                    </Button>
                </div>
            )}
          </div>

          <div className="space-y-6">
            {!activeCollectionId ? (
                <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                    Select a collection to manage or create a new one.
                </div>
            ) : (
                repos.length > 0 ? (
                    <RepoList 
                        repos={repos} 
                        mode="pick" 
                        onRemove={(id) => handleRemoveRepo(id.toString())}
                        onNote={(repo) => setEditingNoteRepo(repo)}
                    />
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        No repositories in this collection yet.
                        <br/>
                        <Button variant="link" onClick={() => setIsAddRepoModalOpen(true)}>
                            Add your first one
                        </Button>
                    </div>
                )
            )}
          </div>
        </div>
      </main>

      {isCreateModalOpen && (
        <CreateCollectionModal 
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={(newId) => {
                getUserCollections(supabase, user.id).then(setCollections);
                router.push(`?collection=${newId}`);
            }}
        />
      )}

      {isAddRepoModalOpen && activeCollectionId && (
        <AddRepoDialog
            collectionId={activeCollectionId}
            onClose={() => setIsAddRepoModalOpen(false)}
            onSuccess={() => {
                getCollectionRepos(supabase, activeCollectionId, 1, 100).then(res => setRepos(res.data));
            }}
        />
      )}

      {editingNoteRepo && (
        <EditNoteDialog
            repoId={editingNoteRepo.id}
            initialNote={editingNoteRepo.note || ""}
            onClose={() => setEditingNoteRepo(null)}
            onSuccess={() => {
                 if (activeCollectionId) {
                    getCollectionRepos(supabase, activeCollectionId, 1, 100).then(res => setRepos(res.data));
                 }
            }}
        />
      )}
    </>
  );
}
