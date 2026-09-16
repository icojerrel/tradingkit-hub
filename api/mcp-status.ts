import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkMcpHealth } from "../lib/mcpHealth";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const result = await checkMcpHealth();
  const cacheSeconds = result.status === "online" ? 30 : 15;

  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${cacheSeconds}, stale-while-revalidate=60`,
  );
  return res.status(200).json(result);
}
