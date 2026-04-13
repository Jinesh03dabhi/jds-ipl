import { unstable_cache } from "next/cache";
import { IPL_SEASON_YEAR } from "@/lib/site";

const OFFICIAL_COMPETITION_FEED_URL = "https://scores.iplt20.com/ipl/mc/competition.js";
const DEFAULT_OFFICIAL_FEED_SOURCE =
  "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds";

type RetryOptions = {
  label: string;
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
};

type OfficialCompetitionFeed = {
  competition?: unknown;
  livecompetition?: unknown;
};

type OfficialCompetitionFlags = {
  live: boolean;
  fixtures: boolean;
  completed: boolean;
};

export type OfficialIplCompetition = {
  id: string;
  name: string;
  seasonId: number | null;
  seasonName: string | null;
  year: number | null;
  codingType: string | null;
  feedSource: string;
  timezone: string | null;
} & OfficialCompetitionFlags;

function logOfficial(level: "info" | "warn" | "error", message: string, details?: unknown) {
  const prefix = `[IPL Official Feed] ${message}`;

  if (level === "error") {
    console.error(prefix, details ?? "");
    return;
  }

  if (level === "warn") {
    console.warn(prefix, details ?? "");
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(prefix, details ?? "");
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchTextWithRetry(url: string, options: RetryOptions) {
  const retries = options.retries ?? 2;
  const retryDelayMs = options.retryDelayMs ?? 500;
  const timeoutMs = options.timeoutMs ?? 10_000;

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          accept: "application/json, application/javascript, text/plain, */*",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        logOfficial("warn", `${options.label} request failed, retrying`, {
          attempt: attempt + 1,
          url,
          reason: error instanceof Error ? error.message : String(error),
        });
        await sleep(retryDelayMs * (attempt + 1));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`${options.label} request failed`);
}

function parseJsonpPayload<TData>(payloadText: string, callbackName?: string) {
  const trimmed = payloadText.trim().replace(/;$/, "");

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed) as TData;
  }

  const prefix = callbackName ? `${callbackName}(` : "";
  const candidate = prefix && trimmed.startsWith(prefix) ? trimmed.slice(prefix.length) : trimmed;
  const startIndex = candidate.indexOf("(");
  const jsonBody =
    prefix && trimmed.startsWith(prefix)
      ? candidate.slice(0, -1)
      : startIndex !== -1
        ? candidate.slice(startIndex + 1, -1)
        : candidate;

  return JSON.parse(jsonBody) as TData;
}

function toBooleanFlag(value: unknown) {
  return value === true || value === 1 || value === "1";
}

function extractYear(value: unknown) {
  const match = String(value || "").match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function normalizeCompetition(entry: any): OfficialIplCompetition | null {
  const name = String(entry?.CompetitionName || entry?.name || "").trim();

  if (!name || !/\bipl\b/i.test(name)) {
    return null;
  }

  return {
    id: String(entry?.CompetitionID || entry?.id || ""),
    name,
    seasonId: Number.isFinite(Number(entry?.SeasonID)) ? Number(entry.SeasonID) : null,
    seasonName: entry?.SeasonName ? String(entry.SeasonName) : null,
    year: extractYear(entry?.CompetitionName || entry?.SeasonName || entry?.name),
    codingType: entry?.CodingType ? String(entry.CodingType) : null,
    feedSource: String(entry?.feedsource || DEFAULT_OFFICIAL_FEED_SOURCE),
    timezone: entry?.timezone ? String(entry.timezone) : null,
    live: toBooleanFlag(entry?.live),
    fixtures: toBooleanFlag(entry?.fixtures),
    completed: toBooleanFlag(entry?.completed),
  };
}

function scoreCompetition(competition: OfficialIplCompetition) {
  const nowYear = new Date().getFullYear();
  let score = 0;

  if (competition.live) score += 1000;
  if (competition.fixtures) score += 500;
  if (competition.completed) score += 250;
  if (competition.year === IPL_SEASON_YEAR) score += 150;
  if (competition.year === nowYear) score += 125;
  if (competition.year === nowYear - 1) score += 50;
  if (competition.year) score += competition.year;
  if (competition.seasonId) score += competition.seasonId;

  return score;
}

const getOfficialCompetitionFeed = unstable_cache(
  async (): Promise<OfficialCompetitionFeed> => {
    const rawText = await fetchTextWithRetry(OFFICIAL_COMPETITION_FEED_URL, {
      label: "competition feed",
      retries: 2,
      retryDelayMs: 500,
      timeoutMs: 10_000,
    });

    return parseJsonpPayload<OfficialCompetitionFeed>(rawText, "oncomptetion");
  },
  ["ipl-official-competition-feed-v1"],
  { revalidate: 60 * 10 },
);

export const discoverOfficialIplCompetition = unstable_cache(
  async (): Promise<OfficialIplCompetition | null> => {
    const payload = await getOfficialCompetitionFeed();
    const competitions = Array.isArray(payload?.competition) ? payload.competition : [];
    const normalized = competitions.map(normalizeCompetition).filter(Boolean) as OfficialIplCompetition[];

    if (!normalized.length) {
      logOfficial("warn", "No IPL competitions found in official feed");
      return null;
    }

    const selected = [...normalized].sort((left, right) => scoreCompetition(right) - scoreCompetition(left))[0];

    logOfficial("info", "Selected official IPL competition", selected);
    return selected ?? null;
  },
  [`ipl-official-competition-${IPL_SEASON_YEAR}-v1`],
  { revalidate: 60 * 10 },
);

function scheduleFilenameForCompetition(competition: OfficialIplCompetition) {
  return competition.codingType === "T20Lite" ? "matchschedule" : "matchSchedule";
}

export const fetchOfficialIplScheduleFeed = unstable_cache(
  async (competition: OfficialIplCompetition) => {
    const fileName = `${competition.id}-${scheduleFilenameForCompetition(competition)}.js`;
    const feedUrl = `${competition.feedSource}/${fileName}`;
    const rawText = await fetchTextWithRetry(feedUrl, {
      label: "schedule feed",
      retries: 2,
      retryDelayMs: 700,
      timeoutMs: 12_000,
    });
    const payload = parseJsonpPayload<{ Matchsummary?: unknown }>(rawText, "MatchSchedule");
    return Array.isArray(payload?.Matchsummary) ? payload.Matchsummary : [];
  },
  ["ipl-official-schedule-feed-v1"],
  { revalidate: 30 },
);
