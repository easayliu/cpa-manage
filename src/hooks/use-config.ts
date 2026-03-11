import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { config } from "@/api/management-api";
import type { Config, ConfigChangedResponse } from "@/api/types";

export function useConfig() {
  return useQuery<Config>({
    queryKey: ["config"],
    queryFn: () => config.get(),
  });
}

export function useConfigYAML() {
  return useQuery<string>({
    queryKey: ["config-yaml"],
    queryFn: () => config.getYAML(),
  });
}

export function usePutConfigYAML() {
  const qc = useQueryClient();
  return useMutation<ConfigChangedResponse, Error, string>({
    mutationFn: (yaml: string) => config.putYAML(yaml),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["config"] });
      qc.invalidateQueries({ queryKey: ["config-yaml"] });
    },
  });
}
