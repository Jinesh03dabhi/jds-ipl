import { MetadataRoute } from "next";
import { PLAYERS, TEAMS } from "@/lib/data";
import { getIplSchedule, STADIUM_PROFILES } from "@/lib/ipl-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://jds-ipl.vercel.app";
  const now = new Date();
  const schedule = await getIplSchedule();

  const playerUrls = PLAYERS.map((player) => ({
    url: `${baseUrl}/players/${player.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const teamUrls = TEAMS.map((team) => ({
    url: `${baseUrl}/teams/${team.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const matchUrls = schedule.matches.flatMap((match) => [
    {
      url: `${baseUrl}/matches/${match.detailSlug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.82,
    },
    {
      url: `${baseUrl}/matches/${match.detailSlug}/live`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.84,
    },
    {
      url: `${baseUrl}/matches/${match.detailSlug}/result`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.83,
    },
    {
      url: `${baseUrl}/${match.predictionSlug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.86,
    },
  ]);

  const pitchReportUrls = STADIUM_PROFILES.map((profile) => ({
    url: `${baseUrl}/${profile.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.78,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/ipl-live-score-today`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.98,
    },
    {
      url: `${baseUrl}/ipl-match-result-yesterday`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.92,
    },
    {
      url: `${baseUrl}/ipl-points-table-2026`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.97,
    },
    {
      url: `${baseUrl}/predictions`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auction`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.91,
    },
    {
      url: `${baseUrl}/live-score`,
      lastModified: now,
      changeFrequency: "always",
      priority: 0.88,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/top-10-expensive-ipl-players`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best-ipl-bowlers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ipl-auction-strategy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ipl-winners`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...pitchReportUrls,
    ...matchUrls,
    ...playerUrls,
    ...teamUrls,
  ];
}
