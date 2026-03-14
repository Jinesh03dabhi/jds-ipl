import { NextResponse } from "next/server";

const baseUrl = "https://jds-ipl.vercel.app";

const articles = [
  {
    url: `${baseUrl}/top-10-expensive-ipl-players`,
    title: "Top 10 Most Expensive IPL Players",
    publicationDate: "2025-12-01",
    keywords: "IPL auction, most expensive IPL players, auction prices",
  },
  {
    url: `${baseUrl}/best-ipl-bowlers`,
    title: "Best IPL Bowlers of All Time",
    publicationDate: "2025-12-10",
    keywords: "IPL bowlers, wicket takers, IPL statistics",
  },
  {
    url: `${baseUrl}/ipl-auction-strategy`,
    title: "IPL Auction Strategy Guide",
    publicationDate: "2025-12-05",
    keywords: "IPL auction strategy, squad building, IPL rules",
  },
  {
    url: `${baseUrl}/ipl-winners`,
    title: "IPL Winners List 2008-2025",
    publicationDate: "2025-12-20",
    keywords: "IPL winners, IPL champions, IPL finals",
  },
];

export async function GET() {
  const newsItems = articles
    .map(
      (article) => `
  <url>
    <loc>${article.url}</loc>
    <news:news>
      <news:publication>
        <news:name>IPL Scorebook</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.publicationDate}</news:publication_date>
      <news:title>${article.title}</news:title>
      <news:keywords>${article.keywords}</news:keywords>
    </news:news>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsItems}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
