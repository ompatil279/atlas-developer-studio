import type {
  ApiResult,
  DecodeCalldataResponse,
  FunctionLookupResponse,
  HealthResponse,
} from "./types";

/** Base URL from VITE_ATLAS_API_URL. Undefined = unconfigured (no requests are made). */
export function getApiBaseUrl(): string | undefined {
  const raw = (import.meta.env.VITE_ATLAS_API_URL as string | undefined)?.trim();
  return raw ? raw.replace(/\/+$/, "") : undefined;
}

async function request<T>(
  path: string,
  init?: RequestInit,
  isEmpty?: (d: T) => boolean,
): Promise<ApiResult<T>> {
  const base = getApiBaseUrl();
  if (!base) return { kind: "unconfigured" };
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      ...init,
      headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
      signal: init?.signal ?? AbortSignal.timeout(8000),
    });
  } catch (e) {
    return { kind: "network-error", message: e instanceof Error ? e.message : "Request failed" };
  }
  if (res.status === 404) return { kind: "empty" };
  if (!res.ok) return { kind: "http-error", status: res.status, message: res.statusText || "Request failed" };
  try {
    const data = (await res.json()) as T;
    if (isEmpty?.(data)) return { kind: "empty" };
    return { kind: "ok", data };
  } catch {
    return { kind: "http-error", status: res.status, message: "Invalid JSON response" };
  }
}

export const atlasClient = {
  getFunctionBySelector: (selector: string) =>
    request<FunctionLookupResponse>(
      `/v1/functions/${encodeURIComponent(selector)}`,
      undefined,
      (d) => !d.candidates?.length,
    ),
  searchFunctions: (q: string) =>
    request<FunctionLookupResponse>(
      `/v1/functions?q=${encodeURIComponent(q)}`,
      undefined,
      (d) => !d.candidates?.length,
    ),
  decodeCalldata: (calldata: string) =>
    request<DecodeCalldataResponse>(
      `/v1/decode/calldata`,
      { method: "POST", body: JSON.stringify({ calldata }) },
      (d) => !d.outcomes?.length,
    ),
  health: () => request<HealthResponse>(`/v1/health`),
};
