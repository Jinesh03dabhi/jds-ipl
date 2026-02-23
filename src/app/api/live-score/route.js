import axios from "axios";

let cachedData = null;
let lastFetch = 0;
let dynamicCacheTime = 120000;
let isFetching = false;

// Cache times
const CACHE_LIVE = 60000; // 1 min
const CACHE_UPCOMING = 600000; // 10 min
const CACHE_WAITING = 1800000; // 30 min

const API_KEYS = [
  process.env.CRIC_API_KEY_1,
  process.env.CRIC_API_KEY_2,
  process.env.CRIC_API_KEY_3,
  process.env.CRIC_API_KEY_4,
  process.env.CRIC_API_KEY_5
].filter(Boolean);

async function fetchFromAPI(key) {
  try {
    const res = await axios.get(
      `https://api.cricapi.com/v1/currentMatches?apikey=${key}&offset=0`
    );

    if (res.data.status === "failure") {
      throw new Error(res.data.reason);
    }

    const matches = res.data.data || [];

    // ✅ LIVE IPL MATCH
    const liveMatch = matches.find(m => {
      const status = (m.status || "").toLowerCase();
      const series = (m.series || "").toLowerCase();

      return (
        series.includes("") &&
        m.matchStarted === true &&
        m.matchEnded !== true &&
        !status.includes("won") &&
        !status.includes("result") &&
        !status.includes("draw")
      );
    });

    // 🟢 LIVE
    if (liveMatch) {
      const scoreRes = await axios.get(
        `https://api.cricapi.com/v1/match_scorecard?apikey=${key}&id=${liveMatch.id}`
      );

      dynamicCacheTime = CACHE_LIVE;

      return {
        type: "live",
        match: liveMatch,
        scorecard: scoreRes.data.data,
        message: "Live IPL match"
      };
    }

    // 🟡 UPCOMING IPL
    const upcomingMatch = matches.find(m => {
      const series = (m.series || "").toLowerCase();
      return series.includes("") && m.matchStarted === false;
    });

    if (upcomingMatch) {
      dynamicCacheTime = CACHE_UPCOMING;

      return {
        type: "upcoming",
        match: upcomingMatch,
        message: `Next IPL match at ${upcomingMatch.dateTimeGMT}`
      };
    }

    const lastMatch = matches.find(m => {
  const series = (m.series || "").toLowerCase();
  return series.includes("") && m.matchEnded === true;
});

if (lastMatch) {
  dynamicCacheTime = CACHE_WAITING;

  return {
    type: "last",
    match: lastMatch,
    message: "Last completed match"
  };
}

    // 🔴 WAITING
    dynamicCacheTime = CACHE_WAITING;

    return {
      type: "waiting",
      message: "Waiting for IPL season 🏏"
    };

  } catch (err) {
    return null;
  }
}

export async function GET() {

  // ✅ Return cache if valid
  if (cachedData && Date.now() - lastFetch < dynamicCacheTime) {
    return Response.json(cachedData);
  }

  // ✅ Prevent duplicate simultaneous requests
  if (isFetching) {
    return Response.json(cachedData || {
      type: "loading",
      message: "Fetching latest data..."
    });
  }

  isFetching = true;

  let result = null;

  // ✅ API failover keys
  for (const key of API_KEYS) {
    result = await fetchFromAPI(key);
    if (result) break;
  }

  isFetching = false;

  // ✅ If all keys fail → fallback to cache
  if (!result) {
    return Response.json(cachedData || {
      type: "error",
      message: "Service temporarily unavailable"
    });
  }

  result.lastUpdated = Date.now();

  cachedData = result;
  lastFetch = Date.now();

  return Response.json(result);
}