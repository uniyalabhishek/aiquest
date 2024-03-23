import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

import ffmpeg from "fluent-ffmpeg";
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

const duration = 5;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionKey = body.sessionKey;
  const sessionData: any = await kv.get(sessionKey);
  let logs = "";
  const command = ffmpeg();
  // sessionData.imageUrls.forEach((image: string) => {
  //   command.input(image).inputOptions(`-t ${duration}`);
  // });

  // command
  //   .on("start", function (commandLine: any) {
  //     logs += `Spawned FFmpeg with command: ${commandLine}\n`;
  //   })
  //   .on("error", function (err: any) {
  //     logs += `An error occurred: ${err.message}\n`;
  //     writeFileAsync("ffmpeg_logs.txt", logs); // Write logs asynchronously when error occurs
  //   })
  //   .on("end", async function () {
  //     logs += "Processing finished!\n";
  //     await writeFileAsync("ffmpeg_logs.txt", logs); // Write logs asynchronously when processing finishes
  //     console.log("Video has been created and logs have been written to ffmpeg_logs.txt");
  //   })
  //   .mergeToFile("test.mp4", "./temp");

  const videoUrl = "video";
  const data = { ...sessionData, videoUrl };
  await kv.set(sessionKey, JSON.stringify(data));
  return NextResponse.json({
    data,
    status: "success",
  });
}
