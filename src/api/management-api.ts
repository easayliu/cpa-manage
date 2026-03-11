// Auto-generated from Go management API handlers
// Source: internal/api/server.go → registerManagementRoutes()
// CLIProxyAPI version: v6.8.51
// Last updated: 2026-03-11

import type {
  StatusResponse,
  ConfigChangedResponse,
  UsageResponse,
  UsageExportResponse,
  UsageImportPayload,
  UsageImportResponse,
  Config,
  AuthFilesResponse,
  AuthFileModelsResponse,
  ModelDefinitionsResponse,
  LogsResponse,
  RequestErrorLogsResponse,
  OAuthCallbackRequest,
  OAuthAuthURLResponse,
  AuthStatusResponse,
  APICallRequest,
  APICallResponse,
  VertexImportResponse,
  LatestVersionResponse,
  GeminiKey,
  ClaudeKey,
  CodexKey,
  VertexCompatKey,
  OpenAICompatibility,
  OAuthModelAlias,
  AmpCode,
  AmpModelMapping,
  AmpUpstreamAPIKeyEntry,
  ClaudeSessionRequest,
  ClaudeSessionResponse,
} from "./types";

// ============================================================
// HTTP Client Infrastructure
// ============================================================

let managementKey = "";
let baseUrl = "";

export function setManagementKey(key: string) {
  managementKey = key;
}

export function setBaseUrl(url: string) {
  baseUrl = url.replace(/\/+$/, "");
}

function buildUrl(path: string): string {
  return `${baseUrl}/v0/management${path}`;
}

function defaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (managementKey) {
    headers["Authorization"] = `Bearer ${managementKey}`;
  }
  return headers;
}

interface RequestOptions {
  responseType?: "json" | "text" | "blob";
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const url = buildUrl(path);
  const init: RequestInit = {
    method,
    headers: defaultHeaders(),
  };

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      init.body = body;
      const headers = init.headers as Record<string, string>;
      delete headers["Content-Type"];
    } else {
      init.body = JSON.stringify(body);
    }
  }

  const resp = await fetch(url, init);
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const responseType = options?.responseType ?? "json";
  if (responseType === "text") {
    return (await resp.text()) as T;
  }
  if (responseType === "blob") {
    return (await resp.blob()) as T;
  }
  return (await resp.json()) as T;
}

async function get<T>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>("GET", path, undefined, options);
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("POST", path, body);
}

async function put<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("PUT", path, body);
}

async function patch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("PATCH", path, body);
}

async function del<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("DELETE", path, body);
}

// ============================================================
// Toggle Setting Helper
// ============================================================

function createToggleSetting<T>(path: string, jsonKey: string) {
  return {
    get: () => get<Record<string, T>>(path).then((r) => r[jsonKey]),
    set: (value: T) => put<StatusResponse>(path, { value }),
  };
}

// ============================================================
// Usage
// ============================================================

export const usage = {
  get: () => get<UsageResponse>("/usage"),
  export: () => get<UsageExportResponse>("/usage/export"),
  import: (payload: UsageImportPayload) =>
    post<UsageImportResponse>("/usage/import", payload),
};

// ============================================================
// Config
// ============================================================

export const config = {
  get: () => get<Config>("/config"),
  getYAML: () => get<string>("/config.yaml", { responseType: "text" }),
  putYAML: (yaml: string) =>
    request<ConfigChangedResponse>("PUT", "/config.yaml", yaml),
};

export const latestVersion = {
  get: () => get<LatestVersionResponse>("/latest-version"),
};

// ============================================================
// Simple Toggle Settings
// ============================================================

export const debug = createToggleSetting<boolean>("/debug", "debug");

export const loggingToFile = createToggleSetting<boolean>(
  "/logging-to-file",
  "logging-to-file",
);

export const logsMaxTotalSizeMB = createToggleSetting<number>(
  "/logs-max-total-size-mb",
  "logs-max-total-size-mb",
);

