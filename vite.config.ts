import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { checkMcpHealth } from "./lib/mcpHealth";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "dev-mcp-status-api",
      configureServer(server) {
        server.middlewares.use("/api/mcp-status", async (_req, res) => {
          const result = await checkMcpHealth();
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result));
        });
      },
    },
  ],
  server: {
    port: 4173,
    host: true,
  },
});
