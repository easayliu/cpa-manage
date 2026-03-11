import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { cardStyles } from "@/lib/ui-styles";
import type { StatisticsSnapshot } from "@/api/types";

// Chart color tokens
const chartColors = {
  primary: "oklch(0.55 0.18 250)",
  info: "oklch(0.55 0.15 250)",
  success: "oklch(0.55 0.16 145)",
  muted: "oklch(0.88 0.005 250)",
  text: "oklch(0.55 0.01 250)",
};

// Shared tooltip style
const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid oklch(0.88 0.005 250)",
  boxShadow: "0 2px 8px oklch(0 0 0 / 0.08)",
};

// Format "2024-01-15" to "1/15"
function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// Format "2024-01-15T14" to "14:00"
function formatHour(hourStr: string): string {
  const parts = hourStr.split("T");
  return parts[1] ? `${parts[1]}:00` : hourStr;
}

// Transform Record to sorted array, take last N entries
function recordToSorted<T extends Record<string, unknown>>(
  record: Record<string, number>,
  valueKey: string,
  limit?: number,
): T[] {
  const entries = Object.entries(record)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ key, [valueKey]: value }) as T);
  return limit ? entries.slice(-limit) : entries;
}

// Shared chart card wrapper
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(cardStyles)}>
      <h3 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-3">
        {title}
      </h3>
      <div className="h-48">{children}</div>
    </div>
  );
}

export function UsageCharts({ usage }: { usage: StatisticsSnapshot }) {
  const { t } = useTranslation();

  // Chart 1: Daily requests trend (last 30 days)
  const dailyRequests = recordToSorted<{
    key: string;
    requests: number;
  }>(usage.requests_by_day, "requests", 30);

  // Chart 2: Daily tokens trend (last 30 days)
  const dailyTokens = recordToSorted<{
    key: string;
    tokens: number;
  }>(usage.tokens_by_day, "tokens", 30);

  // Chart 3: API distribution
  const apiDistribution = Object.entries(usage.apis)
    .map(([name, snap]) => ({
      name,
      requests: snap.total_requests,
      tokens: snap.total_tokens,
    }))
    .sort((a, b) => b.requests - a.requests);

  // Chart 4: Hourly requests (last 24 hours)
  const hourlyRequests = recordToSorted<{
    key: string;
    requests: number;
  }>(usage.requests_by_hour, "requests", 24);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {dailyRequests.length > 0 && (
        <ChartCard title={t("dashboard.dailyRequests")}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyRequests}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.muted}
                vertical={false}
              />
              <XAxis
                dataKey="key"
                tickFormatter={formatDateShort}
                tick={{ fontSize: 11, fill: chartColors.text }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartColors.text }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label: string) => label}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke={chartColors.primary}
                fill={chartColors.primary}
                fillOpacity={0.1}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {dailyTokens.length > 0 && (
        <ChartCard title={t("dashboard.dailyTokens")}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTokens}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.muted}
                vertical={false}
              />
              <XAxis
                dataKey="key"
                tickFormatter={formatDateShort}
                tick={{ fontSize: 11, fill: chartColors.text }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartColors.text }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label: string) => label}
              />
              <Area
                type="monotone"
                dataKey="tokens"
                stroke={chartColors.info}
                fill={chartColors.info}
                fillOpacity={0.1}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {apiDistribution.length > 0 && (
        <ChartCard title={t("dashboard.apiDistribution")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apiDistribution} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.muted}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: chartColors.text }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: chartColors.text }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="requests"
                fill={chartColors.primary}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {hourlyRequests.length > 0 && (
        <ChartCard title={t("dashboard.hourlyRequests")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyRequests}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.muted}
                vertical={false}
              />
              <XAxis
                dataKey="key"
                tickFormatter={formatHour}
                tick={{ fontSize: 11, fill: chartColors.text }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartColors.text }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={formatHour}
              />
              <Bar
                dataKey="requests"
                fill={chartColors.muted}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
