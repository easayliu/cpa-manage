import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFiles, oauth } from "@/api/management-api";
import type { OAuthAuthURLResponse, OAuthCallbackRequest } from "@/api/types";

// Toggle auth file enabled/disabled
export function useToggleAuthFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, disabled }: { name: string; disabled: boolean }) =>
      authFiles.patchStatus({ name, disabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth-files"] }),
  });
}

// Delete auth file
export function useDeleteAuthFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => authFiles.delete(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth-files"] }),
  });
}

// Upload auth file
export function useUploadAuthFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => authFiles.upload(formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth-files"] }),
  });
}

// Download auth file (returns blob)
export function useDownloadAuthFile() {
  return useMutation({
    mutationFn: (name: string) => authFiles.download(name),
  });
}

// OAuth - start auth flow for a provider
export function useOAuthAuth() {
  return useMutation({
    mutationFn: (provider: string) => {
      const providerMap: Record<string, () => Promise<OAuthAuthURLResponse>> = {
        anthropic: oauth.anthropic,
        codex: oauth.codex,
        gemini: oauth.geminiCli,
        antigravity: oauth.antigravity,
        qwen: oauth.qwen,
        kimi: oauth.kimi,
        iflow: oauth.iflow,
      };
      const fn = providerMap[provider];
      if (!fn) throw new Error(`Unknown provider: ${provider}`);
      return fn();
    },
  });
}

// OAuth - submit callback URL to complete auth
export function useOAuthCallback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: OAuthCallbackRequest) => oauth.callback(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth-files"] }),
  });
}
