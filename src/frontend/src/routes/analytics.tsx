import { useCurrentUser } from "@/hooks/use-current-user";
import { generateMockEnergyData } from "@/lib/mock-data";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
});

type Period = "Day" | "Week" | "Month";

interface DataPoint {
  label: string;
  solar: number;
  consumption: number;
}

function buildDayData(): DataPoint[] {
  return generateMockEnergyData(24).map((d) => ({
    label: d.hour,
    solar: d.solar,
    consumption: d.grid,
  }));
}

function buildWeekData(): DataPoint[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((label) => ({
    label,
    solar: Number.parseFloat((Math.random() * 18 + 8).toFixed(2)),
    consumption: Number.parseFloat((Math.random() * 14 + 6).toFixed(2)),
  }));
}

function buildMonthData(): DataPoint[] {
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    return {
      label: day % 5 === 1 ? `${day}` : "",
      solar: Number.parseFloat((Math.random() * 20 + 6).toFixed(2)),
      consumption: Number.parseFloat((Math.random() * 16 + 5).toFixed(2)),
    };
  });
}

const PERIODS: Period[] = ["Day", "Week", "Month"];

// Custom tooltip shared by both charts
function ChartTooltip({
  active,
  payload,
  label,
  color,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  color: string;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold" style={{ color }}>
        {payload[0].value} {unit}
      </p>
    </div>
  );
}

interface EnergyChartProps {
  data: DataPoint[];
  dataKey: "solar" | "consumption";
  title: string;
  color: string;
  unit: string;
}

function EnergyChart({ data, dataKey, title, color, unit }: EnergyChartProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            unit={` ${unit}`}
          />
          <Tooltip
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload as Array<{ value: number }>}
                label={props.label as string}
                color={color}
                unit={unit}
              />
            )}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function AnalyticsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();

  const [period, setPeriod] = useState<Period>("Day");

  const data = useMemo(() => {
    if (period === "Day") return buildDayData();
    if (period === "Week") return buildWeekData();
    return buildMonthData();
  }, [period]);

  const stats = useMemo(() => {
    const totalGenerated = data.reduce((s, d) => s + d.solar, 0);
    const totalConsumed = data.reduce((s, d) => s + d.consumption, 0);
    const netSavings = totalGenerated - totalConsumed;
    return {
      generated: totalGenerated.toFixed(1),
      consumed: totalConsumed.toFixed(1),
      savings: netSavings.toFixed(1),
      savingsPositive: netSavings >= 0,
    };
  }, [data]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const EMERALD = "oklch(0.65 0.19 142)";
  const AMBER = "oklch(0.72 0.22 33)";

  return (
    <div data-ocid="analytics.page" className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-5 pt-14 pb-5">
        <h1 className="text-2xl font-bold text-foreground font-display">
          Energy Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your solar performance
        </p>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Period selector */}
        <div
          data-ocid="analytics.period_selector"
          className="flex bg-muted rounded-2xl p-1 gap-1"
          role="tablist"
          aria-label="Select period"
        >
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={period === p}
              data-ocid={`analytics.period.${p.toLowerCase()}`}
              onClick={() => setPeriod(p)}
              className={[
                "flex-1 py-2 rounded-xl text-sm font-semibold transition-smooth",
                period === p
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Generation chart */}
        <EnergyChart
          data={data}
          dataKey="solar"
          title="⚡ Energy Generated by Solar"
          color={EMERALD}
          unit="kWh"
        />

        {/* Consumption chart */}
        <EnergyChart
          data={data}
          dataKey="consumption"
          title="🔌 Energy Consumed from Grid"
          color={AMBER}
          unit="kWh"
        />

        {/* Summary stats */}
        <div data-ocid="analytics.summary" className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl border border-border p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground">Generated</span>
            </div>
            <p
              data-ocid="analytics.stat.generated"
              className="text-lg font-bold text-foreground font-mono"
            >
              {stats.generated}
            </p>
            <p className="text-xs text-muted-foreground">kWh</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <TrendingDown size={14} style={{ color: AMBER }} />
              <span className="text-xs text-muted-foreground">Consumed</span>
            </div>
            <p
              data-ocid="analytics.stat.consumed"
              className="text-lg font-bold text-foreground font-mono"
            >
              {stats.consumed}
            </p>
            <p className="text-xs text-muted-foreground">kWh</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground">Net Saved</span>
            </div>
            <p
              data-ocid="analytics.stat.savings"
              className={[
                "text-lg font-bold font-mono",
                stats.savingsPositive ? "text-primary" : "text-destructive",
              ].join(" ")}
            >
              {stats.savingsPositive ? "+" : ""}
              {stats.savings}
            </p>
            <p className="text-xs text-muted-foreground">kWh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
