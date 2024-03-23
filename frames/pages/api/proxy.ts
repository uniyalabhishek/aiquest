import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { base64url } = req.query as any;
  const buffer = Buffer.from(base64url, "base64url");
  res.setHeader("Content-Type", "video/mp4");
  res.status(200).send(buffer);
}
