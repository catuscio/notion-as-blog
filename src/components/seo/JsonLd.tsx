import { brand } from "@/config/brand";

type JsonLdProps = {
  data: Record<string, unknown>;
};

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: brand.name,
        url: brand.url,
        description: brand.description,
        inLanguage: brand.lang,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${brand.url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

type ArticleJsonLdProps = {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorUrl?: string;
  authorImage?: string;
  authorJobTitle?: string;
  image?: string;
  tags?: string[];
};

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  authorImage,
  authorJobTitle,
  image,
  tags,
}: ArticleJsonLdProps) {
  const author: Record<string, unknown> = {
    "@type": "Person",
    name: authorName,
    ...(authorUrl && { url: authorUrl }),
    ...(authorImage && { image: authorImage }),
    ...(authorJobTitle && { jobTitle: authorJobTitle }),
  };

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url,
        datePublished,
        dateModified,
        author,
        publisher: {
          "@type": "Organization",
          name: brand.name,
          url: brand.url,
        },
        ...(image && { image }),
        ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      }}
    />
  );
}

type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
