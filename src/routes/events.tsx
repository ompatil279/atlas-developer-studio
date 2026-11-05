import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { isHex } from "@/lib/atlas/hex";
import { PageHeader, Panel, Pill } from "@/components/atlas/primitives";
import { NotAvailable } from "@/components/atlas/NotAvailable";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Event Inspector — ATLAS" },
      { name: "description", content: "Inspect EVM event log topics and data. Decoding pending backend support." },
      { property: "og:title", content: "Event Inspector — ATLAS" },
      { property: "og:description", content: "Prepare event log topics and data for decoding with ATLAS." },
    ],
  }),
  component: Events,
});

const field = "h-10 w-full rounded-lg border border-input bg-background px-3 font-mono text-[13px] outline-none placeholder:text-subtle focus:border-primary";

function Validity({ v, bytes }: { v: string; bytes?: number }) {
  if (!v.trim()) return null;
  return isHex(v, bytes) ? <Pill tone="success">valid</Pill> : <Pill tone="warning">{bytes ? `expects ${bytes} bytes hex` : "invalid hex"}</Pill>;
}

function Events() {
  const [topic0, setTopic0] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [data, setData] = useState("");

  return (
    <>
      <PageHeader eyebrow="Investigate" title="Event Inspector" description="Compose a log's topics and data payload. Inputs are validated locally." />
      <div className="grid gap-6 lg:grid-cols-5">
        <Panel className="space-y-5 lg:col-span-3">
          <div>
            <div className="mb-1.5 flex items-center justify-between"><label htmlFor="t0" className="text-sm font-medium">Topic 0 <span className="text-subtle">(event signature hash)</span></label><Validity v={topic0} bytes={32} /></div>
            <input id="t0" className={field} value={topic0} onChange={(e) => setTopic0(e.target.value)} placeholder="0xddf252ad…" spellCheck={false} />
          </div>
          {topics.map((t, i) => (
            <div key={i}>
              <div className="mb-1.5 flex items-center justify-between"><label htmlFor={`t${i + 1}`} className="text-sm font-medium">Topic {i + 1}</label><Validity v={t} bytes={32} /></div>
              <div className="flex gap-2">
                <input id={`t${i + 1}`} className={field} value={t} spellCheck={false} placeholder="0x…" onChange={(e) => setTopics(topics.map((x, j) => (j === i ? e.target.value : x)))} />
                <Button variant="outline" size="icon" aria-label={`Remove topic ${i + 1}`} onClick={() => setTopics(topics.filter((_, j) => j !== i))}><X className="size-4" /></Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" disabled={topics.length >= 3} onClick={() => setTopics([...topics, ""])}><Plus className="size-4" /> Add topic</Button>
          <div>
            <div className="mb-1.5 flex items-center justify-between"><label htmlFor="data" className="text-sm font-medium">Data</label><Validity v={data} /></div>
            <textarea id="data" rows={5} value={data} onChange={(e) => setData(e.target.value)} spellCheck={false} placeholder="0x…" className="w-full break-all rounded-lg border border-input bg-background p-3 font-mono text-[13px] outline-none placeholder:text-subtle focus:border-primary" />
          </div>
          <Button disabled className="rounded-xl">Decode event</Button>
        </Panel>
        <div className="lg:col-span-2">
          <NotAvailable title="Event decoding" requirements={["ATLAS backend with /v1/decode/event", "Arkiv-indexed event signature dataset", "Provenance records for event ABIs"]}>
            Event decoding is pending the ATLAS backend and Arkiv event-signature integration. No request is sent from this page.
          </NotAvailable>
        </div>
      </div>
    </>
  );
}