export const errorLogsMaxFiles = createToggleSetting<number>(
  "/error-logs-max-files",
  "error-logs-max-files",
);

export const usageStatisticsEnabled = createToggleSetting<boolean>(
  "/usage-statistics-enabled",
  "usage-statistics-enabled",
);

export const requestLog = createToggleSetting<boolean>(
  "/request-log",
  "request-log",
);

export const websocketAuth = createToggleSetting<boolean>(
  "/ws-auth",
  "ws-auth",
);

export const requestRetry = createToggleSetting<number>(
  "/request-retry",
  "request-retry",
);

export const maxRetryInterval = createToggleSetting<number>(
  "/max-retry-interval",
  "max-retry-interval",
);

export const forceModelPrefix = createToggleSetting<boolean>(
  "/force-model-prefix",
  "force-model-prefix",
);

// ============================================================
// Proxy URL
// ============================================================

export const proxyUrl = {
  get: () =>
    get<{ "proxy-url": string }>("/proxy-url").then((r) => r["proxy-url"]),
  set: (value: string) => put<StatusResponse>("/proxy-url", { value }),
  delete: () => del<StatusResponse>("/proxy-url"),
};

// ============================================================
// Routing Strategy
// ============================================================

export const routingStrategy = {
  get: () =>
    get<{ strategy: string }>("/routing/strategy").then((r) => r.strategy),
  set: (value: string) => put<StatusResponse>("/routing/strategy", { value }),
};

// ============================================================
// Quota Exceeded
// ============================================================

export const quotaExceeded = {
  switchProject: createToggleSetting<boolean>(
    "/quota-exceeded/switch-project",
    "switch-project",
  ),
  switchPreviewModel: createToggleSetting<boolean>(
    "/quota-exceeded/switch-preview-model",
    "switch-preview-model",
  ),
};

// ============================================================
// API Keys (string[])
// ============================================================

export const apiKeys = {
  get: () =>
    get<{ "api-keys": string[] }>("/api-keys").then((r) => r["api-keys"]),
  set: (items: string[]) => put<StatusResponse>("/api-keys", items),
  patch: (body: {
    old?: string;
    new?: string;
    index?: number;
    value?: string;
  }) => patch<StatusResponse>("/api-keys", body),
  delete: (params: { index?: number; value?: string }) => {
    const query = new URLSearchParams();
    if (params.index !== undefined) query.set("index", String(params.index));
    if (params.value !== undefined) query.set("value", params.value);
    return del<StatusResponse>(`/api-keys?${query}`);
  },
};

// ============================================================
// Gemini API Keys
// ============================================================

export const geminiApiKey = {
  get: () =>
    get<{ "gemini-api-key": GeminiKey[] }>("/gemini-api-key").then(
      (r) => r["gemini-api-key"],
    ),
  set: (items: GeminiKey[]) => put<StatusResponse>("/gemini-api-key", items),
  patch: (body: {
    index?: number;
    match?: string;
    value: Partial<{
      "api-key": string;
      prefix: string;
      "base-url": string;
      "proxy-url": string;
      headers: Record<string, string>;
      "excluded-models": string[];
    }>;
  }) => patch<StatusResponse>("/gemini-api-key", body),
  delete: (params: { "api-key"?: string; index?: number }) => {
    const query = new URLSearchParams();
    if (params["api-key"]) query.set("api-key", params["api-key"]);
    if (params.index !== undefined) query.set("index", String(params.index));
    return del<StatusResponse>(`/gemini-api-key?${query}`);
  },
};

// ============================================================
// Claude API Keys
// ============================================================

