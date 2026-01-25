"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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
  onReorderCollections?: (newOrder: HelperCollection[]) => void;
  className?: string;
}

function SortableCollectionItem({ collection, activeCollectionId, onSelect, mode }: {
  collection: HelperCollection;
  activeCollectionId?: string;
  onSelect?: (id: string) => void;
  mode: "edit" | "view";
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: collection.id, disabled: mode === "view" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const content = (
    <div className="flex items-center gap-2 min-w-0 flex-1">
      {mode === "edit" && (
        <div className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
        </div>
      )}
      <span className="truncate">{collection.title}</span>
      {collection.count !== undefined && (
        <span className="ml-auto text-xs opacity-70">{collection.count}</span>
      )}
    </div>
  );

  const classNameStr = cn(
    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-left w-full touch-none select-none",
    activeCollectionId === collection.id
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground"
  );

  if (mode === "view") {
    return (
      <Link
        href={`?collection=${collection.id}`}
        className={classNameStr}
        scroll={false}
      >
        {content}
      </Link>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        onClick={() => onSelect?.(collection.id)}
        className={classNameStr}
      >
        {content}
      </button>
    </div>
  );
}

export function Sidebar({
  mode,
  collections,
  activeCollectionId,
  onSelectCollection,
  onAddCollection,
  onReorderCollections,
  className,
}: SidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8, // Require 8px movement before drag starts to prevent accidental drags on clicks
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      if (onReorderCollections) {
          const oldIndex = collections.findIndex((c) => c.id === active.id);
          const newIndex = collections.findIndex((c) => c.id === over.id);
          const newCollections = arrayMove(collections, oldIndex, newIndex);
          onReorderCollections(newCollections);
      }
    }
  }

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-card/50 backdrop-blur-xl",
        className
      )}
    >

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
          {mode === "edit" ? (
             <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
             >
               <SortableContext 
                  items={collections.map(c => c.id)} 
                  strategy={verticalListSortingStrategy}
               >
                 {collections.map((collection) => (
                   <SortableCollectionItem
                     key={collection.id}
                     collection={collection}
                     activeCollectionId={activeCollectionId}
                     onSelect={onSelectCollection}
                     mode={mode}
                   />
                 ))}
               </SortableContext>
             </DndContext>
          ) : (
                collections.map((collection) => (
                   <SortableCollectionItem
                     key={collection.id}
                     collection={collection}
                     activeCollectionId={activeCollectionId}
                     onSelect={onSelectCollection}
                     mode={mode}
                   />
                 ))
          )}
          
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
    </aside>
  );
}
