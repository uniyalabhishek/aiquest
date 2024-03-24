/* eslint-disable react/jsx-key */
import fs from "fs";
import path from "path";
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";
import { kv } from "@vercel/kv";

import { openframes } from "frames.js/middleware";
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp";

const frames = createFrames({
  basePath: "/frames",
  middleware: [
    openframes({
      clientProtocol: {
        id: "xmtp",
        version: "2024-02-09",
      },
      handler: {
        isValidPayload: (body: JSON) => isXmtpFrameActionPayload(body),
        getFrameMessage: async (body: JSON) => {
          if (!isXmtpFrameActionPayload(body)) {
            return undefined;
          }
          const result = await getXmtpFrameMessage(body);
          return { ...result };
        },
      },
    }),
  ],
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
  width: "256",
  height: "256",
  aspectRatio: defaultAspectRatio,
  fonts: defaultFonts,
} as any;
const defaultHeaders = {
  "Cache-Control": "max-age=0",
};

const handleRequest = frames(async (ctx) => {
  const requesterFid = ctx?.message?.requesterFid;
  const action = ctx.searchParams.action || "";
  let sessionKey = ctx.searchParams.sessionKey || "";
  if (!sessionKey && action == "start") {
    const newSessionKey = crypto.randomUUID();
    console.log("newSessionKey", newSessionKey);
    sessionKey = newSessionKey;
  }
  const index = Number(ctx.searchParams.index || 0);
  const inputText = ctx?.message?.inputText;

  if (action == "start" || action === "processAI") {
    const ctxRequest = await ctx.request.clone().json();
    fetch(new URL("/api/ai", process.env.NEXT_PUBLIC_HOST).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requesterFid, sessionKey, inputText, ctxRequest }),
    });
  }

  let imageUrl = "";
  let responseText = "";
  if (action === "checkAI") {
    const sessionData: any = await kv.get(sessionKey);
    if (sessionData && sessionData.imageUrls && sessionData.imageUrls.length == index) {
      imageUrl = sessionData.imageUrls[index - 1];
      responseText = sessionData.messages[index * 2].content;
    }
  }

  if (action === "processVideo") {
    fetch(new URL("/api/video", process.env.NEXT_PUBLIC_HOST).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionKey }),
    });
  }

  let videoUrl = "";
  if (action === "checkVideo") {
    const sessionData: any = await kv.get(sessionKey);
    if (sessionData && sessionData.videoUrl) {
      videoUrl = sessionData.videoUrl;
    }
  }

  if (ctx.message?.transactionId) {
    return {
      image: (
        <div
          style={{
            fontFamily: "Bitcell",
            fontSize: 20,
            backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/image.png)`,
          }}
          tw={`flex bg-black text-white w-full h-full justify-center items-center`}
        >
          <div tw="flex p-2 bg-gray-800 bg-opacity-75 w-full justify-center items-center">Transaction submitted!</div>
        </div>
      ),
      imageOptions: defaultImageOptions,
      buttons: [
        <Button action="link" target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}>
          View on block explorer
        </Button>,
      ],
      headers: defaultHeaders,
    };
  }

  if (videoUrl) {
    return {
      image: (
        <div
          style={{
            fontFamily: "Bitcell",
            fontSize: 20,
            backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/image.png)`,
          }}
          tw={`flex bg-black text-white w-full h-full justify-center items-center`}
        >
          <div tw="flex p-2 bg-gray-800 bg-opacity-75 w-full justify-center items-center">Video created</div>
        </div>
      ),
      imageOptions: defaultImageOptions,
      buttons: [
        <Button action="tx" target={{ pathname: "../txdata", query: { sessionKey } }} post_url="/">
          Mint NFT
        </Button>,
      ],
      headers: defaultHeaders,
    };
  }

  if (action == "processVideo" || action == "checkVideo") {
    return {
      image: (
        <div
          style={{
            fontFamily: "Bitcell",
            fontSize: 20,
            backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/image.png)`,
          }}
          tw={`flex bg-black text-white w-full h-full justify-center items-center`}
        >
          <div tw="flex p-2 bg-gray-800 bg-opacity-75 w-full justify-center items-center">Processing...</div>
        </div>
      ),
      imageOptions: defaultImageOptions,
      buttons: [
        <Button action="post" target={{ query: { sessionKey, action: "checkVideo" } }}>
          Check status
        </Button>,
      ],
      headers: defaultHeaders,
    };
  }

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
      imageOptions: defaultImageOptions,
      textInput: "What do you do?",
      buttons: [
        <Button action="post" target={{ query: { sessionKey, action: "processVideo" } }}>
          End
        </Button>,
        <Button action="post" target={{ query: { sessionKey, action: "processAI", index: index + 1 } }}>
          Next
        </Button>,
      ],
      headers: defaultHeaders,
    };
  }

  if (action == "start" || action == "processAI" || action == "checkAI") {
    return {
      image: (
        <div
          style={{
            fontFamily: "Bitcell",
            fontSize: 20,
            backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/image.png)`,
          }}
          tw={`flex bg-black text-white w-full h-full justify-center items-center`}
        >
          <div tw="flex p-2 bg-gray-800 bg-opacity-75 w-full justify-center items-center">Processing...</div>
        </div>
      ),
      imageOptions: defaultImageOptions,
      buttons: [
        <Button action="post" target={{ query: { sessionKey, action: "checkAI", index } }}>
          Check status
        </Button>,
      ],
      headers: defaultHeaders,
    };
  }

  return {
    image: (
      <div
        style={{
          fontFamily: "Bitcell",
          fontSize: 40,
          backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/image.png)`,
        }}
        tw={`flex bg-black text-white w-full h-full justify-center items-center`}
      >
        {/* <div tw="flex p-2 bg-gray-800 bg-opacity-75 w-full justify-center items-center">AI Quest</div> */}
        <div tw="flex p-2 bg-gray-800 bg-opacity-75 w-full justify-center items-center">AI Quest</div>
      </div>
    ),
    imageOptions: defaultImageOptions,
    buttons: [
      <Button action="post" target={{ query: { action: "start", index: 1 } }}>
        Start
      </Button>,
    ],
    headers: defaultHeaders,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
