import {
  MOCK_NOTIFICATIONS,
  MOCK_PROPERTIES,
  generateMockEnergyData,
} from "@/lib/mock-data";
import type { AppNotification } from "@/types";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  Battery,
  BatteryCharging,
  ChevronLeft,
  ChevronRight,
  Info,
  Sun,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/property-detail")({
  component: PropertyDetailPage,
});

interface SearchParams {
  id?: string;
}

// ─── Chart tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
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

// ─── Notification card ────────────────────────────────────────────────────────
function NotifCard({ notif }: { notif: AppNotification }) {
  const isWarning = notif.type === "Warning";
  const timeAgo = (() => {
    const diffMs = Date.now() - notif.createdAt;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  })();

  return (
    <div
      className={`rounded-2xl border p-3 flex gap-3 ${
        isWarning
          ? "bg-destructive/10 border-destructive/30"
          : "bg-card border-border"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isWarning ? "bg-destructive/20" : "bg-primary/10"
        }`}
      >
        {isWarning ? (
          <AlertTriangle size={15} className="text-destructive" />
        ) : (
          <Info size={15} className="text-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-foreground leading-snug">
          {notif.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function PropertyDetailPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as SearchParams;
  const property =
    MOCK_PROPERTIES.find((p) => p.id === search.id) ?? MOCK_PROPERTIES[0];

  const chartData = useMemo(() => {
    const all = generateMockEnergyData(24);
    return all.filter((_, i) => i % 3 === 0);
  }, []);

  const totalSolarToday = useMemo(() => {
    return generateMockEnergyData(24)
      .reduce((s, d) => s + d.solar, 0)
      .toFixed(1);
  }, []);

  const propertyNotifs = MOCK_NOTIFICATIONS.slice(0, 3);
  const gridActive = property.status === "Online";
  const batteryPct = 78;
  const batteryKwh = ((batteryPct / 100) * property.capacityKva).toFixed(1);

  return (
    <div
      data-ocid="property-detail.page"
      className="min-h-screen bg-background pb-24"
    >
      {/* ── Sticky header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            data-ocid="property-detail.back_button"
            onClick={() => navigate({ to: "/properties" })}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-foreground font-display truncate">
              {property.title}
            </h1>
            <p className="text-xs text-muted-foreground">{property.address}</p>
          </div>
          <button
            type="button"
            data-ocid="property-detail.analytics_button"
            onClick={() =>
              navigate({
                to: "/property-analytics",
                search: { id: property.id },
              })
            }
            className="flex items-center gap-1 text-xs text-primary font-medium px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            Analytics <ChevronRight size={13} />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 space-y-4 pt-4">
        {/* ── Current estimate card ─────────────────────────────────────── */}
        <section
          data-ocid="property-detail.estimate_card"
          className="bg-card border border-border rounded-3xl p-5"
        >
          <p className="text-xs text-muted-foreground mb-1">
            {"Today's Usage"}
          </p>
          <p className="text-4xl font-bold text-foreground font-display tracking-tight">
            ₦2,450
          </p>
          <p className="text-xs text-muted-foreground mt-1">Current Estimate</p>
        </section>

        {/* ── Status row ───────────────────────────────────────────────── */}
        <section
          data-ocid="property-detail.status_row"
          className="bg-card border border-border rounded-3xl p-4 flex flex-wrap gap-3 items-center"
        >
          {/* Solar badge */}
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sun size={13} />
            Solar Active
          </span>

          {/* Grid badge */}
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              gridActive
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-muted border-border text-muted-foreground"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                gridActive
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-muted-foreground"
              }`}
            />
            Grid {gridActive ? "Connected" : "Disconnected"}
          </span>

          {/* Discharge rate */}
          <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Zap size={12} className="text-primary" />
            Discharge: 2.3 kW/h
          </span>
        </section>

        {/* ── Consumed + Grid power indicator ──────────────────────────── */}
        <section className="grid grid-cols-2 gap-3">
          {/* Total consumed */}
          <div
            data-ocid="property-detail.consumed_card"
            className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1"
          >
            <p className="text-xs text-muted-foreground">
              Total Consumed Today
            </p>
            <p className="text-2xl font-bold text-foreground font-mono">12.4</p>
            <p className="text-xs text-muted-foreground">kWh since online</p>
          </div>

          {/* Grid power indicator */}
          <div
            data-ocid="property-detail.grid_indicator"
            className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
          >
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                gridActive ? "bg-primary/10" : "bg-destructive/10"
              }`}
            >
              <Zap
                size={18}
                className={gridActive ? "text-primary" : "text-destructive"}
              />
              <span
                className={`text-sm font-bold ${
                  gridActive ? "text-primary" : "text-destructive"
                }`}
              >
                Grid {gridActive ? "ON" : "OFF"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {gridActive ? "Power available" : "No grid power"}
            </p>
          </div>
        </section>

        {/* ── Battery section ───────────────────────────────────────────── */}
        <section
          data-ocid="property-detail.battery_card"
          className="bg-card border border-border rounded-3xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {batteryPct > 20 ? (
                <BatteryCharging size={22} className="text-primary" />
              ) : (
                <Battery size={22} className="text-destructive" />
              )}
              <span className="text-sm font-semibold text-foreground">
                Battery
              </span>
            </div>
            <span
              className={`text-sm font-bold ${
                batteryPct > 50
                  ? "text-primary"
                  : batteryPct > 20
                    ? "text-yellow-400"
                    : "text-destructive"
              }`}
            >
              {batteryPct}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${batteryPct}%`,
                background:
                  batteryPct > 50
                    ? "oklch(var(--primary))"
                    : batteryPct > 20
                      ? "oklch(0.72 0.22 70)"
                      : "oklch(var(--destructive))",
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {batteryKwh} kWh remaining of {property.capacityKva} kWh
            </p>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
              Charging
            </span>
          </div>
        </section>

        {/* ── Notifications ─────────────────────────────────────────────── */}
        <section
          data-ocid="property-detail.notifications_section"
          className="space-y-2"
        >
          <h2 className="text-sm font-semibold text-foreground px-1">
            System Alerts
          </h2>
          {propertyNotifs.map((n) => (
            <NotifCard key={n.id} notif={n} />
          ))}
        </section>

        {/* ── Solar generation section ──────────────────────────────────── */}
        <section
          data-ocid="property-detail.solar_section"
          className="bg-card border border-border rounded-3xl p-5"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-foreground font-display">
              Solar Generation Today
            </h2>
          </div>
          <p className="text-3xl font-bold text-primary font-mono mb-4">
            {totalSolarToday}
            <span className="text-base font-normal text-muted-foreground ml-1">
              kWh
            </span>
          </p>

          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barCategoryGap="30%"
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
                <Bar
                  dataKey="solar"
                  name="Solar"
                  fill="oklch(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
