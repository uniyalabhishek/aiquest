/* eslint-disable react/jsx-key */
import fs from "fs";
import path from "path";
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";
import { kv } from "@vercel/kv";
import OpenAI from "openai";
import { originalPrompt } from "../data";

const frames = createFrames({
  basePath: "/frames",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const bitcell = fs.readFileSync(path.join(process.cwd(), "/public/bitcell_memesbruh03.ttf"));
const defaultFonts = [
  {
    name: "Bitcell",
    data: bitcell,
    weight: 400,
    style: "normal",
  },
];
const defaultAspectRatio = "1:1";
const defaultImageOptions = {
  aspectRatio: defaultAspectRatio,
  fonts: defaultFonts,
} as any;

const handleRequest = frames(async (ctx) => {
  const sessionKey = ctx.searchParams.sessionKey || "";
  console.log("sessionKey", sessionKey);
  console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);
  console.log("ctx?.message?.inputText", ctx?.message?.inputText);
  const inputText = ctx?.message?.inputText;
  let responseText = "";
  let imageUrl = "";
  if (sessionKey) {
    const messages: any = [];
    const sessionData = await kv.get(sessionKey);
    if (!sessionData) {
      messages.push({ role: "system", content: originalPrompt });
    } else {
      messages.push(...(sessionData as any));
    }
    messages.push({ role: "user", content: inputText });
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    responseText = chatCompletion.choices[0]?.message?.content as string;
    console.log("responseText", responseText);
    const imageCompletion = await openai.images.generate({
      model: "dall-e-2",
      prompt: `pixel art, detailed senary, dark fantasy, rpg, ${responseText}`,
      size: "256x256",
      n: 1,
    });
    imageUrl = imageCompletion.data[0]?.url as string;
    console.log("imageUrl", imageUrl);
    messages.push({ role: "assistant", content: responseText });
    await kv.set(sessionKey, JSON.stringify(messages));
  }

  const isEnded = false;

  if (ctx.message?.transactionId) {
    return {
      image: (
        <div style={{ fontFamily: "Bitcell" }} tw="bg-black text-white w-full h-full justify-center items-center flex">
          Transaction submitted! {ctx.message.transactionId}
        </div>
      ),
      imageOptions: defaultImageOptions,
      buttons: [
        <Button action="link" target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}>
          View on block explorer
        </Button>,
      ],
    };
  }

  if (ctx.pressedButton && isEnded) {
    return {
      image: (
        <div style={{ fontFamily: "Bitcell" }} tw="bg-black text-white w-full h-full justify-center items-center">
          Generated
        </div>
      ),
      imageOptions: defaultImageOptions,
      buttons: [<Button action="post">Mint</Button>],
    };
  }

  if (ctx.pressedButton && !isEnded) {
    return {
      image: (
        <div
          style={{ fontFamily: "Bitcell", fontSize: 24, backgroundImage: `url(${imageUrl})` }}
          tw="flex flex-col bg-black text-white w-full h-full"
        >
          <p tw="p-2 bg-gray-800 bg-opacity-75">{responseText}</p>
        </div>
      ),
      imageOptions: { ...defaultImageOptions, width: "256", height: "256" },
      textInput: "What do you do?",
      buttons: [
        <Button action="post" target={{ query: { sessionKey } }}>
          Next
        </Button>,
        <Button action="post">End</Button>,
      ],
    };
  }

  const newSessionKey = crypto.randomUUID();
  console.log("newSessionKey", newSessionKey);

  return {
    image: (
      <div
        style={{ fontFamily: "Bitcell", fontSize: 120 }}
        tw={`flex bg-black text-white w-full h-full justify-center items-center`}
      >
        AI Quest
      </div>
    ),
    imageOptions: defaultImageOptions,
    buttons: [
      <Button action="post" target={{ query: { sessionKey: newSessionKey } }}>
        Start
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
