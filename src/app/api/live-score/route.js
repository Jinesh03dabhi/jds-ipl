import axios from "axios";

let cachedData = null;
let lastFetch = 0;
let dynamicCacheTime = 120000;
let isFetching = false;

const CACHE_LIVE = 60000;
const CACHE_UPCOMING = 600000;
const CACHE_WAITING = 1800000;

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

const isIPL = (series = "") => {
  const s = series.toLowerCase();
  return s.includes("") || s.includes("");
};

const liveMatch = matches.find(m =>
  isIPL(m.series) &&
  m.matchStarted === true &&
  m.matchEnded !== true &&
  !(m.status || "").toLowerCase().includes("won")
);

if (liveMatch) {
  let scorecard = null;

  try {
    const scoreRes = await axios.get(
      `https://api.cricapi.com/v1/match_scorecard?apikey=${key}&id=${liveMatch.id}`
    );
    scorecard = scoreRes?.data?.data || null;
  } catch (e) {
    console.warn("Scorecard fetch failed");
  }

  dynamicCacheTime = CACHE_LIVE;

  return {
    type: "live",
    match: liveMatch,
    scorecard,
    message: "Live IPL match"
  };
}

const upcomingMatch = matches.find(m =>
  isIPL(m.series) && m.matchStarted === false
);

if (upcomingMatch) {
  dynamicCacheTime = CACHE_UPCOMING;
  return {
    type: "upcoming",
    match: upcomingMatch,
    message: `Next IPL match at ${upcomingMatch.dateTimeGMT}`
  };
}

const lastMatch = matches.find(m =>
  isIPL(m.series) && m.matchEnded === true
);

if (lastMatch) {
  dynamicCacheTime = CACHE_WAITING;
  return {
    type: "last",
    match: lastMatch,
    message: "Last completed match"
  };
}

dynamicCacheTime = CACHE_WAITING;
return { type: "waiting", message: "Waiting for IPL season 🏏" };


} catch (err) {
console.error("API fetch error:", err.message);
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
if (result) break;
}

isFetching = false;

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
