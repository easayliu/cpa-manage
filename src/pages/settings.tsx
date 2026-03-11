import { useState, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { cardStyles, inputStyles, getButtonClass } from "@/lib/ui-styles";
import { useAuthStore } from "@/stores/auth-store";
import { queryClient } from "@/lib/query-client";
import {
  useDebug,
  useForceModelPrefix,
  useWebsocketAuth,
  useUsageStatistics,
  useLoggingToFile,
  useRequestLog,
  useLogsMaxTotalSizeMB,
  useErrorLogsMaxFiles,
  useRequestRetry,
  useMaxRetryInterval,
  useRoutingStrategy,
  useProxyUrl,
  useSwitchProject,
  useSwitchPreviewModel,
  useLatestVersion,
} from "@/hooks/use-settings";

// Section card wrapper
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={cardStyles}>
      <h3 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      <div className="divide-y divide-border/40">{children}</div>
    </div>
  );
}

// Reusable toggle row
function ToggleRow({
  label,
  description,
  checked,
  onToggle,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="pr-4">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onToggle}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
          "bg-muted data-[state=checked]:bg-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <Switch.Thumb className="pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5" />
      </Switch.Root>
    </div>
  );
}

// Reusable number input row
function NumberRow({
  label,
  description,
  value,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const [local, setLocal] = useState(String(value));

  // Sync local state when remote value changes
  useEffect(() => {
    setLocal(String(value));
  }, [value]);

  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="pr-4">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <input
        type="number"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          const num = Number(local);
          if (!Number.isNaN(num) && num !== value) {
            onChange(num);
          } else {
            setLocal(String(value));
          }
        }}
        disabled={disabled}
        className={cn(inputStyles, "w-20 text-center")}
      />
    </div>
  );
}