export const claudeApiKey = {
  get: () =>
    get<{ "claude-api-key": ClaudeKey[] }>("/claude-api-key").then(
      (r) => r["claude-api-key"],
    ),
  set: (items: ClaudeKey[]) => put<StatusResponse>("/claude-api-key", items),
  patch: (body: {
    index?: number;
    match?: string;
    value: Partial<{
      "api-key": string;
      prefix: string;
      "base-url": string;
      "proxy-url": string;
      models: ClaudeKey["models"];
      headers: Record<string, string>;
      "excluded-models": string[];
    }>;
  }) => patch<StatusResponse>("/claude-api-key", body),
  delete: (params: { "api-key"?: string; index?: number }) => {
    const query = new URLSearchParams();
    if (params["api-key"]) query.set("api-key", params["api-key"]);
    if (params.index !== undefined) query.set("index", String(params.index));
    return del<StatusResponse>(`/claude-api-key?${query}`);
  },
};

// ============================================================
// Codex API Keys
// ============================================================

export const codexApiKey = {
  get: () =>
    get<{ "codex-api-key": CodexKey[] }>("/codex-api-key").then(
      (r) => r["codex-api-key"],
    ),
  set: (items: CodexKey[]) => put<StatusResponse>("/codex-api-key", items),
  patch: (body: {
    index?: number;
    match?: string;
    value: Partial<{
      "api-key": string;
      prefix: string;
      "base-url": string;
      "proxy-url": string;
      models: CodexKey["models"];
      headers: Record<string, string>;
      "excluded-models": string[];
    }>;
  }) => patch<StatusResponse>("/codex-api-key", body),
  delete: (params: { "api-key"?: string; index?: number }) => {
    const query = new URLSearchParams();
    if (params["api-key"]) query.set("api-key", params["api-key"]);
    if (params.index !== undefined) query.set("index", String(params.index));
    return del<StatusResponse>(`/codex-api-key?${query}`);
  },
};

// ============================================================
// OpenAI Compatibility
// ============================================================

export const openaiCompatibility = {
  get: () =>
    get<{ "openai-compatibility": OpenAICompatibility[] }>(
      "/openai-compatibility",
    ).then((r) => r["openai-compatibility"]),
  set: (items: OpenAICompatibility[]) =>
    put<StatusResponse>("/openai-compatibility", items),
  patch: (body: {
    name?: string;
    index?: number;
    value: Partial<{
      name: string;
      prefix: string;
      "base-url": string;
      "api-key-entries": OpenAICompatibility["api-key-entries"];
      models: OpenAICompatibility["models"];
      headers: Record<string, string>;
    }>;
  }) => patch<StatusResponse>("/openai-compatibility", body),
  delete: (params: { name?: string; index?: number }) => {
    const query = new URLSearchParams();
    if (params.name) query.set("name", params.name);
    if (params.index !== undefined) query.set("index", String(params.index));
    return del<StatusResponse>(`/openai-compatibility?${query}`);
  },
};

// ============================================================
// Vertex API Keys
// ============================================================

export const vertexApiKey = {
  get: () =>
    get<{ "vertex-api-key": VertexCompatKey[] }>("/vertex-api-key").then(
      (r) => r["vertex-api-key"],
    ),
  set: (items: VertexCompatKey[]) =>
    put<StatusResponse>("/vertex-api-key", items),
  patch: (body: {
    index?: number;
    match?: string;
    value: Partial<{
      "api-key": string;
      prefix: string;
      "base-url": string;
      "proxy-url": string;
      headers: Record<string, string>;
      models: VertexCompatKey["models"];
      "excluded-models": string[];
    }>;
  }) => patch<StatusResponse>("/vertex-api-key", body),
  delete: (params: { "api-key"?: string; index?: number }) => {
    const query = new URLSearchParams();
    if (params["api-key"]) query.set("api-key", params["api-key"]);
    if (params.index !== undefined) query.set("index", String(params.index));
    return del<StatusResponse>(`/vertex-api-key?${query}`);
  },
};

// ============================================================
// OAuth Excluded Models
// ============================================================

