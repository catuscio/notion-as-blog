import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function PostTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <>
      <hr className="border-border my-12" />
      <div className="flex flex-wrap gap-2 mb-12">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="rounded-lg" asChild>
            <Link href={`/tag/${encodeURIComponent(tag)}`}>
              #{tag}
            </Link>
          </Badge>
        ))}
      </div>
    </>
  );
}
