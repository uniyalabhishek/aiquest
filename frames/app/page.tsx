import { vercelURL } from "./utils";
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Quest",
    description:
      "AI Quest is a text-based RPG game built on the Farcaster framework. The adventure varies depending on both on-chain and Farcaster activity.",
    other: {
      ...(await fetchMetadata(new URL("/frames", vercelURL() || "http://localhost:3000"))),
    },
  };
}

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="flex flex-col justify-center items-center pt-4 pb-12 px-4">
        <div className="fixed inset-y-20 flex justify-center items-center">
          <div className="text-center w-full max-w-2xl px-4">
            <img src="./thumbnail.png" className="h-80 mx-auto mb-4" />
            <p className="text-white font-bold text-xl mb-8">
              AI Quest is a text-based RPG game built on the Farcaster framework. The adventure varies depending on both
              on-chain and Farcaster activity.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
