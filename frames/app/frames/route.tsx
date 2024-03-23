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
  console.log(ctx);

  const action = ctx.searchParams.action || "";
  const sessionKey = ctx.searchParams.sessionKey || "";
  const index = Number(ctx.searchParams.index || 0);
  const inputText = ctx?.message?.inputText;
  if (sessionKey && action === "processAi") {
    fetch(new URL("/ai", process.env.NEXT_PUBLIC_HOST).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionKey, inputText }),
    });
  }

  let imageUrl = "";
  let responseText = "";
  if (sessionKey && action === "checkAI") {
    console.log(index);
    // const sessionData: any = await kv.get(sessionKey);
    // console.log(sessionData);
    // if (sessionData.imageUrls && sessionData.imageUrls.length == index) {
    //   imageUrl = sessionData.imageUrls[index - 1];
    //   responseText = sessionData.messages[index * 2].content;
    // }
  }

  // const isEnded = false;

  // if (ctx.message?.transactionId) {
  //   return {
  //     image: (
  //       <div style={{ fontFamily: "Bitcell" }} tw="bg-black text-white w-full h-full justify-center items-center flex">
  //         Transaction submitted! {ctx.message.transactionId}
  //       </div>
  //     ),
  //     imageOptions: defaultImageOptions,
  //     buttons: [
  //       <Button action="link" target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}>
  //         View on block explorer
  //       </Button>,
  //     ],
  //   };
  // }

  if (imageUrl && responseText) {
    return {
      image: (
        <div
          style={{ fontFamily: "Bitcell", fontSize: 24, backgroundImage: `url(${imageUrl})` }}
          tw="flex flex-col bg-black text-white w-full h-full"
        >
          <div tw="p-2 bg-gray-800 bg-opacity-75">{responseText}</div>
        </div>
      ),
      imageOptions: { ...defaultImageOptions, width: "256", height: "256" },
      textInput: "What do you do?",
      buttons: [
        <Button action="post" target={{ query: { sessionKey, action: "processAi", index: index + 1 } }}>
          Next
        </Button>,
        <Button action="post">End</Button>,
      ],
    };
  }

  if (sessionKey) {
    return {
      image: (
        <div
          style={{ fontFamily: "Bitcell", fontSize: 20, backgroundImage: `url(${"http:/localhost:3000/image.png"})` }}
          tw={`flex bg-black text-white w-full h-full justify-center items-center`}
        >
          <div tw="flex p-2 bg-gray-800 bg-opacity-75 w-full justify-center items-center">Processing...</div>
        </div>
      ),
      imageOptions: { ...defaultImageOptions, width: "256", height: "256" },
      buttons: [
        <Button action="post" target={{ query: { sessionKey: sessionKey, action: "checkAI", index } }}>
          Check status
        </Button>,
      ],
    };
  }

  const response = await fetch(new URL("/session", process.env.NEXT_PUBLIC_HOST).toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ time: new Date() }),
  });
  const { newSessionKey } = await response.json();
  console.log("newSessionKey", newSessionKey);

  return {
    image: (
      <div
        style={{ fontFamily: "Bitcell", fontSize: 40, backgroundImage: `url(${"http:/localhost:3000/image.png"})` }}
        tw={`flex bg-black text-white w-full h-full justify-center items-center`}
      >
        <div tw="flex p-2 bg-gray-800 bg-opacity-75 w-full justify-center items-center">AI Quest</div>
      </div>
    ),
    imageOptions: { ...defaultImageOptions, width: "256", height: "256" },
    buttons: [
      <Button action="post" target={{ query: { sessionKey: newSessionKey, action: "processAi", index: index + 1 } }}>
        Start
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
