import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { TPost } from "@/types";

export function PostBreadcrumb({ post }: { post: TPost }) {
  return (
    <Breadcrumb className="mb-6 overflow-hidden">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {post.category && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/category/${encodeURIComponent(post.category)}`}
                >
                  {post.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-none">
            {post.title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
