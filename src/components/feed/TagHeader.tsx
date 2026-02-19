export function TagHeader({
  tagName,
  postCount,
}: {
  tagName: string;
  postCount: number;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary text-[28px]">
          sell
        </span>
        <h1 className="text-3xl font-bold">#{tagName}</h1>
      </div>
      <p className="text-muted-foreground">
        {postCount} {postCount === 1 ? "post" : "posts"} tagged with &ldquo;{tagName}&rdquo;
      </p>
    </div>
  );
}