export function SettingsPage() {
  const { t } = useTranslation();

  // General toggles
  const debugSetting = useDebug();
  const forceModelPrefix = useForceModelPrefix();
  const wsAuth = useWebsocketAuth();
  const usageStats = useUsageStatistics();

  // Logging
  const loggingToFile = useLoggingToFile();
  const requestLogSetting = useRequestLog();
  const logsMaxSize = useLogsMaxTotalSizeMB();
  const errorLogsMax = useErrorLogsMaxFiles();

  // Network
  const retryCount = useRequestRetry();
  const retryInterval = useMaxRetryInterval();
  const strategy = useRoutingStrategy();
  const proxy = useProxyUrl();

  // Quota exceeded
  const switchProject = useSwitchProject();
  const switchPreview = useSwitchPreviewModel();

  // Version
  const version = useLatestVersion();

  // Local state for text inputs
  const [proxyInput, setProxyInput] = useState("");
  const [strategyInput, setStrategyInput] = useState("");

  // Sync proxy input with remote value
  useEffect(() => {
    if (proxy.data !== undefined) {
      setProxyInput(proxy.data);
    }
  }, [proxy.data]);

  // Sync strategy input with remote value
  useEffect(() => {
    if (strategy.data !== undefined) {
      setStrategyInput(strategy.data);
    }
  }, [strategy.data]);

  return (
    <div className="space-y-4">
      {/* General */}
      <Section title={t("settings.general")}>
        <ToggleRow
          label={t("settings.debug")}
          description={t("settings.debugDesc")}
          checked={debugSetting.data ?? false}
          onToggle={debugSetting.toggle}
          disabled={debugSetting.isLoading}
        />
        <ToggleRow
          label={t("settings.forceModelPrefix")}
          description={t("settings.forceModelPrefixDesc")}
          checked={forceModelPrefix.data ?? false}
          onToggle={forceModelPrefix.toggle}
          disabled={forceModelPrefix.isLoading}
        />
        <ToggleRow
          label={t("settings.wsAuth")}
          description={t("settings.wsAuthDesc")}
          checked={wsAuth.data ?? false}
          onToggle={wsAuth.toggle}
          disabled={wsAuth.isLoading}
        />
        <ToggleRow
          label={t("settings.usageStatistics")}
          description={t("settings.usageStatisticsDesc")}
          checked={usageStats.data ?? false}
          onToggle={usageStats.toggle}
          disabled={usageStats.isLoading}
        />
      </Section>

      {/* Logging */}
      <Section title={t("settings.logging")}>
        <ToggleRow
          label={t("settings.loggingToFile")}
          description={t("settings.loggingToFileDesc")}
          checked={loggingToFile.data ?? false}
          onToggle={loggingToFile.toggle}
          disabled={loggingToFile.isLoading}
        />
        <ToggleRow
          label={t("settings.requestLog")}
          description={t("settings.requestLogDesc")}
          checked={requestLogSetting.data ?? false}
          onToggle={requestLogSetting.toggle}
          disabled={requestLogSetting.isLoading}
        />
        <NumberRow
          label={t("settings.logsMaxSize")}
          description={t("settings.logsMaxSizeDesc")}
          value={logsMaxSize.data ?? 0}
          onChange={logsMaxSize.set}
          disabled={logsMaxSize.isLoading}
        />
        <NumberRow
          label={t("settings.errorLogsMaxFiles")}
          description={t("settings.errorLogsMaxFilesDesc")}
          value={errorLogsMax.data ?? 0}
          onChange={errorLogsMax.set}
          disabled={errorLogsMax.isLoading}
        />
      </Section>

      {/* Network */}
      <Section title={t("settings.network")}>
        <NumberRow
          label={t("settings.requestRetry")}
          description={t("settings.requestRetryDesc")}
          value={retryCount.data ?? 0}
          onChange={retryCount.set}
          disabled={retryCount.isLoading}
        />
        <NumberRow
          label={t("settings.maxRetryInterval")}
          description={t("settings.maxRetryIntervalDesc")}
          value={retryInterval.data ?? 0}
          onChange={retryInterval.set}
          disabled={retryInterval.isLoading}
        />

        {/* Routing strategy */}
        <div className="py-2.5">
          <p className="text-[13px] font-medium text-foreground">
            {t("settings.routingStrategy")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.routingStrategyDesc")}
          </p>
          <div className="flex gap-2 mt-1.5">
            <input
              className={inputStyles}
              value={strategyInput}
              onChange={(e) => setStrategyInput(e.target.value)}
              placeholder="round-robin"
            />
            <button
              className={getButtonClass("outline", "sm")}
              onClick={() => strategy.set(strategyInput)}
              disabled={strategy.mutation.isPending}
            >
              {t("common.save")}
            </button>
          </div>
        </div>

        {/* Proxy URL */}
        <div className="py-2.5">
          <p className="text-[13px] font-medium text-foreground">
            {t("settings.proxyUrl")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.proxyUrlDesc")}
          </p>
          <div className="flex gap-2 mt-1.5">
            <input
              className={inputStyles}
              value={proxyInput}
              onChange={(e) => setProxyInput(e.target.value)}
              placeholder="https://proxy.example.com"
            />
            <button
              className={getButtonClass("outline", "sm")}
              onClick={() => proxy.set(proxyInput)}
              disabled={proxy.setMutation.isPending}
            >
              {t("common.save")}
            </button>
            {proxy.data && (
              <button
                className={getButtonClass("ghost", "sm")}
                onClick={() => proxy.remove()}
                disabled={proxy.deleteMutation.isPending}
              >
                {t("common.delete")}
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* Quota Exceeded */}
      <Section title={t("settings.quotaExceeded")}>
        <ToggleRow
          label={t("settings.switchProject")}
          description={t("settings.switchProjectDesc")}
          checked={switchProject.data ?? false}
          onToggle={switchProject.toggle}
          disabled={switchProject.isLoading}
        />
        <ToggleRow
          label={t("settings.switchPreviewModel")}
          description={t("settings.switchPreviewModelDesc")}
          checked={switchPreview.data ?? false}
          onToggle={switchPreview.toggle}
          disabled={switchPreview.isLoading}
        />
      </Section>

      {/* Account */}
      <Section title={t("settings.account")}>
        <div className="py-2.5">
          <p className="text-[13px] text-muted-foreground">
            {t("settings.latestVersion")}:{" "}
            <span className="font-medium text-foreground">
              {version.data?.["latest-version"] ?? "—"}
            </span>
          </p>
        </div>
        <div className="py-2.5">
          <button
            className={cn(getButtonClass("destructive"), "w-full")}
            onClick={() => {
              useAuthStore.getState().clearApiKey();
              queryClient.clear();
              window.location.reload();
            }}
          >
            {t("auth.logout")}
          </button>
        </div>
      </Section>
    </div>
  );
}
