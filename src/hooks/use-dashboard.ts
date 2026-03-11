import { useQuery, useMutation } from "@tanstack/react-query";
import { usage, authFiles, latestVersion } from "@/api/management-api";
import type {
  UsageResponse,
  UsageExportResponse,
  UsageImportPayload,
  UsageImportResponse,
  AuthFilesResponse,
  LatestVersionResponse,
} from "@/api/types";

// Fetch usage statistics
export function useUsage() {
  return useQuery<UsageResponse>({
    queryKey: ["usage"],
    queryFn: () => usage.get(),
  });
}

// Export usage data
export function useUsageExport() {
  return useMutation<UsageExportResponse>({
    mutationFn: () => usage.export(),
  });
}

// Import usage data
export function useUsageImport() {
  return useMutation<UsageImportResponse, Error, UsageImportPayload>({
    mutationFn: (payload) => usage.import(payload),
  });
}

// Fetch auth files list
export function useAuthFiles() {
  return useQuery<AuthFilesResponse>({
    queryKey: ["auth-files"],
    queryFn: () => authFiles.list(),
  });
}

// Fetch latest version info
export function useLatestVersion() {
  return useQuery<LatestVersionResponse>({
    queryKey: ["latest-version"],
    queryFn: () => latestVersion.get(),
  });
}
