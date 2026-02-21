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

const publisher = {
  "@type": "Organization" as const,
  name: brand.name,
  url: brand.url,
  logo: {
    "@type": "ImageObject" as const,
    url: `${brand.url}${brand.logo.png}`,
  },
};

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
        ...(brand.organization.name
          ? {
              publisher: {
                "@type": "Organization",
                name: brand.organization.name,
                ...(brand.organization.url ? { url: brand.organization.url } : {}),
              },
            }
          : {}),
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

  // Skip rendering when required fields are not configured
  if (!org.name && !org.url) return null;

  const sameAs = Object.values(brand.social).filter(Boolean);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    logo: `${brand.url}${brand.logo.png}`,
  };

  if (org.alternateName) data.alternateName = org.alternateName;
  if (org.url) data.url = org.url;
  if (org.description) data.description = org.description;
  if (org.foundingDate) data.foundingDate = org.foundingDate;
  if (sameAs.length > 0) data.sameAs = sameAs;

  const addr = org.address;
  if (addr.streetAddress || addr.addressLocality || addr.addressCountry) {
    const address: Record<string, unknown> = { "@type": "PostalAddress" };
    if (addr.streetAddress) address.streetAddress = addr.streetAddress;
    if (addr.addressLocality) address.addressLocality = addr.addressLocality;
    if (addr.addressRegion) address.addressRegion = addr.addressRegion;
    if (addr.addressCountry) address.addressCountry = addr.addressCountry;
    data.address = address;
  }

  const cp = org.contactPoint;
  if (cp.telephone || cp.contactType) {
    const contact: Record<string, unknown> = { "@type": "ContactPoint" };
    if (cp.telephone) contact.telephone = cp.telephone;
    if (cp.contactType) contact.contactType = cp.contactType;
    if (cp.availableLanguage.length > 0) contact.availableLanguage = [...cp.availableLanguage];
    data.contactPoint = contact;
  }

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
  readingTimeMinutes?: number;
  seriesName?: string;
  seriesUrl?: string;
  positionInSeries?: number;
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
  readingTimeMinutes,
  seriesName,
  seriesUrl,
  positionInSeries,
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
        "@type": "BlogPosting",
        headline: title,
        description,
        url,
        datePublished,
        dateModified,
        author,
        publisher,
        ...(image && { image }),
        ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
        ...(wordCount && { wordCount }),
        ...(readingTimeMinutes && { timeRequired: `PT${readingTimeMinutes}M` }),
        ...(seriesName && seriesUrl && {
          isPartOf: {
            "@type": "CreativeWorkSeries",
            name: seriesName,
            url: seriesUrl,
          },
        }),
        ...(positionInSeries != null && { position: positionInSeries }),
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

export function BlogJsonLd({
  url,
  name,
  description,
}: {
  url: string;
  name: string;
  description: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        name,
        url,
        description,
        inLanguage: brand.lang,
        publisher,
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
  sameAs?: string[];
};

export function PersonJsonLd({
  name,
  url,
  image,
  jobTitle,
  description,
  sameAs,
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
        ...(sameAs && sameAs.length > 0 && { sameAs }),
        worksFor: {
          "@type": "Organization",
          name: brand.name,
          url: brand.organization.url,
        },
      }}
    />
  );
}

export function SeriesJsonLd({
  name,
  url,
  description,
  posts,
}: {
  name: string;
  url: string;
  description: string;
  posts: { title: string; slug: string }[];
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWorkSeries",
        name,
        url,
        description,
        inLanguage: brand.lang,
        publisher,
        hasPart: posts.map((post, index) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `${brand.url}/${post.slug}`,
          position: index + 1,
        })),
      }}
    />
  );
}
