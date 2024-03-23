/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";
import { kv } from "@vercel/kv";

const totalPages = 5;

const frames = createFrames({
  basePath: "/frames",
});

const handleRequest = frames(async (ctx) => {
  const action = ctx.searchParams.action;
  console.log(process.env.OPENAI_API_KEY);
  console.log(ctx?.message?.inputText);

  const key = ctx.searchParams.pageIndex ? ctx.searchParams.pageIndex : "mock-session-key";
  console.log(ctx);

  await kv.set("test", "test");
  const session = await kv.get("test");
  console.log(session);

  // if (ctx.message?.transactionId) {
  //   return {
  //     image: (
  //       <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
  //         Transaction submitted! {ctx.message.transactionId}
  //       </div>
  //     ),
  //     imageOptions: {
  //       aspectRatio: "1:1",
  //     },
  //     buttons: [
  //       <Button action="link" target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}>
  //         View on block explorer
  //       </Button>,
  //     ],
  //   };
  // }
  const isEnded = false;
  const isGenerated = false;

  if (ctx.message?.transactionId) {
    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          Transaction submitted! {ctx.message.transactionId}
        </div>
      ),
      imageOptions: {
        aspectRatio: "1.91:1",
      },
      buttons: [
        <Button action="link" target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}>
          View on block explorer
        </Button>,
      ],
    };
  }

  if (ctx.pressedButton && isEnded && isGenerated) {
    return {
      image: <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">Generated</div>,
      imageOptions: {
        aspectRatio: "1.91:1",
      },
      buttons: [<Button action="post">Mint</Button>],
    };
  }

  if (ctx.pressedButton && isEnded && !isGenerated) {
    return {
      image: <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">Ended</div>,
      imageOptions: {
        aspectRatio: "1.91:1",
      },
      buttons: [<Button action="post">Generate</Button>],
    };
  }

  if (ctx.pressedButton && !isEnded) {
    return {
      image: <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">Ongoing</div>,
      imageOptions: {
        aspectRatio: "1.91:1",
      },
      textInput: "What do you do?",
      buttons: [<Button action="post">Next</Button>],
    };
  }

  if (!ctx.pressedButton) {
    return {
      image: <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">AI Quest</div>,
      imageOptions: {
        aspectRatio: "1.91:1",
      },
      buttons: [<Button action="post">Start</Button>],
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
