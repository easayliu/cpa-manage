import { useState, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import * as Switch from "@radix-ui/react-switch";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { cardStyles, inputStyles, getButtonClass } from "@/lib/ui-styles";
import {
  useAmpcodeUpstreamUrl,
  useAmpcodeUpstreamApiKey,
  useAmpcodeRestrictLocalhost,
  useAmpcodeForceModelMappings,
  useAmpcodeModelMappings,
  useAmpcodeUpstreamApiKeys,
} from "@/hooks/use-ampcode";
import type { AmpModelMapping } from "@/api/types";

// Section wrapper
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

// Toggle row (same as settings page)
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

// String setting row with save/delete
function StringRow({
  label,
  description,
  value,
  onSave,
  onDelete,
  saving,
  deleting,
  placeholder,
  type = "text",
}: {
  label: string;
  description?: string;
  value: string;
  onSave: (v: string) => void;
  onDelete?: () => void;
  saving?: boolean;
  deleting?: boolean;
  placeholder?: string;
  type?: string;
}) {
  const { t } = useTranslation();
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className="py-2.5">
      <p className="text-[13px] font-medium text-foreground">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      )}
      <div className="flex gap-2 mt-1.5">
        <input
          type={type}
          className={inputStyles}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder={placeholder}
        />
        <button
          className={getButtonClass("outline", "sm")}
          onClick={() => onSave(local)}
          disabled={saving}
        >
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : t("common.save")}
        </button>
        {onDelete && value && (
          <button
            className={getButtonClass("ghost", "sm")}
            onClick={onDelete}
            disabled={deleting}
          >
            {t("common.delete")}
          </button>
        )}
      </div>
    </div>
  );
}

