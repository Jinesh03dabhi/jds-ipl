import { getIplLiveSnapshot } from "@/lib/ipl-data";

export async function GET() {
  const data = await getIplLiveSnapshot();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, max-age=60, must-revalidate",
    },
  });
}
