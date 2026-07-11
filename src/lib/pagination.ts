export type PaginationItem = number | "ellipsis";

export function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PaginationItem[] = [1];

  if (currentPage > 3) items.push("ellipsis");

  const firstAdjacentPage = Math.max(2, currentPage - 1);
  const lastAdjacentPage = Math.min(totalPages - 1, currentPage + 1);
  for (let page = firstAdjacentPage; page <= lastAdjacentPage; page += 1) {
    items.push(page);
  }

  if (currentPage < totalPages - 2) items.push("ellipsis");
  items.push(totalPages);

  return items;
}
