import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Quest",
  description:
    "AI Quest is a text-based RPG game crafted using the innovative Farcaster framework. Immerse yourself in a unique gaming experience where every adventure is different and dictated by your choices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
