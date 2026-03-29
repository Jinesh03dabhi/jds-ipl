import {
  DEFAULT_EDITOR_NAME,
  IPL_TIMEZONE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

type WordSource = string | string[] | null | undefined;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

type ArticleSchemaConfig = {
  headline: string;
  description: string;
  path: string;
  dateModified?: string;
  datePublished?: string;
  keywords?: string[];
  authorName?: string;
};

function normalizeWordSource(source: WordSource) {
  if (!source) {
    return "";
  }

  return Array.isArray(source) ? source.join(" ") : source;
}

export function countWords(...sources: WordSource[]) {
  const combined = sources
    .map(normalizeWordSource)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!combined) {
    return 0;
  }

  return combined.split(" ").length;
}

export function formatEditorialTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: IPL_TIMEZONE,
  }).format(date);
}

export function buildArticleSchema({
  headline,
  description,
  path,
  dateModified,
  datePublished,
  keywords,
  authorName = DEFAULT_EDITOR_NAME,
}: ArticleSchemaConfig) {
  const modified = dateModified || new Date().toISOString();
  const published = datePublished || modified;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    mainEntityOfPage: `${SITE_URL}${path}`,
    dateModified: modified,
    datePublished: published,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/jds-ipl-logo-1.png`,
      },
    },
    image: `${SITE_URL}/opengraph-image`,
    keywords,
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
