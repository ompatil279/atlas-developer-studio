# ATLAS Developer Studio

Act as a senior product designer and frontend engineer. Build the initial UI for ATLAS, a professional developer tool for understanding EVM contract interactions.

PRODUCT
ATLAS helps developers search for function signatures, decode calldata, and—when backend support exists—inspect event logs and transactions. Its core promise is: “Search. Decode. Investigate. Integrate.”

This is the initial Studio UI prototype for ETHGlobal Mumbai 2026. The backend, Arkiv integration, and REST API are not implemented yet. Build a polished, frontend-only application that can later be integrated into a larger TypeScript monorepo. Do not invent backend behavior or claim that a search, decode, RPC, Arkiv, or API request succeeded unless it actually did.

TECHNICAL APPROACH
- Use React and TypeScript with the project’s existing Lovable-compatible setup (Vite, React Router, Tailwind, Lucide icons, shadcn/ui).
- Keep pages, reusable components, styles, and API client code clearly separated.
- Keep domain logic out of UI components.
- Make the UI easy to export and integrate into another React application.
- Do not add a database, Supabase, authentication, wallet connection, server functions, or backend.
- Do not connect GitHub, publish, or deploy anything.

VISUAL DIRECTION & APPLE iOS/macOS HIG DESIGN SYSTEM
Create an Apple-inspired developer tool interface: editorial, precise, quiet, and highly usable. Reference Apple Human Interface Guidelines and modern Apple Developer tools (SF-inspired typography, subtle translucent navigation bars, crisp segmented controls, refined pill badges, Command Palette ⌘K, hairline borders).
Dark-first palette:
- Background: deep charcoal/navy `#0B0E12`
- Navigation/Header surface: `#11161D`
- Primary content surface: `#151B23`
- Elevated surface: `#1D2530`
- Subtle borders: `#29323D` or `border-white/[0.08]`
- Primary text: `#F3F5F7`, Secondary text: `#A0AAB7`, Muted text: `#778391`
- Accent: Electric blue / cyan `#70AEFF` (hover `#91C1FF`)
- Semantic colors for success, warning, error.
- Proportional sans-serif for UI, Monospace (JetBrains Mono / ui-monospace) for selectors, hashes, calldata, ABI signatures, JSON.

APP SHELL AND NAVIGATION
- Responsive shell with ATLAS wordmark and tagline: "Search. Decode. Investigate. Integrate."
- Navigation tabs / pill bar for all 7 routes: Workspace (`/`), Explorer (`/explorer`), Decoder (`/decode`), Events (`/events`), Transactions (`/transactions`), Docs (`/docs`), and Status (`/status`).
- Global Command Palette (`⌘K` / `Ctrl+K`) for fast switching between tools and actions.
- Keyboard-accessible controls, visible focus rings, responsive mobile navigation sheet.

SEVEN ROUTES TO IMPLEMENT
1. `/` — Workspace: Instant quick-action launchpad to Explorer and Decoder, architectural role explanation, system health indicator (plainly showing "Backend unconfigured"), and an optional clearly-labeled "Sample data — not live" preview switch for UI inspection.
2. `/explorer` — Signature Explorer: Labeled input for 4-byte selectors (e.g. `0xa9059cbb`) or signatures (e.g. `transfer(address,uint256)`), live hex validation, candidate list with provenance metadata (source, source ID, dataset version, import timestamp, record hash, entity key), clear ambiguity banners when multiple candidates match, and copy buttons with feedback.
3. `/decode` — Calldata Decoder: Multi-line calldata editor, hex validation, byte count & selector extractor, candidate selector outcomes, structured parameter breakdown (`arg0`, `arg1`, or ABI names), copy decoded result and copy JSON buttons, safe responsive wrapping.
4. `/events` — Event Inspector: Topic0, additional topics, and data hex inputs with add/remove topic controls; honest "Not available yet" explanation stating backend and Arkiv event decoding are pending.
5. `/transactions` — Transaction Lab: Transaction hash and network selector inputs; honest "Not available yet" state explaining that onchain execution tracing requires RPC integration.
6. `/docs` — Developer Hub: Professional documentation portal with internal sidebar covering Overview, Selectors vs Signatures, REST API contracts, TypeScript SDK, CLI guide, Provenance & Arkiv architecture, and copyable code snippets.
7. `/status` — Service Status: Honest operational diagnostics checking `VITE_ATLAS_API_URL` connectivity, displaying "Not configured" / "Offline" rather than fabricated uptime, with integration checklist.

TYPED API INTEGRATION BOUNDARY
- Typed API adapter (`src/api/atlasClient.ts`) reading `VITE_ATLAS_API_URL`.
- Contracts for `GET /v1/functions/:selector`, `GET /v1/functions?q=:query`, `POST /v1/decode/calldata`, and `GET /v1/health`.
- Data honesty: strict distinction between unconfigured API, network error, empty result, and candidate results. Isolated sample preview fixtures must be strictly labeled "Sample data — not live" and toggled off by default.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2616cc8e-9f40-4139-8e76-244a0227b4b4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
