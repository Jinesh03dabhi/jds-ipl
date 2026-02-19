import { MetadataRoute } from 'next'
import { PLAYERS, TEAMS } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jds-ipl.vercel.app'

  const playerUrls = PLAYERS.map((player) => ({
    url: `${baseUrl}/players/${player.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const teamUrls = TEAMS.map((team) => ({
    url: `${baseUrl}/teams/${team.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...playerUrls,
    ...teamUrls,
  ]
}
