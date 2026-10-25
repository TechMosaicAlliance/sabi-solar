import { useCurrentUser } from "@/hooks/use-current-user";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import type { Property } from "@/types";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Battery,
  Building2,
  ChevronRight,
  Grid3X3,
  Hash,
  List,
  MapPin,
  Plus,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/properties")({
  component: PropertiesPage,
});

type ViewMode = "grid" | "list";

function StatusDot({ status }: { status: Property["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
        status === "Online"
          ? "bg-primary/15 text-primary"
          : "bg-destructive/15 text-destructive"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          status === "Online" ? "bg-primary animate-pulse" : "bg-destructive"
        }`}
      />
      {status}
    </span>
  );
}

function PropertyGridCard({
  property,
  index,
}: { property: Property; index: number }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      data-ocid={`properties.grid_item.${index}`}
      onClick={() => navigate({ to: "/dashboard" })}
      className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 text-left hover:border-primary/40 transition-colors duration-200 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-primary" strokeWidth={1.8} />
        </div>
        <StatusDot status={property.status} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground font-display truncate leading-tight">
          {property.title}
        </p>
        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
          {property.address}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Zap size={11} className="text-primary" strokeWidth={1.8} />
        <span className="text-[11px] text-muted-foreground">
          {property.capacityKva} kVA
        </span>
      </div>
    </button>
  );
}

function PropertyListRow({
  property,
  index,
}: { property: Property; index: number }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      data-ocid={`properties.list_item.${index}`}
      onClick={() => navigate({ to: "/dashboard" })}
      className="w-full bg-card border border-border rounded-2xl px-4 py-4 flex items-center gap-4 text-left hover:border-primary/40 transition-colors duration-200 active:scale-[0.99]"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Building2 size={18} className="text-primary" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground font-display truncate">
          {property.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MapPin
            size={10}
            className="text-muted-foreground flex-shrink-0"
            strokeWidth={1.8}
          />
          <p className="text-xs text-muted-foreground truncate">
            {property.address}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1">
            <Zap size={10} className="text-primary" />
            <span className="text-[11px] text-muted-foreground">
              {property.capacityKva} kVA
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Hash size={10} className="text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-mono">
              {property.modelNumber || "—"}
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <StatusDot status={property.status} />
        {property.status === "Online" ? (
          <Wifi size={13} className="text-primary" />
        ) : (
          <WifiOff size={13} className="text-muted-foreground" />
        )}
      </div>
      <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
    </button>
  );
}

function PropertiesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const properties = MOCK_PROPERTIES;
  const MAX_GRID = 4;
  const visibleProps =
    viewMode === "grid" && !showAll
      ? properties.slice(0, MAX_GRID)
      : properties;
  const hasMore =
    viewMode === "grid" && !showAll && properties.length > MAX_GRID;

  const onlineCount = properties.filter((p) => p.status === "Online").length;

  return (
    <div
      data-ocid="properties.page"
      className="min-h-screen bg-background pb-28"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground font-display">
              My Properties
            </h1>
            <p className="text-xs text-muted-foreground">
              {onlineCount} of {properties.length} online
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-muted rounded-xl p-1 gap-0.5">
              <button
                type="button"
                data-ocid="properties.grid_view_toggle"
                onClick={() => {
                  setViewMode("grid");
                  setShowAll(false);
                }}
                className={`w-8 h-7 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                  viewMode === "grid"
                    ? "bg-card shadow-sm text-primary"
                    : "text-muted-foreground"
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 size={14} />
              </button>
              <button
                type="button"
                data-ocid="properties.list_view_toggle"
                onClick={() => setViewMode("list")}
                className={`w-8 h-7 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                  viewMode === "list"
                    ? "bg-card shadow-sm text-primary"
                    : "text-muted-foreground"
                }`}
                aria-label="List view"
              >
                <List size={14} />
              </button>
            </div>
            <Link
              to="/property"
              data-ocid="properties.add_button"
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-xl hover:bg-primary/90 transition-colors duration-200"
            >
              <Plus size={14} />
              Add
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5">
        {/* Stats strip */}
        <div className="flex items-center gap-4 mb-5 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-foreground font-display">
              {properties.length}
            </span>
            <span className="text-sm text-muted-foreground">Properties</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              {onlineCount} Online
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <Battery size={13} className="text-primary" />
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
        </div>

        {/* Grid view */}
        {viewMode === "grid" && (
          <>
            <div data-ocid="properties.grid" className="grid grid-cols-2 gap-3">
              {visibleProps.map((prop, i) => (
                <PropertyGridCard key={prop.id} property={prop} index={i + 1} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  data-ocid="properties.show_all_button"
                  onClick={() => setShowAll(true)}
                  className="text-xs text-primary font-semibold px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
                >
                  Show all ({properties.length})
                </button>
              </div>
            )}
          </>
        )}

        {/* List view */}
        {viewMode === "list" && (
          <div data-ocid="properties.list" className="flex flex-col gap-3">
            {visibleProps.map((prop, i) => (
              <PropertyListRow key={prop.id} property={prop} index={i + 1} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {properties.length === 0 && (
          <div
            data-ocid="properties.empty_state"
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center">
              <Building2
                size={28}
                className="text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground font-display">
                No properties yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first property to start monitoring.
              </p>
            </div>
            <Link
              to="/property"
              data-ocid="properties.empty_add_button"
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-2xl hover:bg-primary/90 transition-colors duration-200"
            >
              <Plus size={16} />
              Add Property
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
