import { NextResponse } from "next/server";
import { getIplSchedule } from "@/lib/ipl-data";

export async function GET() {
  const data = await getIplSchedule();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=60, must-revalidate",
    },
  });
}
