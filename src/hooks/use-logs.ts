import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logs } from "@/api/management-api";

export function useLogs(params?: { after?: number; limit?: number }) {
  return useQuery({
    queryKey: ["logs", params],
    queryFn: () => logs.get(params),
    refetchInterval: 5000,
  });
}

export function useDeleteLogs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => logs.delete(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["logs"] }),
  });
}

export function useErrorLogs() {
  return useQuery({
    queryKey: ["error-logs"],
    queryFn: () => logs.errorLogs(),
  });
}

export function useDownloadErrorLog() {
  return useMutation({
    mutationFn: (name: string) => logs.downloadErrorLog(name),
  });
}
