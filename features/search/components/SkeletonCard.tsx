export function SkeletonCard() {
  return (
    <div className="rounded-box border border-base-200 bg-base-100 p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="skeleton h-12 w-12" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-2/3" />
          <div className="skeleton h-3 w-1/3" />
        </div>
      </div>
    </div>
  );
}
