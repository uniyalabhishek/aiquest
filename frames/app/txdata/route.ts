import { kv } from "@vercel/kv";
import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import { aiQuestNFTAbi } from "./contracts/ai-quest-nft";

import { NFTStorage, Blob } from "nft.storage";
const client = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN || "" });

const { URL } = require("url");

const AIQuestNFTAddress = "0x73e5d195b5cf7eb46de86901ad941986e74921ca";

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  const url = new URL(req.url);
  const sessionKey = url.searchParams.get("sessionKey");
  const sessionData: any = await kv.get(sessionKey);

  const description = sessionData.messages
    .filter(({ role }: any) => role === "assistant")
    .map(({ content }: any) => content)
    .join(" ");

  const metadata = {
    name: "AI Quest NFT",
    description: description,
    image: `${process.env.NEXT_PUBLIC_HOST}/thumbnail.png`,
    animation: sessionData.videoUrl,
  };

  console.log(metadata);

  const json = Buffer.from(JSON.stringify(metadata));
  const blob = new Blob([json], { type: "application/json" });
  const cid = await client.storeBlob(blob);

  const calldata = encodeFunctionData({
    abi: aiQuestNFTAbi,
    functionName: "safeMint",
    args: [`ipfs://${cid}`],
  });

  return NextResponse.json({
    chainId: "eip155:84532",
    method: "eth_sendTransaction",
    params: {
      abi: aiQuestNFTAbi as Abi,
      to: AIQuestNFTAddress,
      data: calldata,
      value: "0",
    },
  });
}