export const oauthExcludedModels = {
  get: () =>
    get<{ "oauth-excluded-models": Record<string, string[]> }>(
      "/oauth-excluded-models",
    ).then((r) => r["oauth-excluded-models"]),
  set: (entries: Record<string, string[]>) =>
    put<StatusResponse>("/oauth-excluded-models", entries),
  patch: (body: { provider: string; models: string[] }) =>
    patch<StatusResponse>("/oauth-excluded-models", body),
  delete: (provider: string) =>
    del<StatusResponse>(`/oauth-excluded-models?provider=${encodeURIComponent(provider)}`),
};

// ============================================================
// OAuth Model Alias
// ============================================================

export const oauthModelAlias = {
  get: () =>
    get<{ "oauth-model-alias": Record<string, OAuthModelAlias[]> }>(
      "/oauth-model-alias",
    ).then((r) => r["oauth-model-alias"]),
  set: (entries: Record<string, OAuthModelAlias[]>) =>
    put<StatusResponse>("/oauth-model-alias", entries),
  patch: (body: {
    provider?: string;
    channel?: string;
    aliases: OAuthModelAlias[];
  }) => patch<StatusResponse>("/oauth-model-alias", body),
  delete: (channel: string) =>
    del<StatusResponse>(`/oauth-model-alias?channel=${encodeURIComponent(channel)}`),
};

// ============================================================
// Auth Files
// ============================================================

export const authFiles = {
  list: () => get<AuthFilesResponse>("/auth-files"),
  models: (name: string) =>
    get<AuthFileModelsResponse>(
      `/auth-files/models?name=${encodeURIComponent(name)}`,
    ),
  download: (name: string) =>
    get<Blob>(`/auth-files/download?name=${encodeURIComponent(name)}`, {
      responseType: "blob",
    }),
  upload: (formData: FormData) =>
    request<StatusResponse>("POST", "/auth-files", formData),
  delete: (name: string) =>
    del<StatusResponse>(
      `/auth-files?name=${encodeURIComponent(name)}`,
    ),
  patchStatus: (body: { name: string; disabled?: boolean }) =>
    patch<StatusResponse>("/auth-files/status", body),
  patchFields: (body: { name: string; [key: string]: unknown }) =>
    patch<StatusResponse>("/auth-files/fields", body),
};

// ============================================================
// Model Definitions
// ============================================================

export const modelDefinitions = {
  get: (channel: string) =>
    get<ModelDefinitionsResponse>(`/model-definitions/${encodeURIComponent(channel)}`),
};

// ============================================================
// Vertex Import
// ============================================================

export const vertexImport = {
  import: (formData: FormData) =>
    request<VertexImportResponse>("POST", "/vertex/import", formData),
};

// ============================================================
// Logs
// ============================================================

export const logs = {
  get: (params?: { after?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.after !== undefined) query.set("after", String(params.after));
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    const qs = query.toString();
    return get<LogsResponse>(`/logs${qs ? `?${qs}` : ""}`);
  },
  delete: () => del<StatusResponse>("/logs"),
  errorLogs: () => get<RequestErrorLogsResponse>("/request-error-logs"),
  downloadErrorLog: (name: string) =>
    get<Blob>(`/request-error-logs/${encodeURIComponent(name)}`, {
      responseType: "blob",
    }),
  getRequestLogByID: (id: string) =>
    get<Blob>(`/request-log-by-id/${encodeURIComponent(id)}`, {
      responseType: "blob",
    }),
};

// ============================================================
// API Call
// ============================================================

export const apiCall = {
  execute: (body: APICallRequest) =>
    post<APICallResponse>("/api-call", body),
};

// ============================================================
// AmpCode
// ============================================================

