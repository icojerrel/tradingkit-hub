# TradingKit Hub

Companion onboarding app for the [TradingKit.com](https://tradingkit.com/) AI trading stack by DaviddTech.

## Features

- **Products** — quick links to Trader.dev, PropFirm AI, Strategy Factory, and AI Trading Arena
- **MCP Setup** — Trader Dev SSE endpoint and install steps for Cursor, Claude Code, Codex, and other MCP clients
- **Prompts** — copy-paste research prompts from the [ai-trading-agent](https://github.com/DaviddTech/ai-trading-agent) workflow

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:4173

## Deploy (Vercel)

Production: https://tradingkit-hub-beate-maries-projects.vercel.app

The app is a Vite SPA with a serverless `/api/mcp-status` route. If the deployment is behind Vercel Authentication, disable Deployment Protection for production in the Vercel project settings or access it while logged into the Vercel team.

```bash
npm run build
npx vercel --prod
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 4173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Stack

- Vite 6
- React 19
- TypeScript

## Disclaimer

For research and education only. Backtests are not guarantees of future performance. See the [ai-trading-agent disclaimer](https://github.com/DaviddTech/ai-trading-agent/blob/main/docs/DISCLAIMER.md).

## License

MIT
