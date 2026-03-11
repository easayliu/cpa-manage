import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFiles } from "@/api/management-api";

export interface VerifyResult {
  valid: boolean;
  modelCount: number;
  error?: string;
}

// Verify auth file credential by fetching its available models
export function useVerifyAuthFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string): Promise<VerifyResult> => {
      try {
        const res = await authFiles.models(name);
        return { valid: true, modelCount: res.models?.length ?? 0 };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        return { valid: false, modelCount: 0, error: message };
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["auth-files"] });
    },
  });
}
