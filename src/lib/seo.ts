import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type MetadataInput = {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
};

type FAQItem = {
  question: string;
  answer: string;
};

type SportsSchemaInput = {
  name: string;
  description?: string;
  url: string;
  type?: "SportsEvent" | "SportsTeam" | "SportsOrganization";
  sport?: string;
  startDate?: string;
  locationName?: string;
  competitors?: Array<{
    name: string;
    url?: string;
  }>;
};

function normalizePath(slug: string) {
  if (!slug) {
    return "/";
  }

  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function generateMetadata({
  title,
  description,
  slug,
  keywords = [],
  image = `${SITE_URL}/opengraph-image`,
  type = "website",
}: MetadataInput): Metadata {
  const path = normalizePath(slug);
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateSportsSchema({
  name,
  description,
  url,
  type = "SportsEvent",
  sport = "Cricket",
  startDate,
  locationName,
  competitors = [],
}: SportsSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    sport,
    url: `${SITE_URL}${normalizePath(url)}`,
    ...(startDate ? { startDate } : {}),
    ...(locationName
      ? {
          location: {
            "@type": "Place",
            name: locationName,
          },
        }
      : {}),
    ...(competitors.length
      ? {
          competitor: competitors.map((competitor) => ({
            "@type": "SportsTeam",
            name: competitor.name,
            ...(competitor.url ? { url: `${SITE_URL}${normalizePath(competitor.url)}` } : {}),
          })),
        }
      : {}),
  };
}
