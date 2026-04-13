import { NextResponse } from "next/server";
import { getIplSchedule } from "@/lib/ipl-data";

export async function GET() {
  try {
    const data = await getIplSchedule();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[API /schedule] Failed to load schedule", {
      reason: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        matches: [],
        lastUpdated: new Date().toISOString(),
        source: "unavailable",
        series: null,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, must-revalidate",
        },
      },
    );
  }
}
