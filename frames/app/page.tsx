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
  return <div>Home</div>;
}
