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
        <div className="text-center w-full max-w-2xl px-4 py-48">
          <img src="./thumbnail.png" className="h-80 mx-auto mb-4" />
          <p className="text-white font-bold text-2xl mb-8">
            AI Quest is a text-based RPG game built on the Farcaster framework. The adventure varies depending on both
            on-chain and Farcaster activity.
          </p>
        </div>
        <div className="text-center w-full max-w-6xl px-4">
          <p className="text-white text-4xl mb-8">Available on Warpcast</p>
          <img src="./screenshot-1.png" className="w-full mx-auto mb-8" alt="Large Screenshot" />
          <a
            href="https://warpcast.com/taijusanagi/0xdd4f8bef"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 text-white w-80 font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-300 ease-in-out text-lg"
          >
            Play AI Quest Now
          </a>
        </div>
      </div>
    </main>
  );
}
