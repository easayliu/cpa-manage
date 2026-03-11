import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Upload, Download, Trash2, Power, ExternalLink, Copy, Check, Send, Loader2, CircleCheck, CircleX, ShieldCheck, FileDown, FileUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { getButtonClass, cardStyles, badgeVariants, inputStyles } from "@/lib/ui-styles";
import { useUsage, useAuthFiles, useUsageExport, useUsageImport } from "@/hooks/use-dashboard";
import { UsageCharts } from "@/components/usage-charts";
import {
  useToggleAuthFile,
  useDeleteAuthFile,
  useUploadAuthFile,
  useDownloadAuthFile,
  useOAuthAuth,
  useOAuthCallback,
} from "@/hooks/use-auth-mutations";
import { useVerifyAuthFile } from "@/hooks/use-verify-auth";
import type { VerifyResult } from "@/hooks/use-verify-auth";
import type { AuthFile } from "@/api/types";

const pillBase =
  "inline-flex items-center px-2.5 py-1 rounded-lg ring-1 text-[13px] font-medium tabular-nums";

const oauthProviders = [
  { key: "anthropic", label: "Anthropic" },
  { key: "codex", label: "Codex" },
  { key: "gemini", label: "Gemini" },
  { key: "antigravity", label: "Antigravity" },
  { key: "qwen", label: "Qwen" },
  { key: "kimi", label: "Kimi" },
  { key: "iflow", label: "iFlow" },
];

function StatusDot({ status, disabled, unavailable }: Pick<AuthFile, "status" | "disabled" | "unavailable">) {
  if (disabled) return <span className="size-2 rounded-full bg-muted-foreground" />;
  if (unavailable) return <span className="size-2 rounded-full bg-warning" />;
  if (status === "error") return <span className="size-2 rounded-full bg-destructive" />;
  return <span className="size-2 rounded-full bg-success" />;
}

function getStatusLabel(
  file: AuthFile,
  t: (key: string) => string,
): { label: string; className: string } {
  if (file.disabled) return { label: t("dashboard.disabled"), className: "text-muted-foreground" };
  if (file.unavailable) return { label: t("dashboard.unavailable"), className: "text-warning" };
  if (file.status === "error") return { label: t("dashboard.error"), className: "text-destructive" };
  return { label: t("dashboard.active"), className: "text-success" };
}

const actionBtnBase =
  "inline-flex items-center justify-center size-7 rounded-md text-muted-foreground/70 hover:bg-muted/60 transition-colors";

