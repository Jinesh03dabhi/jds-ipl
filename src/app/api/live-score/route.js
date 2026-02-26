import axios from "axios";

let cachedData = null;
let lastFetch = 0;
let dynamicCacheTime = 1800000; // default 30 min
let isFetching = false;

const CACHE_LIVE = 60000;        // 1 min during live
const CACHE_NEAR_MATCH = 300000; // 5 min (within 2 hrs)
const CACHE_UPCOMING_FAR = 1800000; // 30 min
const CACHE_COMPLETED = 900000;  // 15 min

const API_KEYS = [
  process.env.CRIC_API_KEY_1,
  process.env.CRIC_API_KEY_2,
  process.env.CRIC_API_KEY_3,
  process.env.CRIC_API_KEY_4,
  process.env.CRIC_API_KEY_5,
  process.env.CRIC_API_KEY_6
].filter(Boolean);

// 🎯 ONLY T20 WORLD CUP
const allowedKeywords = [
  "t20 world cup",
  "icc men's t20 world cup",
  "icc t20 world cup"
];

const isTargetSeries = (series = "") => {
  const s = series.toLowerCase();
  return allowedKeywords.some(keyword => s.includes(keyword));
};

async function fetchFromAPI(key) {
  try {
    const res = await axios.get(
      `https://api.cricapi.com/v1/currentMatches?apikey=${key}&offset=0`
    );

    if (res.data.status === "failure") {
      throw new Error(res.data.reason);
    }

    const matches = res.data.data || [];

    // 🔥 LIVE MATCH
    const liveMatch = matches.find(m =>
      isTargetSeries(m.series) &&
      m.matchStarted === true &&
      m.matchEnded !== true
    );

    if (liveMatch) {

      let scorecard = null;

      // Only fetch scorecard during live
      try {
        const scoreRes = await axios.get(
          `https://api.cricapi.com/v1/match_scorecard?apikey=${key}&id=${liveMatch.id}`
        );
        scorecard = scoreRes?.data?.data || null;
      } catch (e) {
        console.warn("Scorecard fetch failed:", e.message);
      }

      dynamicCacheTime = CACHE_LIVE;

      return {
        type: "live",
        match: liveMatch,
        scorecard,
        message: "Live T20 World Cup match"
      };
    }

    // 🔜 UPCOMING MATCH
    const upcomingMatch = matches.find(m =>
      isTargetSeries(m.series) && m.matchStarted === false
    );

    if (upcomingMatch) {

      const matchStart = new Date(upcomingMatch.dateTimeGMT).getTime();
      const now = Date.now();
      const twoHoursBefore = matchStart - (2 * 60 * 60 * 1000);

      // Smart cache timing
      if (now >= twoHoursBefore) {
        dynamicCacheTime = CACHE_NEAR_MATCH; // 5 min
      } else {
        dynamicCacheTime = CACHE_UPCOMING_FAR; // 30 min
      }

      return {
        type: "upcoming",
        match: upcomingMatch,
        message: `Next match at ${upcomingMatch.dateTimeGMT}`
      };
    }

    // ✅ COMPLETED
    const lastMatch = matches.find(m =>
      isTargetSeries(m.series) && m.matchEnded === true
    );

    if (lastMatch) {
      dynamicCacheTime = CACHE_COMPLETED;

      return {
        type: "completed",
        match: lastMatch,
        message: "Last completed match"
      };
    }

    dynamicCacheTime = CACHE_UPCOMING_FAR;

    return {
      type: "waiting",
      message: "Waiting for T20 World Cup matches"
    };

  } catch (err) {
    console.error("API fetch error:", err.message);

    if (err.message?.includes("exceeded hits limit")) {
      return { blocked: true };
    }

    return null;
  }
}

export async function GET() {

  if (cachedData && Date.now() - lastFetch < dynamicCacheTime) {
    return Response.json(cachedData);
  }

  if (isFetching) {
    return Response.json(cachedData || {
      type: "loading",
      message: "Fetching latest data..."
    });
  }

  isFetching = true;

  let result = null;

  for (const key of API_KEYS) {

    result = await fetchFromAPI(key);

    if (result?.blocked) {
      isFetching = false;
      return Response.json({
        type: "error",
        message: "Daily API limit reached. Updates resume tomorrow."
      });
    }

    if (result) break;
  }

  isFetching = false;

  if (!result) {
    return Response.json({
      type: "error",
      message: "Live data temporarily unavailable"
    });
  }

  result.lastUpdated = Date.now();
  cachedData = result;
  lastFetch = Date.now();

  console.log("Cache time:", dynamicCacheTime / 1000, "seconds");

  return Response.json(result);
}