// Model mappings editor
function ModelMappingsSection() {
  const { t } = useTranslation();
  const mappings = useAmpcodeModelMappings();
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newRegex, setNewRegex] = useState(false);

  const items: AmpModelMapping[] = mappings.data ?? [];

  function handleAdd() {
    if (!newFrom.trim() || !newTo.trim()) return;
    const entry: AmpModelMapping = { from: newFrom.trim(), to: newTo.trim() };
    if (newRegex) entry.regex = true;
    mappings.add([entry]);
    setNewFrom("");
    setNewTo("");
    setNewRegex(false);
  }

  function handleDelete(from: string) {
    mappings.remove([from]);
  }

  return (
    <Section title={t("ampcode.modelMappings")}>
      {items.length > 0 ? (
        <div className="space-y-1 mb-3">
          {items.map((m, i) => (
            <div
              key={`${m.from}-${i}`}
              className="flex items-center gap-2 py-1.5 text-[13px]"
            >
              <span className="font-mono text-xs text-foreground truncate flex-1">
                {m.from}
              </span>
              <span className="text-muted-foreground/40 shrink-0">&rarr;</span>
              <span className="font-mono text-xs text-foreground truncate flex-1">
                {m.to}
              </span>
              {m.regex && (
                <span className="text-[10px] px-1.5 py-0.5 rounded ring-1 ring-border/60 text-muted-foreground">
                  regex
                </span>
              )}
              <button
                type="button"
                className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted/60 hover:text-destructive transition-colors shrink-0"
                onClick={() => handleDelete(m.from)}
                disabled={mappings.deleteMutation.isPending}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/60 py-3">{t("common.noData")}</p>
      )}

      {/* Add new mapping */}
      <div className="flex items-end gap-2 pt-2">
        <div className="flex-1">
          <label className="text-[11px] text-muted-foreground">{t("ampcode.from")}</label>
          <input
            className={inputStyles}
            value={newFrom}
            onChange={(e) => setNewFrom(e.target.value)}
            placeholder="source-model"
          />
        </div>
        <div className="flex-1">
          <label className="text-[11px] text-muted-foreground">{t("ampcode.to")}</label>
          <input
            className={inputStyles}
            value={newTo}
            onChange={(e) => setNewTo(e.target.value)}
            placeholder="target-model"
          />
        </div>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer h-8">
          <input
            type="checkbox"
            checked={newRegex}
            onChange={(e) => setNewRegex(e.target.checked)}
            className="rounded"
          />
          Regex
        </label>
        <button
          type="button"
          className={cn(getButtonClass("outline", "sm"), "gap-1 shrink-0")}
          onClick={handleAdd}
          disabled={!newFrom.trim() || !newTo.trim() || mappings.addMutation.isPending}
        >
          {mappings.addMutation.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          {t("ampcode.add")}
        </button>
      </div>
    </Section>
  );
}

// Upstream API Keys section
function UpstreamApiKeysSection() {
  const { t } = useTranslation();
  const keys = useAmpcodeUpstreamApiKeys();
  const [newUpstreamKey, setNewUpstreamKey] = useState("");
  const [newApiKeys, setNewApiKeys] = useState("");

  const items = keys.data ?? [];

  function handleAdd() {
    if (!newUpstreamKey.trim()) return;
    const apiKeysList = newApiKeys
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    keys.add([{ "upstream-api-key": newUpstreamKey.trim(), "api-keys": apiKeysList }]);
    setNewUpstreamKey("");
    setNewApiKeys("");
  }

  function handleDelete(upstreamKey: string) {
    keys.remove([upstreamKey]);
  }

  return (
    <Section title={t("ampcode.upstreamApiKeys")}>
      {items.length > 0 ? (
        <div className="space-y-1 mb-3">
          {items.map((entry, i) => (
            <div
              key={`${entry["upstream-api-key"]}-${i}`}
              className="flex items-center gap-2 py-1.5 text-[13px]"
            >
              <span className="font-mono text-xs text-foreground truncate flex-1">
                {entry["upstream-api-key"].slice(0, 12)}...
              </span>
              <span className="text-muted-foreground/60 text-xs">
                {entry["api-keys"].length} {t("ampcode.boundKeys")}
              </span>
              <button
                type="button"
                className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted/60 hover:text-destructive transition-colors shrink-0"
                onClick={() => handleDelete(entry["upstream-api-key"])}
                disabled={keys.deleteMutation.isPending}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/60 py-3">{t("common.noData")}</p>
      )}

      {/* Add new entry */}
      <div className="flex items-end gap-2 pt-2">
        <div className="flex-1">
          <label className="text-[11px] text-muted-foreground">
            {t("ampcode.upstreamKey")}
          </label>
          <input
            className={inputStyles}
            value={newUpstreamKey}
            onChange={(e) => setNewUpstreamKey(e.target.value)}
            placeholder="upstream-api-key"
          />
        </div>
        <div className="flex-1">
          <label className="text-[11px] text-muted-foreground">
            {t("ampcode.apiKeysList")}
          </label>
          <input
            className={inputStyles}
            value={newApiKeys}
            onChange={(e) => setNewApiKeys(e.target.value)}
            placeholder="key1, key2, ..."
          />
        </div>
        <button
          type="button"
          className={cn(getButtonClass("outline", "sm"), "gap-1 shrink-0")}
          onClick={handleAdd}
          disabled={!newUpstreamKey.trim() || keys.addMutation.isPending}
        >
          {keys.addMutation.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          {t("ampcode.add")}
        </button>
      </div>
    </Section>
  );
}

export function AmpcodePage() {
  const { t } = useTranslation();
  const upstreamUrl = useAmpcodeUpstreamUrl();
  const upstreamApiKey = useAmpcodeUpstreamApiKey();
  const restrictLocalhost = useAmpcodeRestrictLocalhost();
  const forceModelMappings = useAmpcodeForceModelMappings();

  return (
    <div className="space-y-4">
      {/* General settings */}
      <Section title={t("ampcode.general")}>
        <StringRow
          label={t("ampcode.upstreamUrl")}
          description={t("ampcode.upstreamUrlDesc")}
          value={upstreamUrl.data ?? ""}
          onSave={upstreamUrl.set}
          onDelete={upstreamUrl.remove}
          saving={upstreamUrl.setMutation.isPending}
          deleting={upstreamUrl.deleteMutation.isPending}
          placeholder="https://api.anthropic.com"
        />
        <StringRow
          label={t("ampcode.upstreamApiKey")}
          description={t("ampcode.upstreamApiKeyDesc")}
          value={upstreamApiKey.data ?? ""}
          onSave={upstreamApiKey.set}
          onDelete={upstreamApiKey.remove}
          saving={upstreamApiKey.setMutation.isPending}
          deleting={upstreamApiKey.deleteMutation.isPending}
          placeholder="sk-ant-..."
          type="password"
        />
        <ToggleRow
          label={t("ampcode.restrictLocalhost")}
          description={t("ampcode.restrictLocalhostDesc")}
          checked={restrictLocalhost.data ?? false}
          onToggle={restrictLocalhost.toggle}
          disabled={restrictLocalhost.isLoading}
        />
        <ToggleRow
          label={t("ampcode.forceModelMappings")}
          description={t("ampcode.forceModelMappingsDesc")}
          checked={forceModelMappings.data ?? false}
          onToggle={forceModelMappings.toggle}
          disabled={forceModelMappings.isLoading}
        />
      </Section>

      {/* Model Mappings */}
      <ModelMappingsSection />

      {/* Upstream API Keys */}
      <UpstreamApiKeysSection />
    </div>
  );
}
