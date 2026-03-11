import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { inputStyles, getButtonClass } from "@/lib/ui-styles";
import { useAuthStore } from "@/stores/auth-store";
import { healthz } from "@/api/management-api";

// Guard that requires a valid API key before rendering children
export function AuthGuard({ children }: { children: ReactNode }) {
  const { apiKey, setApiKey } = useAuthStore();
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (apiKey) {
    return <>{children}</>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    // Temporarily set the key to test the connection
    setApiKey(trimmed);
    try {
      await healthz();
      // Success - key is already set
    } catch {
      // Connection failed, clear the key
      useAuthStore.getState().clearApiKey();
      setError(t("auth.connectionFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-dvh items-center justify-center bg-background p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg ring-1 ring-border/60 p-6 bg-card"
      >
        <h1 className="text-lg font-semibold text-foreground">CPA Manage</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          {t("auth.enterApiKey")}
        </p>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("auth.apiKeyPlaceholder")}
          className={cn(inputStyles, "mt-4")}
          autoFocus
        />
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={cn(getButtonClass("primary"), "w-full mt-3")}
        >
          {loading ? t("common.loading") : t("auth.connect")}
        </button>
      </form>
    </div>
  );
}
