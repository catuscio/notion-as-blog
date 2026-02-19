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

export function OrganizationJsonLd() {
  const org = brand.organization;
  if (!org.name) return null;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url || brand.url,
  };
  if (org.description) data.description = org.description;
  if (org.logo) data.logo = org.logo;
  if (org.sameAs.length > 0) data.sameAs = [...org.sameAs];

  return <JsonLdScript data={data} />;
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
  wordCount?: number;
  timeRequired?: string;
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
  wordCount,
  timeRequired,
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
        ...(wordCount && { wordCount }),
        ...(timeRequired && { timeRequired }),
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

type BlogJsonLdProps = {
  name: string;
  description: string;
  url: string;
};

export function BlogJsonLd({ name, description, url }: BlogJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        name,
        description,
        url,
        publisher: {
          "@type": "Organization",
          name: brand.name,
          url: brand.url,
        },
      }}
    />
  );
}

type PersonJsonLdProps = {
  name: string;
  url: string;
  image?: string;
  jobTitle?: string;
  description?: string;
};

export function PersonJsonLd({
  name,
  url,
  image,
  jobTitle,
  description,
}: PersonJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name,
        url,
        ...(image && { image }),
        ...(jobTitle && { jobTitle }),
        ...(description && { description }),
      }}
    />
  );
}
