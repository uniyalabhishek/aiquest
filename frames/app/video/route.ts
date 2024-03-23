import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionKey = body.sessionKey;
  const sessionData: any = await kv.get(sessionKey);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const videoUrl = "video";
  const data = { ...sessionData, videoUrl };
  await kv.set(sessionKey, JSON.stringify(data));
  return NextResponse.json({
    data,
    status: "success",
  });
}
