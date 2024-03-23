import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import { aiQuestNFTAbi } from "./contracts/ai-quest-nft";

const { URL } = require("url");

const AIQuestNFTAddress = "0x73e5d195b5cf7eb46de86901ad941986e74921ca";

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  const url = new URL(req.url);
  console.log("videoUrl:", url.searchParams.get("videoUrl"));
  // const json = await req.json();

  // const frameMessage = await getFrameMessage(json);

  // if (!frameMessage) {
  //   throw new Error("No frame message");
  // }

  const calldata = encodeFunctionData({
    abi: aiQuestNFTAbi,
    functionName: "safeMint",
    args: [""],
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
