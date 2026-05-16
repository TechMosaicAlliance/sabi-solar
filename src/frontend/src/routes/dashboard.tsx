import { EnergyCard } from "@/components/ui/EnergyCard";
import { GaugeCircle } from "@/components/ui/GaugeCircle";
import { useCurrentUser } from "@/hooks/use-current-user";
import { MOCK_PROPERTIES, generateMockEnergyData } from "@/lib/mock-data";
import type { EnergySource, HourlyEnergyData, Property } from "@/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Flame,
  Leaf,
  RefreshCw,
  Sun,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

// ─── Chart tooltip ───────────────────────────────────────────────────────────
interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="text-muted-foreground mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value.toFixed(2)} kWh
        </p>
      ))}
    </div>
  );
}

// ─── Property selector ───────────────────────────────────────────────────────
interface PropertySelectorProps {
  properties: Property[];
  selected: Property;
  onChange: (p: Property) => void;
}

function PropertySelector({
  properties,
  selected,
  onChange,
}: PropertySelectorProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        data-ocid="dashboard.property_select"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:border-primary/50 transition-colors duration-200"
      >
        <span
          className={`w-2 h-2 rounded-full ${selected.status === "Online" ? "bg-primary" : "bg-destructive"}`}
        />
        <span className="max-w-[120px] truncate">{selected.title}</span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          data-ocid="dashboard.property_dropdown"
          className="absolute top-full mt-2 right-0 z-50 bg-popover border border-border rounded-2xl shadow-xl overflow-hidden min-w-[200px]"
        >
          {properties.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-muted transition-colors duration-150 ${
                p.id === selected.id
                  ? "text-primary font-medium"
                  : "text-foreground"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  p.status === "Online" ? "bg-primary" : "bg-destructive"
                }`}
              />
              <span className="flex-1 min-w-0 truncate">{p.title}</span>
              {p.status === "Online" ? (
                <Wifi size={12} className="text-primary flex-shrink-0" />
              ) : (
                <WifiOff
                  size={12}
                  className="text-muted-foreground flex-shrink-0"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Source toggle ────────────────────────────────────────────────────────────
interface SourceToggleProps {
  source: EnergySource;
  onToggle: () => void;
}

function SourceToggle({ source, onToggle }: SourceToggleProps) {
  const isSolar = source === "Solar";
  return (
    <div
      data-ocid="dashboard.source_toggle"
      className="flex items-center bg-card border border-border rounded-2xl p-1 gap-1"
    >
      <button
        type="button"
        onClick={() => !isSolar && onToggle()}
        data-ocid="dashboard.solar_tab"
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
          isSolar
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun size={16} strokeWidth={isSolar ? 2.5 : 1.8} />
        Solar
      </button>
      <button
        type="button"
        onClick={() => isSolar && onToggle()}
        data-ocid="dashboard.grid_tab"
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
          !isSolar
            ? "bg-secondary text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Zap size={16} strokeWidth={!isSolar ? 2.5 : 1.8} />
        Grid
      </button>
    </div>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useCurrentUser();

  const [selectedProperty, setSelectedProperty] = useState<Property>(
    MOCK_PROPERTIES[0],
  );
  const [energySource, setEnergySource] = useState<EnergySource>("Solar");
  const [chartData, setChartData] = useState<HourlyEnergyData[]>(() =>
    generateMockEnergyData(24),
  );
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setChartData(generateMockEnergyData(24));
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 400);
  }, []);

  // Auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  if (!isAuthenticated) return null;

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.name?.split(" ")[0] ?? "there";

  // Reduced chart data: every 3 hours for clean axis
  const filteredChartData = chartData.filter((_, i) => i % 3 === 0);

  return (
    <div
      data-ocid="dashboard.page"
      className="min-h-screen bg-background pb-24"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{today}</p>
            <h1 className="text-base font-semibold text-foreground font-display leading-tight">
              {greeting()}, {displayName} 👋
            </h1>
          </div>
          <PropertySelector
            properties={MOCK_PROPERTIES}
            selected={selectedProperty}
            onChange={setSelectedProperty}
          />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 space-y-5 pt-5">
        {/* ── Gauge + Source toggle ──────────────────────────────────────── */}
        <section
          data-ocid="dashboard.energy_section"
          className="bg-card border border-border rounded-3xl p-5 flex flex-col items-center gap-5"
        >
          {/* Glow backdrop */}
          <div className="relative flex items-center justify-center w-full">
            <div className="absolute w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
            <GaugeCircle
              percent={73}
              size={200}
              strokeWidth={14}
              label="Energy Available"
              sublabel={
                energySource === "Solar" ? "☀️ Solar Active" : "⚡ Grid Active"
              }
            />
          </div>

          {/* Source toggle */}
          <SourceToggle
            source={energySource}
            onToggle={() =>
              setEnergySource((s) => (s === "Solar" ? "Grid" : "Solar"))
            }
          />

          {/* Property status pill */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                selectedProperty.status === "Online"
                  ? "bg-primary animate-pulse"
                  : "bg-destructive"
              }`}
            />
            {selectedProperty.title} · {selectedProperty.status}
            <span className="text-border">·</span>
            {selectedProperty.capacityKva} kVA
          </div>
        </section>

        {/* ── Metric cards ──────────────────────────────────────────────── */}
        <section
          data-ocid="dashboard.metrics_section"
          className="grid grid-cols-3 gap-3"
        >
          <EnergyCard
            data-ocid="dashboard.metric.consumed"
            icon={Flame}
            label="Consumed"
            value="12.4"
            unit="kWh"
          />
          <EnergyCard
            data-ocid="dashboard.metric.capacity"
            icon={Zap}
            label="Capacity"
            value={selectedProperty.capacityKva.toFixed(1)}
            unit="kVA"
            accent
          />
          <EnergyCard
            data-ocid="dashboard.metric.co2"
            icon={Leaf}
            label="CO₂ Saved"
            value="8.2"
            unit="tCO₂e"
          />
        </section>

        {/* ── 24h bar chart ─────────────────────────────────────────────── */}
        <section
          data-ocid="dashboard.chart_section"
          className="bg-card border border-border rounded-3xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground font-display">
                Solar Generation
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                24-hour overview
              </p>
            </div>
            <button
              type="button"
              onClick={refresh}
              data-ocid="dashboard.refresh_button"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 py-1.5 px-2 rounded-lg hover:bg-primary/10"
              aria-label="Refresh chart data"
            >
              <RefreshCw
                size={13}
                className={isRefreshing ? "animate-spin text-primary" : ""}
              />
              {lastRefresh.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </button>
          </div>

          <div className="w-full" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredChartData}
                barCategoryGap="30%"
                barGap={2}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="hour"
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
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "oklch(var(--muted) / 0.5)", radius: 4 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                  formatter={(value: string) => (
                    <span style={{ color: "oklch(var(--muted-foreground))" }}>
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="solar"
                  name="Solar"
                  fill="oklch(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="grid"
                  name="Grid"
                  fill="oklch(var(--muted-foreground) / 0.35)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── Quick stats strip ─────────────────────────────────────────── */}
        <section
          data-ocid="dashboard.stats_strip"
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sun size={16} className="text-primary" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Peak Solar</p>
              <p className="text-sm font-semibold text-foreground">
                4.2 kWh
                <span className="text-xs font-normal text-primary ml-1">
                  ↑12%
                </span>
              </p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Zap
                size={16}
                className="text-muted-foreground"
                strokeWidth={1.8}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Grid Usage</p>
              <p className="text-sm font-semibold text-foreground">
                1.8 kWh
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  avg/hr
                </span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
