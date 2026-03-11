import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  debug,
  loggingToFile,
  logsMaxTotalSizeMB,
  errorLogsMaxFiles,
  usageStatisticsEnabled,
  requestLog,
  websocketAuth,
  requestRetry,
  maxRetryInterval,
  forceModelPrefix,
  proxyUrl,
  routingStrategy,
  quotaExceeded,
  latestVersion,
} from "@/api/management-api";

// Generic hook for toggle settings (boolean get/set)
function useToggleSetting(
  key: string,
  getter: () => Promise<boolean>,
  setter: (v: boolean) => Promise<unknown>,
) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: [key], queryFn: getter });
  const mutation = useMutation({
    mutationFn: setter,
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
  return { ...query, toggle: () => mutation.mutate(!query.data), mutation };
}

// Generic hook for number settings
function useNumberSetting(
  key: string,
  getter: () => Promise<number>,
  setter: (v: number) => Promise<unknown>,
) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: [key], queryFn: getter });
  const mutation = useMutation({
    mutationFn: setter,
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
  return { ...query, set: (v: number) => mutation.mutate(v), mutation };
}

// Boolean toggle hooks
export function useDebug() {
  return useToggleSetting("debug", debug.get, debug.set);
}
export function useLoggingToFile() {
  return useToggleSetting("logging-to-file", loggingToFile.get, loggingToFile.set);
}
export function useUsageStatistics() {
  return useToggleSetting("usage-statistics-enabled", usageStatisticsEnabled.get, usageStatisticsEnabled.set);
}
export function useRequestLog() {
  return useToggleSetting("request-log", requestLog.get, requestLog.set);
}
export function useWebsocketAuth() {
  return useToggleSetting("ws-auth", websocketAuth.get, websocketAuth.set);
}
export function useForceModelPrefix() {
  return useToggleSetting("force-model-prefix", forceModelPrefix.get, forceModelPrefix.set);
}
export function useSwitchProject() {
  return useToggleSetting("switch-project", quotaExceeded.switchProject.get, quotaExceeded.switchProject.set);
}
export function useSwitchPreviewModel() {
  return useToggleSetting("switch-preview-model", quotaExceeded.switchPreviewModel.get, quotaExceeded.switchPreviewModel.set);
}

// Number setting hooks
export function useLogsMaxTotalSizeMB() {
  return useNumberSetting("logs-max-total-size-mb", logsMaxTotalSizeMB.get, logsMaxTotalSizeMB.set);
}
export function useErrorLogsMaxFiles() {
  return useNumberSetting("error-logs-max-files", errorLogsMaxFiles.get, errorLogsMaxFiles.set);
}
export function useRequestRetry() {
  return useNumberSetting("request-retry", requestRetry.get, requestRetry.set);
}
export function useMaxRetryInterval() {
  return useNumberSetting("max-retry-interval", maxRetryInterval.get, maxRetryInterval.set);
}

// Proxy URL (string get/set/delete)
export function useProxyUrl() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["proxy-url"], queryFn: proxyUrl.get });
  const setMutation = useMutation({
    mutationFn: proxyUrl.set,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["proxy-url"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: proxyUrl.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["proxy-url"] }),
  });
  return { ...query, set: setMutation.mutate, remove: deleteMutation.mutate, setMutation, deleteMutation };
}

// Routing strategy (string get/set)
export function useRoutingStrategy() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["routing-strategy"], queryFn: routingStrategy.get });
  const mutation = useMutation({
    mutationFn: routingStrategy.set,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routing-strategy"] }),
  });
  return { ...query, set: mutation.mutate, mutation };
}

// Latest version
export function useLatestVersion() {
  return useQuery({ queryKey: ["latest-version"], queryFn: latestVersion.get });
}
