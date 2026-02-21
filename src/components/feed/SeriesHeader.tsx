import { copy } from "@/config/copy";
import { FeedPageHeader } from "./FeedPageHeader";

export function SeriesHeader({
  seriesName,
}: {
  seriesName: string;
}) {
  return (
    <FeedPageHeader
      badge={copy.series.badge}
      title={seriesName}
      subtitle={copy.series.subtitle(seriesName)}
    />
  );
}
