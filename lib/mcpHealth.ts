export type McpHealthResult = {
  status: "online" | "degraded" | "offline";
  endpoint: string;
  httpStatus?: number;
  latencyMs: number;
  checkedAt: string;
  hint?: string;
  error?: string;
};

const MCP_ENDPOINT = "https://mcp.trader.dev/sse";
const TIMEOUT_MS = 8000;

export async function checkMcpHealth(): Promise<McpHealthResult> {
  const started = Date.now();
  const checkedAt = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(MCP_ENDPOINT, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "text/event-stream",
        "User-Agent": "TradingKit-Hub/1.0",
      },
    });

    const reader = response.body?.getReader();
    let preview = "";

    if (reader) {
      const { value } = await reader.read();
      preview = value ? new TextDecoder().decode(value) : "";
      await reader.cancel();
    }

    clearTimeout(timeout);

    const latencyMs = Date.now() - started;
    const sseReady =
      preview.includes("event:") ||
      preview.includes("data:") ||
      response.status === 200;

    return {
      status: sseReady ? "online" : "degraded",
      endpoint: MCP_ENDPOINT,
      httpStatus: response.status,
      latencyMs,
      checkedAt,
      hint: sseReady
        ? "Trader Dev MCP is accepting SSE connections."
        : "Endpoint responded but SSE handshake looked incomplete.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      status: "offline",
      endpoint: MCP_ENDPOINT,
      latencyMs: Date.now() - started,
      checkedAt,
      error: message,
      hint: "Could not reach Trader Dev MCP. Try again or check trader.dev status.",
    };
  }
}
