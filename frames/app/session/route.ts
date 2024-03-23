import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const newSessionKey = crypto.randomUUID();
  console.log("newSessionKey", newSessionKey);
  return NextResponse.json({
    newSessionKey,
  });
}
