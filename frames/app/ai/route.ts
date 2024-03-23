import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

import OpenAI from "openai";
import { originalPrompt } from "../data";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionKey = body.sessionKey;
  const inputText = body.inputText;
  const messages: any = [];
  const imageUrls: any = [];
  const sessionData: any = await kv.get(sessionKey);
  if (!sessionData) {
    messages.push({ role: "system", content: originalPrompt });
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
  return NextResponse.json({
    data,
    status: "success",
  });
}
