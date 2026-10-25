import { MOCK_PROPERTIES, generateMockEnergyData } from "@/lib/mock-data";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { ChevronLeft, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/property-analytics")({
  component: PropertyAnalyticsPage,
});

type Period = "Day" | "Week" | "Month" | "All Time";
const PERIODS: Period[] = ["Day", "Week", "Month", "All Time"];

interface SearchParams {
  id?: string;
}

interface DayRecord {
  date: string;
  gridKwh: number;
  solarKwh: number;
  downtime: number;
}

interface BreakdownData {
  gridUsed: number;
  renewable: number;
  downtime: number;
}

interface ChartPoint {
  label: string;
  value: number;
}

const LAST_7_DAYS: DayRecord[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    gridKwh: Number.parseFloat((Math.random() * 6 + 4).toFixed(1)),
    solarKwh: Number.parseFloat((Math.random() * 10 + 8).toFixed(1)),
    downtime: Number.parseFloat((Math.random() * 1.2).toFixed(1)),
  };
});

function getMockBreakdown(period: Period): BreakdownData {
  const factor =
    period === "Day"
      ? 1
      : period === "Week"
        ? 7
        : period === "Month"
          ? 30
          : 365;
  return {
    gridUsed: Number.parseFloat((8.4 * factor * 0.08).toFixed(1)),
    renewable: Number.parseFloat((14.2 * factor * 0.08).toFixed(1)),
    downtime: Number.parseFloat((0.5 * Math.sqrt(factor)).toFixed(1)),
  };
}

function buildChartData(period: Period): ChartPoint[] {
  if (period === "Day")
    return generateMockEnergyData(24)
      .filter((_, i) => i % 3 === 0)
      .map((d) => ({ label: d.hour, value: d.solar }));
  if (period === "Week")
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
      label,
      value: Number.parseFloat((Math.random() * 18 + 8).toFixed(2)),
    }));
  if (period === "Month")
    return Array.from({ length: 4 }, (_, i) => ({
      label: `Wk ${i + 1}`,
      value: Number.parseFloat((Math.random() * 80 + 50).toFixed(1)),
    }));
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((label) => ({
    label,
    value: Number.parseFloat((Math.random() * 320 + 200).toFixed(1)),
  }));
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-primary">{payload[0].value} kWh</p>
    </div>
  );
}

function PropertyAnalyticsPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as SearchParams;
  const property =
    MOCK_PROPERTIES.find((p) => p.id === search.id) ?? MOCK_PROPERTIES[0];

  const [period, setPeriod] = useState<Period>("Day");
  const [selectedDay, setSelectedDay] = useState<DayRecord | null>(null);

  const breakdown = useMemo(() => getMockBreakdown(period), [period]);
  const chartData = useMemo(() => buildChartData(period), [period]);

  const activeBreakdown: BreakdownData = selectedDay
    ? {
        gridUsed: selectedDay.gridKwh,
        renewable: selectedDay.solarKwh,
        downtime: selectedDay.downtime,
      }
    : breakdown;

  const totalBar = activeBreakdown.gridUsed + activeBreakdown.renewable;
  const gridPct =
    totalBar > 0 ? (activeBreakdown.gridUsed / totalBar) * 100 : 50;
  const renewPct =
    totalBar > 0 ? (activeBreakdown.renewable / totalBar) * 100 : 50;

  const EMERALD = "oklch(0.65 0.19 142)";

  return (
    <div
      data-ocid="property-analytics.page"
      className="min-h-screen bg-background pb-24"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            data-ocid="property-analytics.back_button"
            onClick={() =>
              navigate({
                to: "/property-detail",
                search: { id: property.id },
              })
            }
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-foreground font-display">
              Energy Analytics
            </h1>
            <p className="text-xs text-muted-foreground">{property.title}</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 space-y-5 pt-4">
        {/* ── Period selector ─────────────────────────────────────────── */}
        <div
          data-ocid="property-analytics.period_selector"
          className="flex bg-muted rounded-2xl p-1 gap-1"
          role="tablist"
        >
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={period === p}
              data-ocid={`property-analytics.period.${p.toLowerCase().replace(" ", "-")}`}
              onClick={() => {
                setPeriod(p);
                setSelectedDay(null);
              }}
              className={[
                "flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200",
                period === p
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>

        {/* ── Breakdown metric cards ──────────────────────────────────── */}
        <section
          data-ocid="property-analytics.breakdown_section"
          className="space-y-3"
        >
          {selectedDay && (
            <p className="text-xs text-muted-foreground px-1">
              Showing data for{" "}
              <span className="text-foreground font-medium">
                {selectedDay.date}
              </span>{" "}
              —{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={() => setSelectedDay(null)}
              >
                Reset
              </button>
            </p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-2xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Zap size={13} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Grid Used</span>
              </div>
              <p className="text-xl font-bold text-foreground font-mono">
                {activeBreakdown.gridUsed}
              </p>
              <p className="text-xs text-muted-foreground">kWh</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <TrendingUp size={13} className="text-primary" />
                <span className="text-xs text-muted-foreground">Renewable</span>
              </div>
              <p className="text-xl font-bold text-primary font-mono">
                {activeBreakdown.renewable}
              </p>
              <p className="text-xs text-muted-foreground">kWh</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <TrendingDown size={13} className="text-destructive" />
                <span className="text-xs text-muted-foreground">Downtime</span>
              </div>
              <p className="text-xl font-bold text-foreground font-mono">
                {activeBreakdown.downtime}
              </p>
              <p className="text-xs text-muted-foreground">hours</p>
            </div>
          </div>

          {/* Stacked proportion bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex">
            <div
              className="h-full"
              style={{
                width: `${gridPct}%`,
                background: "oklch(0.72 0.22 33)",
              }}
            />
            <div
              className="h-full"
              style={{
                width: `${renewPct}%`,
                background: EMERALD,
              }}
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: "oklch(0.72 0.22 33)" }}
              />
              Grid {gridPct.toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: EMERALD }}
              />
              Renewable {renewPct.toFixed(0)}%
            </span>
          </div>
        </section>

        {/* ── Generation chart ────────────────────────────────────────── */}
        <section
          data-ocid="property-analytics.generation_chart"
          className="bg-card border border-border rounded-3xl p-5"
        >
          <h2 className="text-sm font-semibold text-foreground font-display mb-4">
            ☀️ Energy from Renewables
          </h2>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              {period === "Day" ? (
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 10,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickCount={4}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" fill={EMERALD} radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 10,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={EMERALD}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: EMERALD, strokeWidth: 0 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── Previous 7 days ─────────────────────────────────────────── */}
        <section
          data-ocid="property-analytics.history_section"
          className="bg-card border border-border rounded-3xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground font-display">
              Previous Days
            </h2>
          </div>
          {LAST_7_DAYS.map((day, idx) => (
            <button
              key={day.date}
              type="button"
              data-ocid={`property-analytics.history_row.${idx + 1}`}
              onClick={() =>
                setSelectedDay(selectedDay?.date === day.date ? null : day)
              }
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                idx < LAST_7_DAYS.length - 1 ? "border-b border-border" : ""
              } ${
                selectedDay?.date === day.date
                  ? "bg-primary/10"
                  : "hover:bg-muted/40"
              }`}
            >
              <span className="text-xs text-muted-foreground w-14 flex-shrink-0">
                {day.date}
              </span>
              <div className="flex-1 grid grid-cols-3 gap-1">
                <span className="text-xs text-foreground">
                  <span className="text-muted-foreground">G: </span>
                  {day.gridKwh} kWh
                </span>
                <span className="text-xs text-primary">
                  <span className="text-muted-foreground">S: </span>
                  {day.solarKwh} kWh
                </span>
                <span className="text-xs text-muted-foreground">
                  {day.downtime}h off
                </span>
              </div>
              <ChevronLeft
                size={14}
                className={`text-muted-foreground rotate-180 transition-transform ${
                  selectedDay?.date === day.date ? "text-primary" : ""
                }`}
              />
            </button>
          ))}
        </section>

        {/* ── Estimates section ───────────────────────────────────────── */}
        <section
          data-ocid="property-analytics.estimates_section"
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-foreground px-1">
            Estimated Generation Value
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { label: "Today", value: "₦1,240", sub: "est." },
                { label: "This Month", value: "₦18,500", sub: "est." },
                { label: "All Time", value: "₦142,000", sub: "total" },
              ] as const
            ).map(({ label, value, sub }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-2xl p-3 flex flex-col gap-1"
              >
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-base font-bold text-primary font-mono leading-tight">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
