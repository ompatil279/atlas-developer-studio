import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { isHex } from "@/lib/atlas/hex";
import { PageHeader, Panel, Pill } from "@/components/atlas/primitives";
import { NotAvailable } from "@/components/atlas/NotAvailable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transaction Lab — ATLAS" },
      { name: "description", content: "Trace EVM transactions by hash. Execution tracing requires RPC integration." },
      { property: "og:title", content: "Transaction Lab — ATLAS" },
      { property: "og:description", content: "Prepare transaction lookups for tracing with ATLAS." },
    ],
  }),
  component: Transactions,
});

const NETWORKS = ["Ethereum Mainnet", "Base", "Arbitrum One", "Optimism", "Polygon PoS", "Sepolia"];

function Transactions() {
  const [hash, setHash] = useState("");
  const [net, setNet] = useState<string>("Ethereum Mainnet");
  return (
    <>
      <PageHeader eyebrow="Investigate" title="Transaction Lab" description="Look up a transaction by hash and trace its calls once RPC support lands." />
      <div className="grid gap-6 lg:grid-cols-5">
        <Panel className="space-y-5 lg:col-span-3">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="tx" className="text-sm font-medium">Transaction hash</label>
              {hash.trim() && (isHex(hash, 32) ? <Pill tone="success">valid</Pill> : <Pill tone="warning">expects 32 bytes hex</Pill>)}
            </div>
            <input id="tx" value={hash} onChange={(e) => setHash(e.target.value)} spellCheck={false} placeholder="0x…" className="h-10 w-full rounded-lg border border-input bg-background px-3 font-mono text-[13px] outline-none placeholder:text-subtle focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Network</label>
            <Select value={net} onValueChange={setNet}>
              <SelectTrigger className="h-10 rounded-lg bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>{NETWORKS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button disabled className="rounded-xl">Trace transaction</Button>
        </Panel>
        <div className="lg:col-span-2">
          <NotAvailable title="Execution tracing" requirements={["RPC provider per network (debug_traceTransaction)", "ATLAS backend trace endpoint", "Calldata decoding for each internal call"]}>
            Onchain execution tracing requires RPC integration that isn't connected yet. No request is sent from this page.
          </NotAvailable>
        </div>
      </div>
    </>
  );
}
