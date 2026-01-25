"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getGitHubUserRepos } from "@/lib/github/api";
import { addRepoToCollection, NewRepoData } from "@/lib/supabase/mutations";
import { getCollectionRepos } from "@/lib/supabase/queries";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AddRepoDialogProps {
  collectionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRepoDialog({ collectionId, onClose, onSuccess }: AddRepoDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [addedRepos, setAddedRepos] = useState<Set<string>>(new Set());
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Initial load: fetch CURRENT user's repos AND existing repos in collection
    const loadData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        // 1. Fetch existing repos to grey them out
        const { data: existing } = await getCollectionRepos(supabase, collectionId, 1, 1000);
        const existingFullNames = new Set(existing.map((r: any) => r.full_name));
        setAddedRepos(existingFullNames);

        // 2. Load my repos
        if (user) {
           let username = user.user_metadata?.preferred_username || user.user_metadata?.user_name;
           if (!username) {
              const { data: profile } = await supabase
                .from("profiles")
                .select("github_username")
                .eq("id", user.id)
                .single();
              username = profile?.github_username;
           }
           
           if (username) {
             const repos = await getGitHubUserRepos(username, 1, 50);
             setResults(repos || []);
           }
        }
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [supabase, collectionId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const repos = await getGitHubUserRepos(searchTerm.trim(), 1, 30);
      setResults(repos || []);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (repo: any) => {
    if (addedRepos.has(repo.full_name)) return;

    try {
      const newRepo: NewRepoData = {
        collection_id: collectionId,
        owner: repo.owner.login,
        repo_name: repo.name,
        full_name: repo.full_name,
        description: repo.description, 
        note: "", 
      };
      await addRepoToCollection(supabase, newRepo);
      
      // Update local state for immediate feedback
      setAddedRepos(prev => new Set(prev).add(repo.full_name));
      
      router.refresh(); 
      onSuccess(); // Ensure parent knows something changed
    } catch (e: any) {
        alert(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="flex w-full max-w-2xl flex-col shadow-2xl h-[80vh]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Add Repositories</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
            <div className="p-4 border-b bg-muted/30">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input 
                        placeholder="Type a GitHub Username to find repos..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </form>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {results.length === 0 && !loading ? (
                    <div className="text-center text-muted-foreground mt-10">
                        {searchTerm ? "No repositories found." : "No repositories available."}
                    </div>
                ) : (
                    results.map(repo => {
                        const isAdded = addedRepos.has(repo.full_name);
                        return (
                            <div key={repo.id} className={cn(
                                "flex items-center justify-between p-3 rounded-lg border bg-card transition-all",
                                isAdded ? "opacity-60 bg-muted/30" : "hover:bg-accent/50"
                            )}>
                                <div className="min-w-0 flex-1 mr-4">
                                    <div className="font-semibold truncate">{repo.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{repo.description}</div>
                                </div>
                                <Button 
                                    size="sm" 
                                    onClick={() => handleAdd(repo)}
                                    disabled={isAdded}
                                    variant={isAdded ? "ghost" : "default"}
                                >
                                    {isAdded ? "Added" : "Add"}
                                </Button>
                            </div>
                        );
                    })
                )}
                {loading && (
                    <div className="text-center text-muted-foreground mt-10 animate-pulse">
                        Loading...
                    </div>
                )}
            </div>
            
            <div className="p-4 border-t flex justify-end">
                <Button onClick={() => { onSuccess(); onClose(); }}>Done</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
