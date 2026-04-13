import {
  getIplLiveSnapshot,
  getIplSchedule,
  getLatestCompletedMatch,
} from "@/lib/ipl-data";

export async function GET(request) {
  try {
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
  } catch (error) {
    console.error("[API /live-score] Failed to load live snapshot", {
      reason: error instanceof Error ? error.message : String(error),
    });

    return Response.json(
      {
        type: "error",
        message: "Live updates temporarily unavailable.",
        source: "unavailable",
        lastUpdated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=15, must-revalidate",
        },
      },
    );
  }
}
