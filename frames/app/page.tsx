import Link from "next/link";
import { currentURL, vercelURL } from "./utils";
import { createDebugUrl } from "./debug";
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Quest",
    description:
      "AI Quest is a text-based RPG game crafted using the innovative Farcaster framework. Immerse yourself in a unique gaming experience where every adventure is different and dictated by your choices.",
    other: {
      ...(await fetchMetadata(new URL("/frames", vercelURL() || "http://localhost:3000"))),
    },
  };
}

export default async function Home() {
  const url = currentURL("/");

  return (
    <div>
      Rent farcaster storage example{" "}
      <Link href={createDebugUrl(url)} className="underline">
        Debug
      </Link>
    </div>
  );
}
