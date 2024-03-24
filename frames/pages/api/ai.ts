import type { NextApiRequest, NextApiResponse } from "next";

import defer from "../../lib/defer/ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await defer(req, res);
  res.status(200).json(data);
}
