import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getButtonClass, cardStyles } from "@/lib/ui-styles";
import { useConfig, useConfigYAML, usePutConfigYAML } from "@/hooks/use-config";
import type { Config } from "@/api/types";

const pillBase =
  "inline-flex items-center px-2.5 py-1 rounded-lg ring-1 text-[13px] font-medium tabular-nums";

// Summarize provider counts from config
function ProviderSummary({ config }: { config: Config }) {
  const { t } = useTranslation();
  const providers = [
    { key: "claude", count: config["claude-api-key"]?.length ?? 0 },
    { key: "gemini", count: config["gemini-api-key"]?.length ?? 0 },
    { key: "codex", count: config["codex-api-key"]?.length ?? 0 },
    { key: "vertex", count: config["vertex-api-key"]?.length ?? 0 },
    { key: "openai", count: config["openai-compatibility"]?.length ?? 0 },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {providers.map((p) => (
        <span
          key={p.key}
          className={cn(
            pillBase,
            p.count > 0
              ? "ring-success/30 bg-success/5 text-success"
              : "ring-border/60 text-muted-foreground/60",
          )}
        >
          {t(`config.provider.${p.key}`)} {p.count}
        </span>
      ))}
    </div>
  );
}

export function ConfigPage() {
  const { t } = useTranslation();
  const { data: configData, isLoading: configLoading } = useConfig();
  const { data: yamlData, isLoading: yamlLoading } = useConfigYAML();
  const putYAML = usePutConfigYAML();

  const [yamlText, setYamlText] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (yamlData !== undefined) {
      setYamlText(yamlData);
      setDirty(false);
    }
  }, [yamlData]);

  function handleSave() {
    putYAML.mutate(yamlText, {
      onSuccess: () => {
        setDirty(false);
      },
    });
  }

  function handleReset() {
    if (yamlData !== undefined) {
      setYamlText(yamlData);
      setDirty(false);
    }
  }

  if (configLoading || yamlLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-[13px] text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Row 1: Provider summary + actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {configData && <ProviderSummary config={configData} />}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={cn(getButtonClass("ghost", "sm"), "gap-1.5")}
            onClick={handleReset}
            disabled={!dirty}
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">{t("config.reset")}</span>
          </button>
          <button
            type="button"
            className={cn(getButtonClass("primary", "sm"), "gap-1.5")}
            onClick={handleSave}
            disabled={!dirty || putYAML.isPending}
          >
            {putYAML.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span className="hidden sm:inline">{t("common.save")}</span>
          </button>
        </div>
      </div>

      {/* Status messages */}
      {putYAML.isSuccess && putYAML.data && (
        <div className="text-[13px] text-success">
          {t("config.saveSuccess")}
          {putYAML.data.changed.length > 0 && (
            <span className="text-muted-foreground ml-2">
              {t("config.changed")}: {putYAML.data.changed.join(", ")}
            </span>
          )}
        </div>
      )}
      {putYAML.isError && (
        <div className="text-[13px] text-destructive">
          {(putYAML.error as Error)?.message || t("config.saveError")}
        </div>
      )}

      {/* Row 2: YAML editor */}
      <div className={cn(cardStyles, "p-0 overflow-hidden")}>
        <textarea
          value={yamlText}
          onChange={(e) => {
            setYamlText(e.target.value);
            setDirty(true);
          }}
          spellCheck={false}
          className={cn(
            "w-full min-h-[60vh] p-4 bg-transparent resize-y",
            "font-mono text-xs text-foreground leading-relaxed",
            "focus:outline-none",
            "placeholder:text-muted-foreground/40",
          )}
          placeholder={t("config.yamlPlaceholder")}
        />
      </div>
    </div>
  );
}
