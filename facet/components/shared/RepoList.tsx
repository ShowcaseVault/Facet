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
          <CardContent className="p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-primary hover:underline truncate"
                >
                  {repo.full_name}
                </a>
                <span className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                   ⭐ {repo.stargazers_count}
                </span>
                {repo.language && (
                     <span className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {repo.language}
                     </span>
                )}
              </div>
              
              <p className="text-sm text-foreground/80 line-clamp-2 mb-2">
                {repo.description || "No description provided."}
              </p>

              {repo.note && mode === "view" && (
                <div className="mt-2 text-sm italic text-muted-foreground border-l-2 border-accent pl-3 py-1 bg-accent/10 rounded-r">
                    " {repo.note} "
                </div>
              )}
            </div>

            {mode === "pick" && onAdd && (
              <Button onClick={() => onAdd(repo)} size="sm" variant="secondary">
                Add
              </Button>
            )}
             {mode === "view" && (
               <div className="flex-shrink-0">
                 {/* Links or actions for viewers could go here */}
               </div>
            )}
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
