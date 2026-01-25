export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20 opacity-75"></div>
            <img src="/logo.png" alt="Loading..." className="h-10 w-10 object-contain animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading Facet...</p>
      </div>
    </div>
  );
}
