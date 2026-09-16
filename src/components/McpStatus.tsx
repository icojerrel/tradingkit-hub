import { useCallback, useEffect, useState } from "react";
import { mcpEndpoint } from "../data/mcpSetup";

type McpStatusPayload = {
  status: "online" | "degraded" | "offline" | "checking";
  endpoint: string;
  latencyMs?: number;
  checkedAt?: string;
  httpStatus?: number;
  hint?: string;
  error?: string;
};

const initialState: McpStatusPayload = {
  status: "checking",
  endpoint: mcpEndpoint,
};

export function McpStatus() {
  const [data, setData] = useState<McpStatusPayload>(initialState);

  const checkStatus = useCallback(async () => {
    setData((prev) => ({ ...prev, status: "checking" }));
    try {
      const response = await fetch("/api/mcp-status");
      const payload = (await response.json()) as Omit<McpStatusPayload, "status"> & {
        status: "online" | "degraded" | "offline";
      };
      setData({ ...payload, status: payload.status });
    } catch {
      setData({
        status: "offline",
        endpoint: mcpEndpoint,
        hint: "Status check failed from this browser session.",
        error: "Network error while calling /api/mcp-status",
        checkedAt: new Date().toISOString(),
      });
    }
  }, []);

  useEffect(() => {
    void checkStatus();
  }, [checkStatus]);

  const label =
    data.status === "checking"
      ? "Checking MCP…"
      : data.status === "online"
        ? "Trader Dev MCP online"
        : data.status === "degraded"
          ? "Trader Dev MCP degraded"
          : "Trader Dev MCP offline";

  return (
    <article className={`mcp-status mcp-status-${data.status}`}>
      <div className="mcp-status-row">
        <span className="mcp-status-dot" aria-hidden />
        <div>
          <div className="mcp-status-label">{label}</div>
          <div className="mcp-status-meta">
            {data.latencyMs != null && <span>{data.latencyMs} ms</span>}
            {data.httpStatus != null && <span>HTTP {data.httpStatus}</span>}
            {data.checkedAt && (
              <span>{new Date(data.checkedAt).toLocaleTimeString()}</span>
            )}
          </div>
        </div>
        <button type="button" className="mcp-status-refresh" onClick={() => void checkStatus()}>
          {data.status === "checking" ? "…" : "Recheck"}
        </button>
      </div>
      {(data.hint || data.error) && (
        <p className="mcp-status-hint">{data.hint ?? data.error}</p>
      )}
    </article>
  );
}
