"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Repository {
  id: string | number;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  note?: string | null; 
}

interface RepoListProps {
  repos: Repository[];
  mode: "pick" | "view";
  onAdd?: (repo: Repository) => void;
  onRemove?: (repoId: string | number) => void;
  onNote?: (repo: Repository) => void;
  onReorder?: (newOrder: Repository[]) => void;
  className?: string;
}

function SortableRepoItem({ repo, mode, onAdd, onRemove, onNote }: {
  repo: Repository;
  mode: "pick" | "view";
  onAdd?: (repo: Repository) => void;
  onRemove?: (repoId: string | number) => void;
  onNote?: (repo: Repository) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: repo.id, disabled: mode === "view" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className="overflow-hidden transition-all hover:shadow-md border-muted touch-none select-none">
          <CardContent className="p-0">
            <div className="flex h-24 items-center gap-4 px-6">
              {mode === "pick" && (
                 <div className="text-muted-foreground mr-2 cursor-grab active:cursor-grabbing">
                    ⋮⋮
                 </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base font-semibold text-foreground truncate">
                    {repo.full_name}
                  </span>
                  <span className="flex items-center text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                     ⭐ {repo.stargazers_count || 0}
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

              <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
                {mode === "pick" && onAdd && (
                  <Button onClick={() => onAdd(repo)} size="sm" variant="secondary">
                    Add
                  </Button>
                )}
                
                {onRemove && (
                   <Button onClick={() => onRemove(repo.id)} size="sm" variant="destructive">
                     Remove
                   </Button>
                )}

                {onNote && (
                   <Button onClick={() => onNote(repo)} size="sm" variant="outline">
                     Note
                   </Button>
                )}
                
                <a 
                  href={`https://github.com/${repo.full_name}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="z-10 relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 gap-1.5 rounded-full px-4 text-xs"
                >
                    Visit GitHub
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

export function RepoList({ repos, mode, onAdd, onRemove, onNote, onReorder, className }: RepoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      if (onReorder) {
          const oldIndex = repos.findIndex((r) => r.id === active.id);
          const newIndex = repos.findIndex((r) => r.id === over.id);
          const newOrder = arrayMove(repos, oldIndex, newIndex);
          onReorder(newOrder);
      }
    }
  }

  const content = repos.map((repo) => (
     <SortableRepoItem
        key={repo.id}
        repo={repo}
        mode={mode}
        onAdd={onAdd}
        onRemove={onRemove}
        onNote={onNote}
     />
  ));

  return (
    <div className={cn("grid gap-4", className)}>
      {mode === "pick" && onReorder ? (
         <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
         >
           <SortableContext 
              items={repos.map(r => r.id)} 
              strategy={verticalListSortingStrategy}
           >
             {content}
           </SortableContext>
         </DndContext>
      ) : (
         content
      )}
       {repos.length === 0 && (
             <div className="text-center py-12 text-muted-foreground">
                {mode === "pick" ? "No repositories found." : "This collection is empty."}
             </div>
        )}
    </div>
  );
}
