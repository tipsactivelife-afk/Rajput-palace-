export function RoomCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-card)] animate-pulse">
      <div className="h-56 bg-stone" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-1/3 bg-stone rounded" />
        <div className="h-6 w-2/3 bg-stone rounded" />
        <div className="h-4 w-full bg-stone rounded" />
        <div className="h-4 w-5/6 bg-stone rounded" />
        <div className="h-10 w-1/2 bg-stone rounded-full mt-4" />
      </div>
    </div>
  );
}

export function GalleryItemSkeleton() {
  return <div className="aspect-[4/3] rounded-xl bg-stone animate-pulse" />;
}

export function RoomGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <RoomCardSkeleton key={i} />
      ))}
    </div>
  );
}

