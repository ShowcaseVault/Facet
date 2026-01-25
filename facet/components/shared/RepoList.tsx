"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface Repository {
  id: number;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  note?: string; // Additional user annotation
}

interface RepoListProps {
  repos: Repository[];
  mode: "pick" | "view";
  onAdd?: (repo: Repository) => void;
  onRemove?: (repoId: number) => void;
  className?: string;
}

export function RepoList({ repos, mode, onAdd, onRemove, className }: RepoListProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      {repos.map((repo) => (
        <Card key={repo.id} className="overflow-hidden transition-all hover:shadow-md border-muted">
          <CardContent className="p-0">
            <div className="flex h-24 items-center gap-4 px-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base font-semibold text-foreground truncate">
                    {repo.full_name}
                  </span>
                  <span className="flex items-center text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                     ⭐ {repo.stargazers_count}
                  </span>
                  {repo.language && (
                       <span className="flex items-center text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {repo.language}
                       </span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-1 leading-normal">
                  {repo.description || "No description provided."}
                </p>

                {repo.note && mode === "view" && (
                  <div className="mt-1 text-xs italic text-muted-foreground line-clamp-1">
                      &mdash; {repo.note}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {mode === "pick" && onAdd && (
                  <Button onClick={() => onAdd(repo)} size="sm" variant="secondary">
                    Add
                  </Button>
                )}
                
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="h-9 gap-1.5 rounded-full px-4 text-xs font-medium">
                    Visit GitHub
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
       {repos.length === 0 && (
             <div className="text-center py-12 text-muted-foreground">
                {mode === "pick" ? "No repositories found." : "This collection is empty."}
             </div>
        )}
    </div>
  );
}
