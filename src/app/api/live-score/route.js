// import axios from "axios";

// let cachedData = null;
// let lastFetch = 0;
// const CACHE_TIME = 120000; // 2 minutes


// const REFRESH_INTERVAL = 60 * 1000; // 1 minute

// export async function GET() {

//   const now = Date.now();
  
//   // Serve cached response
//   if (cachedData && Date.now() - lastFetch < CACHE_TIME) {
//   return Response.json(cachedData);
// }

//   if (!process.env.CRIC_API_KEY) {
//   return Response.json({
//     type: "error",
//     message: "API key missing"
//   });
// }

//   try {

//     const res = await axios.get(
//       `https://api.cricapi.com/v1/currentMatches?apikey=${process.env.CRIC_API_KEY}&offset=0`
//     );

//     const matches = res.data.data || [];

//     const liveMatch = matches.find(m => m.matchStarted);

//     if (!liveMatch) {
//       const responseData = {
//   type: "none",
//   message: "No match detected",
//   lastUpdated: Date.now()
// };

// cachedData = responseData;
// lastFetch = Date.now();

// return Response.json(responseData);


//     }

//     const scoreRes = await axios.get(
//       `https://api.cricapi.com/v1/match_scorecard?apikey=${process.env.CRIC_API_KEY}&id=${liveMatch.id}`
//     );

//     const responseData = {
//   type: "live",
//   match: liveMatch,
//   scorecard: scoreRes.data.data,
//   lastUpdated: Date.now()
// };

// cachedData = responseData;
// lastFetch = Date.now();

// return Response.json(responseData);




//   } catch {
//     return Response.json({ type: "error" });
//   }
// }



// import axios from "axios";

// let cachedData = null;
// let lastFetch = 0;
// const CACHE_TIME = 120000; // 2 minutes

// // Multiple API keys (failover)
// const API_KEYS = [
//   process.env.CRIC_API_KEY_1,
//   process.env.CRIC_API_KEY_2,
//   process.env.CRIC_API_KEY_3,
//   process.env.CRIC_API_KEY_4,
//   process.env.CRIC_API_KEY_5
// ].filter(Boolean);

// async function fetchFromAPI(key) {
//   try {
//     const res = await axios.get(
//       `https://api.cricapi.com/v1/currentMatches?apikey=${key}&offset=0`
//     );

//     if (res.data.status === "failure") {
//       throw new Error(res.data.reason);
//     }

//     const matches = res.data.data || [];

//     // ✅ STRICT LIVE DETECTION
//     const liveMatch = matches.find(m => {
//       const status = (m.status || "").toLowerCase();

//       return (
//         m.matchStarted === true &&
//         m.matchEnded !== true &&
//         !status.includes("won") &&
//         !status.includes("result") &&
//         !status.includes("draw")
//       );
//     });

//     if (!liveMatch) {
//       return {
//         type: "none",
//         message: "No live match currently"
//       };
//     }

//     const scoreRes = await axios.get(
//       `https://api.cricapi.com/v1/match_scorecard?apikey=${key}&id=${liveMatch.id}`
//     );

//     return {
//       type: "live",
//       match: liveMatch,
//       scorecard: scoreRes.data.data
//     };

//   } catch (err) {
//     return null;
//   }
// }

// export async function GET() {

//   // Cache first
//   if (cachedData && Date.now() - lastFetch < CACHE_TIME) {
//     return Response.json(cachedData);
//   }

//   let result = null;

//   for (const key of API_KEYS) {
//     result = await fetchFromAPI(key);
//     if (result) break;
//   }

//   if (!result) {
//     result = {
//       type: "error",
//       message: "All API keys failed or rate limited"
//     };
//   }

//   result.lastUpdated = Date.now();

//   cachedData = result;
//   lastFetch = Date.now();

//   return Response.json(result);
// }


import axios from "axios";

let cachedData = null;
let lastFetch = 0;
let dynamicCacheTime = 120000; // default 2 min

const CACHE_LIVE = 60000; // 1 min
const CACHE_NO_MATCH = 600000; // 10 min

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

    const liveMatch = matches.find(m => {
      const status = (m.status || "").toLowerCase();
      return (
        m.matchStarted === true &&
        m.matchEnded !== true &&
        !status.includes("won") &&
        !status.includes("result") &&
        !status.includes("draw")
      );
    });

    if (!liveMatch) {
      dynamicCacheTime = CACHE_NO_MATCH;

      return {
        type: "none",
        message: "NO LIVE MATCH NOW!"
      };
    }

    const scoreRes = await axios.get(
      `https://api.cricapi.com/v1/match_scorecard?apikey=${key}&id=${liveMatch.id}`
    );

    dynamicCacheTime = CACHE_LIVE;

    return {
      type: "live",
      match: liveMatch,
      scorecard: scoreRes.data.data
    };

  } catch {
    return null;
  }
}

export async function GET() {

  // Smart cache
  if (cachedData && Date.now() - lastFetch < dynamicCacheTime) {
    return Response.json(cachedData);
  }

  let result = null;

  for (const key of API_KEYS) {
    result = await fetchFromAPI(key);
    if (result) break;
  }

  if (!result) {
    result = {
      type: "error",
      message: "API rate limited"
    };
  }

  result.lastUpdated = Date.now();

  cachedData = result;
  lastFetch = Date.now();

  return Response.json(result);
}