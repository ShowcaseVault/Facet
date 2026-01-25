"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface HelperCollection {
  id: string;
  title: string;
  count?: number;
}

interface SidebarProps {
  mode: "edit" | "view";
  collections: HelperCollection[];
  activeCollectionId?: string;
  onSelectCollection?: (id: string) => void;
  onAddCollection?: () => void;
  className?: string;
}

export function Sidebar({
  mode,
  collections,
  activeCollectionId,
  onSelectCollection,
  onAddCollection,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-card/50 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <img src="/logo.png" alt="Facet Logo" className="h-8 w-8 object-contain" />
          <span>Facet</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Collections
          </h2>
          {mode === "edit" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onAddCollection}
              title="Add Collection"
            >
              <span className="text-lg">+</span>
            </Button>
          )}
        </div>

        <nav className="flex flex-col gap-1">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onSelectCollection?.(collection.id)}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-left",
                activeCollectionId === collection.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <span className="truncate">{collection.title}</span>
              {collection.count !== undefined && (
                <span className="ml-2 text-xs opacity-70">{collection.count}</span>
              )}
            </button>
          ))}
          
          {collections.length === 0 && (
             <div className="text-sm text-muted-foreground italic px-2 py-4 text-center border border-dashed rounded-md">
                {mode === "edit" ? "No collections yet. Create one!" : "No collections found."}
             </div>
          )}
        </nav>
        
        {mode === "edit" && (
            <div className="mt-4">
                <Button onClick={onAddCollection} variant="outline" className="w-full text-xs">
                    + New Collection
                </Button>
            </div>
        )}
      </div>

      <div className="border-t p-4">
        {mode === "edit" ? (
             <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                Settings
             </Button>
        ) : (
            <div className="text-xs text-muted-foreground text-center">
                Built with <Link href="/" className="underline text-primary">Facet</Link>
            </div>
        )}
      </div>
    </aside>
  );
}
