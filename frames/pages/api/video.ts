import type { NextApiRequest, NextApiResponse } from "next";

import { kv } from "@vercel/kv";

import ffmpeg from "fluent-ffmpeg";
const fs = require("fs");
const util = require("util");
const os = require("os");
const path = require("path");
const writeFileAsync = util.promisify(fs.writeFile);

const duration = 2;

const images = ["https://placehold.jp/500x500.png", "https://placehold.jp/500x500.png"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = await req.body;
  const sessionKey = body.sessionKey;
  //   const sessionData: any = await kv.get(sessionKey);
  const tempDir = os.tmpdir();
  const localImages: string[] = [];
  const time = Date.now();
  for (let i = 0; i < images.length; i++) {
    const fileName = `${time}-${i}.png`;
    const tempFilePath = path.join(tempDir, fileName);
    console.log(images[i]);
    const response = await fetch(images[i] as string);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFileAsync(tempFilePath, buffer);
    console.log(tempFilePath);
    localImages.push(tempFilePath);
  }
  const command = ffmpeg();
  localImages.forEach((image: string) => {
    command.input(image).inputOptions(["-loop 1", `-t ${duration}`]);
  });
  const outputPath = path.join(tempDir, `${time}-video.png`);
  console.log(outputPath);
  command
    .fps(1)
    .on("start", function (commandLine: any) {
      console.log(`Spawned FFmpeg with command: ${commandLine}`);
    })
    .on("progress", function (progress) {
      console.log("Processing: " + progress.percent + "% done");
    })
    .on("error", function (err: any) {
      console.log(`An error occurred: ${err.message}`);
    })
    .on("end", async function () {
      console.log("Video has been created");
    })
    .mergeToFile(`${time}-video.mp4`, "./temp");
  console.log("ok");
  res.status(500).json({ ok: "ok" });
}