export function DashboardPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: usageData, isLoading: usageLoading } = useUsage();
  const { data: authData, isLoading: authLoading } = useAuthFiles();

  const toggleMutation = useToggleAuthFile();
  const deleteMutation = useDeleteAuthFile();
  const uploadMutation = useUploadAuthFile();
  const downloadMutation = useDownloadAuthFile();
  const oauthMutation = useOAuthAuth();
  const callbackMutation = useOAuthCallback();
  const verifyMutation = useVerifyAuthFile();
  const exportMutation = useUsageExport();
  const importMutation = useUsageImport();

  // Per-row verify state: idle | loading | result
  const [verifyStates, setVerifyStates] = useState<
    Record<string, { status: "loading" } | { status: "done"; result: VerifyResult }>
  >({});

  // OAuth flow state
  const [oauthState, setOauthState] = useState<{
    provider: string;
    authUrl: string;
    state: string;
  } | null>(null);
  const [callbackUrl, setCallbackUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const isLoading = usageLoading || authLoading;
  const usage = usageData?.usage;
  const files = authData?.files ?? [];

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  function handleExportUsage() {
    exportMutation.mutate(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `usage-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  function handleImportUsage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        importMutation.mutate(data, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usage"] });
          },
        });
      } catch {
        // invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    uploadMutation.mutate(formData);
    e.target.value = "";
  }

  function handleDownload(name: string) {
    downloadMutation.mutate(name, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  function handleOAuth(provider: string) {
    oauthMutation.mutate(provider, {
      onSuccess: (data) => {
        setOauthState({ provider, authUrl: data.url, state: data.state });
        setCallbackUrl("");
        setCopied(false);
      },
    });
  }

  function handleCopyUrl() {
    if (!oauthState) return;
    navigator.clipboard.writeText(oauthState.authUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleVerify(file: AuthFile) {
    setVerifyStates((prev) => ({ ...prev, [file.name]: { status: "loading" } }));
    verifyMutation.mutate(file.name, {
      onSuccess: (result) => {
        setVerifyStates((prev) => ({ ...prev, [file.name]: { status: "done", result } }));
        setTimeout(() => {
          setVerifyStates((prev) => {
            const next = { ...prev };
            delete next[file.name];
            return next;
          });
        }, 5000);
      },
    });
  }

  function handleSubmitCallback() {
    if (!oauthState || !callbackUrl.trim()) return;
    const provider = oauthState.provider;
    callbackMutation.mutate(
      { provider, redirect_url: callbackUrl.trim() },
      {
        onSuccess: async () => {
          // Refresh auth files and auto-verify the new credential
          const prevIds = new Set(files.map((f) => f.id));
          const updated = await queryClient.fetchQuery({
            queryKey: ["auth-files"],
            staleTime: 0,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any;
          const newFiles: AuthFile[] = updated?.files ?? [];
          const newFile = newFiles.find(
            (f) => !prevIds.has(f.id) && f.provider === provider,
          );
          if (newFile) {
            handleVerify(newFile);
          }
          setTimeout(() => {
            setOauthState(null);
            setCallbackUrl("");
            callbackMutation.reset();
          }, 3000);
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-[13px] text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  const columns = [
    { key: "name", label: t("dashboard.name") },
    { key: "provider", label: t("dashboard.provider") },
    { key: "type", label: t("dashboard.type") },
    { key: "status", label: t("dashboard.status") },
    { key: "email", label: t("dashboard.email") },
    { key: "account", label: t("dashboard.account") },
    { key: "actions", label: t("dashboard.actions") },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Row 1: Stats bar + actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(pillBase, "ring-border/60 text-muted-foreground")}>
            {t("dashboard.total")} {usage?.total_requests?.toLocaleString() ?? "—"}
          </span>
          <span className={cn(pillBase, "ring-success/30 bg-success/5 text-success")}>
            {t("dashboard.success")} {usage?.success_count?.toLocaleString() ?? "—"}
          </span>
          {(usage?.failure_count ?? 0) > 0 && (
            <span className={cn(pillBase, "ring-destructive/30 bg-destructive/5 text-destructive")}>
              {t("dashboard.failed")} {usage.failure_count.toLocaleString()}
            </span>
          )}
          <span className={cn(pillBase, "ring-info/30 bg-info/5 text-info")}>
            {t("dashboard.tokens")} {usage?.total_tokens?.toLocaleString() ?? "—"}
          </span>
          <span className={cn(pillBase, "ring-border/60 text-muted-foreground")}>
            {t("dashboard.authFiles")} {files.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={cn(getButtonClass("ghost", "sm"), "gap-1.5")}
            onClick={handleExportUsage}
            disabled={exportMutation.isPending}
            title={t("dashboard.exportUsage")}
          >
            <FileDown className="size-3.5" />
            <span className="hidden sm:inline">{t("dashboard.exportUsage")}</span>
          </button>
          <label className={cn(getButtonClass("ghost", "sm"), "gap-1.5 cursor-pointer")} title={t("dashboard.importUsage")}>
            <FileUp className="size-3.5" />
            <span className="hidden sm:inline">{t("dashboard.importUsage")}</span>
            <input type="file" accept=".json" className="hidden" onChange={handleImportUsage} />
          </label>
          <label className={cn(getButtonClass("outline", "sm"), "gap-1.5 cursor-pointer")}>
            <Upload className="size-3.5" />
            <span className="hidden sm:inline">{t("dashboard.upload")}</span>
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
          <button
            type="button"
            className={cn(getButtonClass("ghost", "sm"), "gap-1.5")}
            onClick={handleRefresh}
          >
            <RefreshCw className="size-3.5" />
            <span className="hidden sm:inline">{t("dashboard.refresh")}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Usage charts */}
      {usage && <UsageCharts usage={usage} />}

      {/* Row 3: Auth Files table */}
      <div className={cn(cardStyles, "overflow-x-auto p-0")}>
        {files.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-[13px] text-muted-foreground">
            {t("common.noData")}
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-[11px] uppercase tracking-wider font-medium text-muted-foreground py-2 px-3"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                const statusInfo = getStatusLabel(file, t);
                return (
                  <tr
                    key={file.id}
                    className="border-b border-border/30 last:border-b-0 hover:bg-muted/60 transition-colors"
                  >
                    <td className="py-2 px-3 text-foreground font-medium">{file.name}</td>
                    <td className="py-2 px-3">
                      <span className={badgeVariants.default}>{file.provider}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={badgeVariants.default}>{file.type}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1.5">
                        <StatusDot status={file.status} disabled={file.disabled} unavailable={file.unavailable} />
                        <span className={cn("text-[13px]", statusInfo.className)}>{statusInfo.label}</span>
                      </span>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{file.email || "—"}</td>
                    <td className="py-2 px-3 text-muted-foreground">{file.account ?? file.account_type ?? "—"}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-0.5">
                        {/* Verify credential */}
                        {(() => {
                          const vs = verifyStates[file.name];
                          if (vs?.status === "loading") {
                            return (
                              <span className={actionBtnBase}>
                                <Loader2 className="size-3.5 animate-spin text-primary" />
                              </span>
                            );
                          }
                          if (vs?.status === "done") {
                            return (
                              <span
                                className={actionBtnBase}
                                title={
                                  vs.result.valid
                                    ? `${t("dashboard.verifyValid")} · ${t("dashboard.verifyModels")}: ${vs.result.modelCount}`
                                    : `${t("dashboard.verifyInvalid")}${vs.result.error ? ` · ${vs.result.error}` : ""}`
                                }
                              >
                                {vs.result.valid ? (
                                  <CircleCheck className="size-3.5 text-success" />
                                ) : (
                                  <CircleX className="size-3.5 text-destructive" />
                                )}
                              </span>
                            );
                          }
                          return (
                            <button
                              type="button"
                              title={t("dashboard.verify")}
                              className={cn(actionBtnBase, "hover:text-foreground")}
                              onClick={() => handleVerify(file)}
                            >
                              <ShieldCheck className="size-3.5" />
                            </button>
                          );
                        })()}
                        <button
                          type="button"
                          title={file.disabled ? t("dashboard.enable") : t("dashboard.disable")}
                          className={cn(actionBtnBase, "hover:text-foreground")}
                          onClick={() => toggleMutation.mutate({ name: file.name, disabled: !file.disabled })}
                          disabled={toggleMutation.isPending}
                        >
                          <Power className={cn("size-3.5", file.disabled ? "text-muted-foreground/40" : "text-success")} />
                        </button>
                        <button
                          type="button"
                          title={t("dashboard.download")}
                          className={cn(actionBtnBase, "hover:text-foreground")}
                          onClick={() => handleDownload(file.name)}
                          disabled={downloadMutation.isPending}
                        >
                          <Download className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          title={t("common.delete")}
                          className={cn(actionBtnBase, "hover:text-destructive")}
                          onClick={() => deleteMutation.mutate(file.name)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Row 4: OAuth authorization */}
      <div className={cn(cardStyles)}>
        <h3 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-3">
          {t("dashboard.oauthTitle")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {oauthProviders.map((p) => (
            <button
              key={p.key}
              type="button"
              className={cn(
                getButtonClass("outline", "sm"),
                "gap-1.5",
                oauthState?.provider === p.key && "ring-primary/60 text-primary",
              )}
              onClick={() => handleOAuth(p.key)}
              disabled={oauthMutation.isPending || callbackMutation.isPending}
            >
              <ExternalLink className="size-3" />
              {p.label}
            </button>
          ))}
        </div>

        {oauthState && (
          <div className="mt-3 space-y-2">
            {/* Auth URL display */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                {t("dashboard.oauthAuthUrl")}
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    inputStyles,
                    "flex-1 overflow-hidden text-ellipsis whitespace-nowrap select-all cursor-text",
                    "flex items-center text-muted-foreground",
                  )}
                  title={oauthState.authUrl}
                >
                  {oauthState.authUrl}
                </div>
                <button
                  type="button"
                  className={cn(getButtonClass("outline", "sm"), "gap-1 shrink-0")}
                  onClick={handleCopyUrl}
                >
                  {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                  {copied ? t("dashboard.oauthCopied") : t("dashboard.oauthCopy")}
                </button>
                <a
                  href={oauthState.authUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(getButtonClass("outline", "sm"), "gap-1 shrink-0")}
                >
                  <ExternalLink className="size-3" />
                  {t("dashboard.oauthOpen")}
                </a>
              </div>
            </div>

            {/* Callback URL input / status */}
            {callbackMutation.isPending ? (
              <div className="flex items-center gap-2 py-3 text-[13px] text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                {t("dashboard.oauthSubmitting")}
              </div>
            ) : callbackMutation.isSuccess ? (
              <div className="space-y-1.5 py-3">
                <div className="flex items-center gap-2 text-[13px] text-success">
                  <CircleCheck className="size-4" />
                  {t("dashboard.oauthSubmitSuccess")}
                </div>
                {verifyMutation.isPending && (
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    {t("dashboard.oauthVerifying")}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                  {t("dashboard.oauthCallbackUrl")}
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    className={cn(inputStyles, "flex-1")}
                    placeholder={t("dashboard.oauthCallbackPlaceholder")}
                    value={callbackUrl}
                    onChange={(e) => setCallbackUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmitCallback();
                    }}
                  />
                  <button
                    type="button"
                    className={cn(getButtonClass("primary", "sm"), "gap-1 shrink-0")}
                    onClick={handleSubmitCallback}
                    disabled={!callbackUrl.trim()}
                  >
                    <Send className="size-3" />
                    {t("dashboard.oauthSubmit")}
                  </button>
                </div>
                {callbackMutation.isError && (
                  <div className="flex items-center gap-1.5 text-[13px] text-destructive">
                    <CircleX className="size-3.5" />
                    {(callbackMutation.error as Error)?.message || t("dashboard.oauthSubmitError")}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
