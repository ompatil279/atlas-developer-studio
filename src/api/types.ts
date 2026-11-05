/** ATLAS REST contracts (v1). Shared shape between Studio and the future backend. */

export interface Provenance {
  source: string; // e.g. "4byte.directory", "sourcify", "etherscan-verified"
  sourceId: string;
  datasetVersion: string;
  importedAt: string; // ISO timestamp
  recordHash: string;
  entityKey: string; // Arkiv entity key
}

export interface FunctionCandidate {
  selector: string; // 0x + 8 hex
  signature: string; // transfer(address,uint256)
  name: string;
  inputs: { name?: string; type: string }[];
  provenance: Provenance;
}

/** GET /v1/functions/:selector  and  GET /v1/functions?q=:query */
export interface FunctionLookupResponse {
  query: string;
  candidates: FunctionCandidate[];
}

/** POST /v1/decode/calldata */
export interface DecodeCalldataRequest {
  calldata: string;
}
export interface DecodedParam {
  name: string; // ABI name or argN
  type: string;
  value: string;
}
export interface DecodeOutcome {
  candidate: FunctionCandidate;
  params: DecodedParam[];
}
export interface DecodeCalldataResponse {
  selector: string;
  outcomes: DecodeOutcome[];
}

/** GET /v1/health */
export interface HealthResponse {
  status: "ok" | "degraded";
  version: string;
  arkiv?: { connected: boolean };
}

/** Every request resolves to one of these — never a fabricated success. */
export type ApiResult<T> =
  | { kind: "unconfigured" }
  | { kind: "network-error"; message: string }
  | { kind: "http-error"; status: number; message: string }
  | { kind: "empty" }
  | { kind: "ok"; data: T; sample?: boolean };
