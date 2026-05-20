import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAudioFeatures } from "@/lib/spotify/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids")?.split(",") || [];
  if (!ids.length) return NextResponse.json({ audio_features: [] });
  try {
    const data = await getAudioFeatures(session.accessToken, ids);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