export const ampcode = {
  get: () => get<{ ampcode: AmpCode }>("/ampcode").then((r) => r.ampcode),

  upstreamUrl: {
    get: () =>
      get<{ "upstream-url": string }>("/ampcode/upstream-url").then(
        (r) => r["upstream-url"],
      ),
    set: (value: string) =>
      put<StatusResponse>("/ampcode/upstream-url", { value }),
    delete: () => del<StatusResponse>("/ampcode/upstream-url"),
  },

  upstreamApiKey: {
    get: () =>
      get<{ "upstream-api-key": string }>("/ampcode/upstream-api-key").then(
        (r) => r["upstream-api-key"],
      ),
    set: (value: string) =>
      put<StatusResponse>("/ampcode/upstream-api-key", { value }),
    delete: () => del<StatusResponse>("/ampcode/upstream-api-key"),
  },

  restrictManagementToLocalhost: createToggleSetting<boolean>(
    "/ampcode/restrict-management-to-localhost",
    "restrict-management-to-localhost",
  ),

  modelMappings: {
    get: () =>
      get<{ "model-mappings": AmpModelMapping[] }>(
        "/ampcode/model-mappings",
      ).then((r) => r["model-mappings"]),
    set: (value: AmpModelMapping[]) =>
      put<StatusResponse>("/ampcode/model-mappings", { value }),
    patch: (value: AmpModelMapping[]) =>
      patch<StatusResponse>("/ampcode/model-mappings", { value }),
    delete: (value?: string[]) =>
      del<StatusResponse>("/ampcode/model-mappings", { value: value ?? [] }),
  },

  forceModelMappings: createToggleSetting<boolean>(
    "/ampcode/force-model-mappings",
    "force-model-mappings",
  ),

  upstreamApiKeys: {
    get: () =>
      get<{ "upstream-api-keys": AmpUpstreamAPIKeyEntry[] }>(
        "/ampcode/upstream-api-keys",
      ).then((r) => r["upstream-api-keys"]),
    set: (value: AmpUpstreamAPIKeyEntry[]) =>
      put<StatusResponse>("/ampcode/upstream-api-keys", { value }),
    patch: (value: AmpUpstreamAPIKeyEntry[]) =>
      patch<StatusResponse>("/ampcode/upstream-api-keys", { value }),
    delete: (value: string[]) =>
      del<StatusResponse>("/ampcode/upstream-api-keys", { value }),
  },
};

// ============================================================
// OAuth Auth URLs
// ============================================================

export const oauth = {
  anthropic: () => get<OAuthAuthURLResponse>("/anthropic-auth-url"),
  codex: () => get<OAuthAuthURLResponse>("/codex-auth-url"),
  geminiCli: () => get<OAuthAuthURLResponse>("/gemini-cli-auth-url"),
  antigravity: () => get<OAuthAuthURLResponse>("/antigravity-auth-url"),
  qwen: () => get<OAuthAuthURLResponse>("/qwen-auth-url"),
  kimi: () => get<OAuthAuthURLResponse>("/kimi-auth-url"),
  iflow: () => get<OAuthAuthURLResponse>("/iflow-auth-url"),
  iflowCookie: (body: unknown) =>
    post<OAuthAuthURLResponse>("/iflow-auth-url", body),
  callback: (body: OAuthCallbackRequest) =>
    post<StatusResponse>("/oauth-callback", body),
  getAuthStatus: () => get<AuthStatusResponse>("/get-auth-status"),
};

// ============================================================
// CPA Custom Routes
// ============================================================

export const custom = {
  healthz: () =>
    request<string>("GET", "", undefined, { responseType: "text" }).then(
      () => "ok",
    ),
  claudeSession: (body: ClaudeSessionRequest) =>
    cpaPost<ClaudeSessionResponse>("/cpa/auth/claude-session", body),
};

// Custom healthz uses a different base path
export async function healthz(): Promise<string> {
  const resp = await fetch(`${baseUrl}/healthz`);
  return resp.text();
}

// CPA custom routes use a different base path (no /v0/management prefix)
async function cpaPost<T>(path: string, body?: unknown): Promise<T> {
  const url = `${baseUrl}${path}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: defaultHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return (await resp.json()) as T;
}
