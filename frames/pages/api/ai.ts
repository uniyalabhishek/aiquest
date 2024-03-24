import type { NextApiRequest, NextApiResponse } from "next";

import { kv } from "@vercel/kv";

import OpenAI from "openai";
import { createPrompt } from "../../app/data";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import { init, getFarcasterUserDetails } from "@airstack/frames";
init(process.env.AIRSTACK_API_KEY || "");

import { PinataFDK } from "pinata-fdk";
const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT as string,
  pinata_gateway: process.env.GATEWAY_URL as string,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const requesterFid = body.requesterFid;
  const sessionKey = body.sessionKey;
  const inputText = body.inputText;
  const ctxRequest = body.ctxRequest;
  const frame_id = "ai-quest";
  const custom_id = requesterFid.toString();
  const messages: any = [];
  const imageUrls: any = [];
  const sessionData: any = await kv.get(sessionKey);
  if (!sessionData) {
    const { data: airstackData } = await getFarcasterUserDetails({ fid: requesterFid });
    const followerCount = airstackData?.followerCount || 0;
    const followingCount = airstackData?.followingCount || 0;
    const difficultyLevel = ((followerCount + followingCount) % 4) + 1;
    const basePrompt = createPrompt(difficultyLevel);
    if (process.env.NODE_ENV === "production") {
      const url = `https://api.pinata.cloud/farcaster/frames/interactions?frame_id=${frame_id}&custom_id=${custom_id}`;
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      };
      const analytics = await fetch(url, requestOptions).then((response) => response.json());
      console.log(analytics);
    }

    messages.push({ role: "system", content: basePrompt });
  } else {
    messages.push(...(sessionData.messages as any));
    imageUrls.push(...(sessionData.imageUrls as any));
  }
  messages.push({ role: "user", content: inputText });
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  const responseText = chatCompletion.choices[0]?.message?.content as string;
  console.log("responseText", responseText);
  const imageCompletion = await openai.images.generate({
    model: "dall-e-2",
    prompt: `pixel art, detailed senary, dark fantasy, rpg, occupies the majority of the image's space, ${responseText}`,
    size: "256x256",
    n: 1,
  });
  const imageUrl = imageCompletion.data[0]?.url as string;
  console.log(imageUrl);
  messages.push({ role: "assistant", content: responseText });
  imageUrls.push(imageUrl);
  const data = { messages, imageUrls };
  await kv.set(sessionKey, JSON.stringify(data));
  if (process.env.NODE_ENV === "production") {
    await fdk.sendAnalytics(frame_id, ctxRequest, custom_id);
  }
  res.status(200).json({ data, status: "success" });
}
