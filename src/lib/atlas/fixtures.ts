/**
 * SAMPLE DATA — NOT LIVE. Isolated fixtures for UI inspection only.
 * Only used when the user explicitly enables the sample preview switch.
 */
import type { DecodeCalldataResponse, FunctionCandidate, FunctionLookupResponse } from "@/api/types";

const prov = (source: string, sourceId: string, n: string) => ({
  source,
  sourceId,
  datasetVersion: "sample-2026.11",
  importedAt: "2026-11-01T09:00:00.000Z",
  recordHash: `0xsample${n.padEnd(58, "0")}`,
  entityKey: `0xsamplekey${n.padEnd(55, "0")}`,
});

const SAMPLE: FunctionCandidate[] = [
  {
    selector: "0xa9059cbb",
    signature: "transfer(address,uint256)",
    name: "transfer",
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    provenance: prov("sample:sourcify", "sample-1", "1"),
  },
  {
    selector: "0xa9059cbb",
    signature: "many_msg_babbage(bytes1)",
    name: "many_msg_babbage",
    inputs: [{ type: "bytes1" }],
    provenance: prov("sample:4byte", "sample-2", "2"),
  },
  {
    selector: "0x095ea7b3",
    signature: "approve(address,uint256)",
    name: "approve",
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    provenance: prov("sample:sourcify", "sample-3", "3"),
  },
];

export function sampleLookup(query: string): FunctionLookupResponse {
  const q = query.toLowerCase();
  return {
    query,
    candidates: SAMPLE.filter((c) => c.selector === q || c.signature.toLowerCase().includes(q) || c.name.includes(q)),
  };
}

export function sampleDecode(selector: string, words: string[]): DecodeCalldataResponse {
  const outcomes = SAMPLE.filter((c) => c.selector === selector).map((candidate) => ({
    candidate,
    params: candidate.inputs.map((inp, i) => ({
      name: inp.name ?? `arg${i}`,
      type: inp.type,
      value: words[i] ? "0x" + words[i] : "(missing word)",
    })),
  }));
  return { selector, outcomes };
}
