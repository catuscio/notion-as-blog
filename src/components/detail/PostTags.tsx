import { TagControl } from "@/components/common/TagControl";
import { displayTagName } from "@/lib/displayTagName";

export function PostTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <>
      <hr className="border-border my-12" />
      <div className="flex flex-wrap gap-x-[var(--tag-gap)] gap-y-2 mb-12">
        {tags.map((tag) => <TagControl key={tag} href={`/tag/${encodeURIComponent(tag)}`} label={`#${displayTagName(tag)}`} />)}
      </div>
    </>
  );
}
