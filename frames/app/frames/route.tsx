/* eslint-disable react/jsx-key */
import fs from "fs";
import path from "path";
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";
import { kv } from "@vercel/kv";
import OpenAI from "openai";

const frames = createFrames({
  basePath: "/frames",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const bitcell = fs.readFileSync(path.join(process.cwd(), "/public/bitcell_memesbruh03.ttf"));
const fonts = [
  {
    name: "Bitcell",
    data: bitcell,
    weight: 400,
    style: "normal",
  },
];
const aspectRatio = "1.91:1";
const imageOptions = {
  aspectRatio,
  fonts,
} as any;

// const vt323 = VT323({ subsets: ["latin"], weight: "400" });
// className={vt323.className}
const handleRequest = frames(async (ctx) => {
  const sessionKey = ctx.searchParams.sessionKey || "";
  console.log("sessionKey", sessionKey);
  console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);
  console.log("ctx?.message?.inputText", ctx?.message?.inputText);
  let text = "";
  if (sessionKey) {
    await kv.set(sessionKey, "test");
    const sessionData = await kv.get("test");
    console.log("sessionData", sessionData);
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });
    text = chatCompletion.choices[0]?.message?.content as string;
  }

  const isEnded = false;
  const isGenerated = false;

  if (ctx.message?.transactionId) {
    return {
      image: (
        <div
          style={{ fontFamily: "Bitcell" }}
          tw="bg-purple-800 text-white w-full h-full justify-center items-center flex"
        >
          Transaction submitted! {ctx.message.transactionId}
        </div>
      ),
      imageOptions,
      buttons: [
        <Button action="link" target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}>
          View on block explorer
        </Button>,
      ],
    };
  }

  if (ctx.pressedButton && isEnded && isGenerated) {
    return {
      image: (
        <div style={{ fontFamily: "Bitcell" }} tw="bg-purple-800 text-white w-full h-full justify-center items-center">
          Generated
        </div>
      ),
      imageOptions,
      buttons: [<Button action="post">Mint</Button>],
    };
  }

  if (ctx.pressedButton && isEnded && !isGenerated) {
    return {
      image: (
        <div style={{ fontFamily: "Bitcell" }} tw="bg-purple-800 text-white w-full h-full justify-center items-center">
          Ended
        </div>
      ),
      imageOptions,
      buttons: [<Button action="post">Generate</Button>],
    };
  }

  if (ctx.pressedButton && !isEnded) {
    return {
      image: (
        <div style={{ fontFamily: "Bitcell" }} tw="bg-purple-800 text-white w-full h-full justify-center items-center">
          {text}
        </div>
      ),
      imageOptions,
      textInput: "What do you do?",
      buttons: [<Button action="post">Next</Button>],
    };
  }

  const newSessionKey = "sessionKey";

  return {
    image: (
      <div style={{ fontFamily: "Bitcell" }} tw={`bg-gray-600 text-white w-full h-full justify-center items-center`}>
        AI Quest 2
      </div>
    ),
    imageOptions,
    buttons: [
      <Button action="post" target={{ query: { sessionKey: newSessionKey } }}>
        Start
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
