import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CopyButton, PageHeader, Pill } from "@/components/atlas/primitives";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Developer Hub — ATLAS" },
      { name: "description", content: "ATLAS documentation: selectors, REST API contracts, TypeScript SDK, CLI and Arkiv provenance." },
      { property: "og:title", content: "Developer Hub — ATLAS" },
      { property: "og:description", content: "REST API, SDK, CLI and provenance architecture for ATLAS." },
    ],
  }),
  component: Docs,
});

function Code({ code, lang }: { code: string; lang: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-[11px] text-subtle">{lang}</span>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-muted-foreground"><code>{code}</code></pre>
    </div>
  );
}

const SECTIONS = [
  {
    id: "overview", title: "Overview",
    body: (
      <>
        <p>ATLAS resolves EVM function selectors to human-readable signatures, decodes calldata, and attaches provenance to every record so you know where a match came from.</p>
        <p className="mt-3"><Pill tone="warning">Prototype</Pill> <span className="ml-2">The REST API and SDK described here are contracts, not live services yet.</span></p>
      </>
    ),
  },
  {
    id: "selectors", title: "Selectors vs Signatures",
    body: (
      <>
        <p>A <strong>signature</strong> is the canonical function prototype, e.g. <code className="font-mono text-primary">transfer(address,uint256)</code>. Its <strong>selector</strong> is the first 4 bytes of the keccak-256 hash: <code className="font-mono text-primary">0xa9059cbb</code>.</p>
        <p className="mt-3">Because only 4 bytes are kept, distinct signatures can collide. ATLAS returns every candidate and flags ambiguity rather than guessing.</p>
      </>
    ),
  },
  {
    id: "rest", title: "REST API contracts",
    body: (
      <>
        <p>Base URL is configured via <code className="font-mono">VITE_ATLAS_API_URL</code>.</p>
        <Code lang="http" code={`GET  /v1/functions/:selector      → FunctionLookupResponse
GET  /v1/functions?q=:query       → FunctionLookupResponse
POST /v1/decode/calldata          → DecodeCalldataResponse
GET  /v1/health                   → HealthResponse`} />
        <Code lang="json" code={`{
  "query": "0xa9059cbb",
  "candidates": [{
    "selector": "0xa9059cbb",
    "signature": "transfer(address,uint256)",
    "name": "transfer",
    "inputs": [{ "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }],
    "provenance": {
      "source": "sourcify", "sourceId": "…", "datasetVersion": "…",
      "importedAt": "…", "recordHash": "0x…", "entityKey": "0x…"
    }
  }]
}`} />
      </>
    ),
  },
  {
    id: "sdk", title: "TypeScript SDK",
    body: <Code lang="ts" code={`import { atlasClient } from "./api/atlasClient";

const res = await atlasClient.getFunctionBySelector("0xa9059cbb");
switch (res.kind) {
  case "ok":           console.log(res.data.candidates); break;
  case "empty":        console.log("no match"); break;
  case "unconfigured": console.log("set VITE_ATLAS_API_URL"); break;
  default:             console.error(res);
}`} />,
  },
  {
    id: "cli", title: "CLI guide",
    body: <>
      <p>Planned CLI interface:</p>
      <Code lang="bash" code={`atlas lookup 0xa9059cbb
atlas search "transfer(address,uint256)"
atlas decode 0xa9059cbb000000…`} />
    </>,
  },
  {
    id: "provenance", title: "Provenance & Arkiv",
    body: (
      <>
        <p>Every candidate carries a provenance record: the upstream <em>source</em> and its <em>source ID</em>, the <em>dataset version</em> it was imported in, an <em>import timestamp</em>, a <em>record hash</em> of the normalized entry, and the Arkiv <em>entity key</em> under which it is stored.</p>
        <Code lang="text" code={`upstream source ─▶ importer ─▶ normalize + hash ─▶ Arkiv entity
                                               │
                                     ATLAS API ◀┘ ─▶ Studio / SDK / CLI`} />
      </>
    ),
  },
];

function Docs() {
  const [active, setActive] = useState(SECTIONS[0].id);
  return (
    <>
      <PageHeader eyebrow="Integrate" title="Developer Hub" description="Concepts, contracts and tooling for building on ATLAS." />
      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <nav aria-label="Docs" className="md:sticky md:top-24 md:self-start">
          <ul className="flex gap-1 overflow-x-auto md:flex-col">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setActive(s.id)}
                  className={cn("block whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground", active === s.id && "bg-elevated text-foreground")}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <article className="min-w-0 space-y-12 text-[15px] leading-relaxed text-muted-foreground">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="mb-3 text-xl font-semibold text-foreground">{s.title}</h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
