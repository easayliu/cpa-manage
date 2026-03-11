import { useTranslation } from "react-i18next";
import { RefreshCw, Trash2, Download } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { getButtonClass, cardStyles } from "@/lib/ui-styles";
import {
  useLogs,
  useDeleteLogs,
  useErrorLogs,
  useDownloadErrorLog,
} from "@/hooks/use-logs";

// Format file size to human-readable string
function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function LogsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data } = useLogs();
  const { data: errorData } = useErrorLogs();
  const deleteMutation = useDeleteLogs();
  const downloadErrorMutation = useDownloadErrorLog();

  function handleRefresh() {
    qc.invalidateQueries({ queryKey: ["logs"] });
    qc.invalidateQueries({ queryKey: ["error-logs"] });
  }

  function handleClear() {
    deleteMutation.mutate();
  }

  function handleDownloadError(name: string) {
    downloadErrorMutation.mutate(name, {
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

  const lines = data?.lines ?? [];
  const lineCount = data?.["line-count"] ?? 0;
  const errorFiles = errorData?.files ?? [];

  return (
    <div className="space-y-4">
      {/* Row 1: Stats + actions */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg ring-1 ring-border/60 text-[13px] font-medium tabular-nums text-muted-foreground">
          {t("logs.lineCount")} {lineCount}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={getButtonClass("ghost")}
            onClick={handleRefresh}
          >
            <RefreshCw className="size-3.5" />
            {t("dashboard.refresh")}
          </button>
          <button
            type="button"
            className={getButtonClass("ghost")}
            onClick={handleClear}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="size-3.5 text-destructive" />
            <span className="text-destructive">{t("logs.clearLogs")}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Log lines */}
      <div className={cn(cardStyles, "p-0 overflow-hidden")}>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {lines.length > 0 ? (
            <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all">
              {lines.join("\n")}
            </pre>
          ) : (
            <p className="text-xs text-muted-foreground/60 text-center py-6">
              {t("common.noData")}
            </p>
          )}
        </div>
      </div>

      {/* Row 3: Error logs list */}
      <div className={cardStyles}>
        <h3 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-3">
          {t("logs.errorLogs")}
        </h3>
        {errorFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-muted-foreground/60">
                  <th className="pb-2 font-medium">{t("logs.name")}</th>
                  <th className="pb-2 font-medium">{t("logs.size")}</th>
                  <th className="pb-2 font-medium">{t("logs.modified")}</th>
                  <th className="pb-2 font-medium w-10" />
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {errorFiles.map((file) => (
                  <tr
                    key={file.name}
                    className="border-t border-border/40 hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-1.5 pr-4 font-mono text-xs">
                      {file.name}
                    </td>
                    <td className="py-1.5 pr-4 tabular-nums">
                      {formatSize(file.size)}
                    </td>
                    <td className="py-1.5 pr-4 tabular-nums">
                      {new Date(file.modified * 1000).toLocaleString()}
                    </td>
                    <td className="py-1.5">
                      <button
                        type="button"
                        className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground transition-colors"
                        onClick={() => handleDownloadError(file.name)}
                        disabled={downloadErrorMutation.isPending}
                      >
                        <Download className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground/60 text-center py-4">
            {t("common.noData")}
          </p>
        )}
      </div>
    </div>
  );
}
