import {
  getIplLiveSnapshot,
  getIplSchedule,
  getLatestCompletedMatch,
} from "@/lib/ipl-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");

  if (mode === "points-table") {
    const schedule = await getIplSchedule();
    const latestCompleted = getLatestCompletedMatch(schedule.matches);

    const data = latestCompleted
      ? {
          type: "completed",
          match: latestCompleted,
          message: latestCompleted.result || "Latest completed IPL match.",
          source: schedule.source,
          lastUpdated: schedule.lastUpdated,
        }
      : {
          type: "waiting",
          message: "Waiting for completed IPL results.",
          source: schedule.source,
          lastUpdated: schedule.lastUpdated,
        };

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, must-revalidate",
      },
    });
  }

  const data = await getIplLiveSnapshot();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, max-age=60, must-revalidate",
    },
  });
}
