// Auto-generated from Go management API handlers
// Source: internal/api/handlers/management/
// CLIProxyAPI version: v6.8.51
// Last updated: 2026-03-11

// ============================================================
// Common Types
// ============================================================

export interface StatusResponse {
  status: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

export interface ConfigChangedResponse {
  ok: boolean;
  changed: string[];
}

// ============================================================
// Usage Types
// ============================================================

export interface TokenStats {
  input_tokens: number;
  output_tokens: number;
  reasoning_tokens: number;
  cached_tokens: number;
  total_tokens: number;
}

export interface RequestDetail {
  timestamp: string;
  source: string;
  auth_index: string;
  tokens: TokenStats;
  failed: boolean;
}

export interface ModelSnapshot {
  total_requests: number;
  total_tokens: number;
  details: RequestDetail[];
}

export interface APISnapshot {
  total_requests: number;
  total_tokens: number;
  models: Record<string, ModelSnapshot>;
}

export interface StatisticsSnapshot {
  total_requests: number;
  success_count: number;
  failure_count: number;
  total_tokens: number;
  apis: Record<string, APISnapshot>;
  requests_by_day: Record<string, number>;
  requests_by_hour: Record<string, number>;
  tokens_by_day: Record<string, number>;
  tokens_by_hour: Record<string, number>;
}

export interface UsageResponse {
  usage: StatisticsSnapshot;
  failed_requests: number;
}

export interface UsageExportResponse {
  version: number;
  exported_at: string;
  usage: StatisticsSnapshot;
}

export interface UsageImportPayload {
  version: number;
  usage: StatisticsSnapshot;
}

export interface UsageImportResponse {
  added: number;
  skipped: number;
  total_requests: number;
  failed_requests: number;
}

// ============================================================
// Auth File Types
// ============================================================

export interface CodexIDTokenClaims {
  chatgpt_account_id?: string;
  plan_type?: string;
  chatgpt_subscription_active_start?: unknown;
  chatgpt_subscription_active_until?: unknown;
}

export interface AuthFile {
  id: string;
  auth_index: string;
  name: string;
  type: string;
  provider: string;
  label: string;
  status: string;
  status_message: string;
  disabled: boolean;
  unavailable: boolean;
  runtime_only: boolean;
  source: string;
  size: number;
  email?: string;
  account_type?: string;
  account?: string;
  created_at?: string;
  modtime?: string;
  updated_at?: string;
  last_refresh?: string;
  next_retry_after?: string;
  path?: string;
  id_token?: CodexIDTokenClaims;
}

export interface AuthFilesResponse {
  files: AuthFile[];
}

export interface AuthFileModel {
  id: string;
  display_name?: string;
  type?: string;
  owned_by?: string;
}

export interface AuthFileModelsResponse {
  models: AuthFileModel[];
}

// ============================================================
// Model Definition Types
// ============================================================

export interface ModelDefinition {
  id: string;
  [key: string]: unknown;
}

export interface ModelDefinitionsResponse {
  channel: string;
  models: ModelDefinition[];
}

// ============================================================
// Config Types
// ============================================================

export interface ClaudeModel {
  name: string;
  alias: string;
}

export interface CloakConfig {
  mode?: string;
  "strict-mode"?: boolean;
  "sensitive-words"?: string[];
  "cache-user-id"?: boolean;
}

export interface ClaudeKey {
  "api-key": string;
  priority?: number;
  prefix?: string;
  "base-url": string;
  "proxy-url": string;
  models: ClaudeModel[];
  headers?: Record<string, string>;
  "excluded-models"?: string[];
  cloak?: CloakConfig;
}

export interface CodexModel {
  name: string;
  alias: string;
}

export interface CodexKey {
  "api-key": string;
  priority?: number;
  prefix?: string;
  "base-url": string;
  websockets?: boolean;
  "proxy-url": string;
  models: CodexModel[];
  headers?: Record<string, string>;
  "excluded-models"?: string[];
}

export interface GeminiModel {
  name: string;
  alias: string;
}

export interface GeminiKey {
  "api-key": string;
  priority?: number;
  prefix?: string;
  "base-url"?: string;
  "proxy-url"?: string;
  models?: GeminiModel[];
  headers?: Record<string, string>;
  "excluded-models"?: string[];
}

export interface OpenAICompatibilityAPIKey {
  "api-key": string;
  "proxy-url"?: string;
}

export interface OpenAICompatibilityModel {
  name: string;
  alias: string;
}

export interface OpenAICompatibility {
  name: string;
  priority?: number;
  prefix?: string;
  "base-url": string;
  "api-key-entries"?: OpenAICompatibilityAPIKey[];
  models: OpenAICompatibilityModel[];
  headers?: Record<string, string>;
}

export interface VertexCompatModel {
  name: string;
  alias: string;
}

export interface VertexCompatKey {
  "api-key": string;
  priority?: number;
  prefix?: string;
  "base-url"?: string;
  "proxy-url"?: string;
  headers?: Record<string, string>;
  models?: VertexCompatModel[];
  "excluded-models"?: string[];
}

export interface OAuthModelAlias {
  name: string;
  alias: string;
  fork?: boolean;
}

export interface AmpModelMapping {
  from: string;
  to: string;
  regex?: boolean;
}

export interface AmpUpstreamAPIKeyEntry {
  "upstream-api-key": string;
  "api-keys": string[];
}

export interface AmpCode {
  "upstream-url": string;
  "upstream-api-key": string;
  "upstream-api-keys"?: AmpUpstreamAPIKeyEntry[];
  "restrict-management-to-localhost": boolean;
  "model-mappings": AmpModelMapping[];
  "force-model-mappings": boolean;
}

export interface QuotaExceeded {
  "switch-project": boolean;
  "switch-preview-model": boolean;
}

export interface RoutingConfig {
  strategy?: string;
}

export interface PayloadModelRule {
  name: string;
  protocol: string;
}

export interface PayloadRule {
  models: PayloadModelRule[];
  params: Record<string, unknown>;
}

export interface PayloadFilterRule {
  models: PayloadModelRule[];
  params: string[];
}

export interface PayloadConfig {
  default: PayloadRule[];
  "default-raw": PayloadRule[];
  override: PayloadRule[];
  "override-raw": PayloadRule[];
  filter: PayloadFilterRule[];
}

export interface ClaudeHeaderDefaults {
  "user-agent": string;
  "package-version": string;
  "runtime-version": string;
  timeout: string;
}

export interface TLSConfig {
  enable: boolean;
  cert: string;
  key: string;
}

export interface PprofConfig {
  enable: boolean;
  addr: string;
}

export interface Config {
  debug: boolean;
  tls: TLSConfig;
  pprof: PprofConfig;
  "commercial-mode": boolean;
  "logging-to-file": boolean;
  "logs-max-total-size-mb": number;
  "error-logs-max-files": number;
  "usage-statistics-enabled": boolean;
  "disable-cooling": boolean;
  "request-retry": number;
  "max-retry-credentials": number;
  "max-retry-interval": number;
  "quota-exceeded": QuotaExceeded;
  routing: RoutingConfig;
  "ws-auth": boolean;
  "gemini-api-key": GeminiKey[];
  "codex-api-key": CodexKey[];
  "claude-api-key": ClaudeKey[];
  "claude-header-defaults": ClaudeHeaderDefaults;
  "openai-compatibility": OpenAICompatibility[];
  "vertex-api-key": VertexCompatKey[];
  ampcode: AmpCode;
  "oauth-excluded-models"?: Record<string, string[]>;
  "oauth-model-alias"?: Record<string, OAuthModelAlias[]>;
  payload: PayloadConfig;
}

// ============================================================
// Log Types
// ============================================================

export interface LogsResponse {
  lines: string[];
  "line-count": number;
  "latest-timestamp": number;
}

export interface RequestErrorLog {
  name: string;
  size: number;
  modified: number;
}

export interface RequestErrorLogsResponse {
  files: RequestErrorLog[];
}

// ============================================================
// OAuth Types
// ============================================================

export interface OAuthCallbackRequest {
  provider: string;
  redirect_url?: string;
  code?: string;
  state?: string;
  error?: string;
}

export interface OAuthAuthURLResponse {
  url: string;
  state: string;
  [key: string]: unknown;
}

export interface AuthStatusResponse {
  [key: string]: unknown;
}

// ============================================================
// API Call Types
// ============================================================

export interface APICallRequest {
  auth_index?: string;
  method: string;
  url: string;
  header?: Record<string, string>;
  data?: string;
}

export interface APICallResponse {
  status_code: number;
  header: Record<string, string[]>;
  body: string;
}

// ============================================================
// Vertex Import Types
// ============================================================

export interface VertexImportResponse {
  status: string;
  "auth-file": string;
  project_id: string;
  email: string;
  location: string;
}

// ============================================================
// Latest Version Types
// ============================================================

export interface LatestVersionResponse {
  "latest-version": string;
}

// ============================================================
// CPA Custom Types
// ============================================================

export interface ClaudeSessionRequest {
  session_key: string;
}

export interface ClaudeSessionResponse {
  status: string;
  email: string;
  file: string;
}
