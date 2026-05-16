import { useCurrentUser } from "@/hooks/use-current-user";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import type { Property } from "@/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Hash,
  Home,
  MapPin,
  Pencil,
  Plus,
  QrCode,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/property")({ component: PropertyPage });

// ─── Types ────────────────────────────────────────────────────────────────────
interface AddPropertyForm {
  title: string;
  address: string;
  meterNumber: string;
  capacityKva: number;
  houseType: string;
}

interface AddSolarForm {
  modelNumber: string;
  capacityKva: number;
  meterNumber: string;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Property["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        status === "Online"
          ? "bg-primary/15 text-primary"
          : "bg-destructive/15 text-destructive"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "Online" ? "bg-primary animate-pulse" : "bg-destructive"
        }`}
      />
      {status}
    </span>
  );
}

// ─── QR Scanner Modal ─────────────────────────────────────────────────────────
interface QrScannerModalProps {
  onMockScan: (value: string) => void;
  onClose: () => void;
}

function QrScannerModal({ onMockScan, onClose }: QrScannerModalProps) {
  return (
    <div
      data-ocid="qr_scanner.dialog"
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (
          e.target === e.currentTarget &&
          (e.key === "Enter" || e.key === " ")
        )
          onClose();
      }}
    >
      <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-sm flex flex-col items-center gap-5">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-base font-semibold text-foreground font-display">
            Scan QR Code
          </h3>
          <button
            type="button"
            data-ocid="qr_scanner.close_button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors duration-200"
            aria-label="Close QR scanner"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scan frame */}
        <div className="relative w-[280px] h-[280px] bg-black rounded-2xl overflow-hidden border-2 border-primary/60 flex items-center justify-center">
          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />

          {/* Scan line */}
          <div className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent qr-scanline" />

          {/* Inner hint */}
          <div className="flex flex-col items-center gap-2 opacity-40">
            <QrCode size={56} className="text-primary" strokeWidth={1.2} />
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Point camera at QR code
        </p>

        <button
          type="button"
          data-ocid="qr_scanner.mock_scan_button"
          onClick={() => onMockScan("SUN-3K-PRO")}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors duration-200"
        >
          Use Mock QR
        </button>
      </div>
    </div>
  );
}

// ─── Add Solar Dialog ─────────────────────────────────────────────────────────
interface AddSolarDialogProps {
  propertyTitle: string;
  onClose: () => void;
  onSubmit: (data: AddSolarForm) => void;
}

function AddSolarDialog({
  propertyTitle,
  onClose,
  onSubmit,
}: AddSolarDialogProps) {
  const [showQr, setShowQr] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddSolarForm>();

  const handleMockScan = (value: string) => {
    setValue("modelNumber", value);
    setShowQr(false);
  };

  return (
    <>
      <div
        data-ocid="add_solar.dialog"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-4 sm:pb-0"
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onKeyDown={(e) => {
          if (
            e.target === e.currentTarget &&
            (e.key === "Enter" || e.key === " ")
          )
            onClose();
        }}
      >
        <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-sm flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground font-display">
                Add Solar System
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {propertyTitle}
              </p>
            </div>
            <button
              type="button"
              data-ocid="add_solar.close_button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors duration-200"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Model Number + QR */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="solar-model-number"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Model Number
              </label>
              <div className="flex gap-2">
                <input
                  id="solar-model-number"
                  data-ocid="add_solar.model_number_input"
                  {...register("modelNumber", { required: "Required" })}
                  placeholder="e.g. SUN-3K-PRO"
                  className="flex-1 bg-muted border border-input rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  data-ocid="add_solar.qr_scan_button"
                  onClick={() => setShowQr(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors duration-200"
                  aria-label="Scan QR code"
                >
                  <QrCode size={14} />
                  Scan
                </button>
              </div>
              {errors.modelNumber && (
                <p
                  data-ocid="add_solar.model_number_field_error"
                  className="text-xs text-destructive"
                >
                  {errors.modelNumber.message}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="solar-capacity"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Capacity (kVA)
              </label>
              <input
                id="solar-capacity"
                data-ocid="add_solar.capacity_input"
                type="number"
                step="0.1"
                {...register("capacityKva", {
                  required: "Required",
                  valueAsNumber: true,
                  min: { value: 0.1, message: "Must be > 0" },
                })}
                placeholder="e.g. 5"
                className="bg-muted border border-input rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.capacityKva && (
                <p
                  data-ocid="add_solar.capacity_field_error"
                  className="text-xs text-destructive"
                >
                  {errors.capacityKva.message}
                </p>
              )}
            </div>

            {/* Meter Number */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="solar-meter-number"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Meter Number
              </label>
              <input
                id="solar-meter-number"
                data-ocid="add_solar.meter_number_input"
                {...register("meterNumber", { required: "Required" })}
                placeholder="e.g. MTR-045892"
                className="bg-muted border border-input rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.meterNumber && (
                <p
                  data-ocid="add_solar.meter_field_error"
                  className="text-xs text-destructive"
                >
                  {errors.meterNumber.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              data-ocid="add_solar.submit_button"
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors duration-200 mt-1"
            >
              Link Solar System
            </button>
          </form>
        </div>
      </div>

      {showQr && (
        <QrScannerModal
          onMockScan={handleMockScan}
          onClose={() => setShowQr(false)}
        />
      )}
    </>
  );
}

// ─── Add Property Dialog ──────────────────────────────────────────────────────
interface AddPropertyDialogProps {
  onClose: () => void;
  onSubmit: (data: AddPropertyForm) => void;
}

const HOUSE_TYPES = ["Home", "Office", "Beach House", "Other"] as const;

function AddPropertyDialog({ onClose, onSubmit }: AddPropertyDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPropertyForm>({
    defaultValues: { houseType: "Home" },
  });

  return (
    <div
      data-ocid="add_property.dialog"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (
          e.target === e.currentTarget &&
          (e.key === "Enter" || e.key === " ")
        )
          onClose();
      }}
    >
      <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-sm flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground font-display">
            Add Property
          </h3>
          <button
            type="button"
            data-ocid="add_property.close_button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Property Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="property-title"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Property Name
            </label>
            <input
              id="property-title"
              data-ocid="add_property.name_input"
              {...register("title", { required: "Property name is required" })}
              placeholder="e.g. Main House"
              className="bg-muted border border-input rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.title && (
              <p
                data-ocid="add_property.name_field_error"
                className="text-xs text-destructive"
              >
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="property-address"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Address
            </label>
            <input
              id="property-address"
              data-ocid="add_property.address_input"
              {...register("address", { required: "Address is required" })}
              placeholder="e.g. 14 Adeleke Street, Lekki"
              className="bg-muted border border-input rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.address && (
              <p
                data-ocid="add_property.address_field_error"
                className="text-xs text-destructive"
              >
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Meter Number */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="property-meter-number"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Meter Number
            </label>
            <input
              id="property-meter-number"
              data-ocid="add_property.meter_input"
              {...register("meterNumber", {
                required: "Meter number is required",
              })}
              placeholder="e.g. MTR-045892"
              className="bg-muted border border-input rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.meterNumber && (
              <p
                data-ocid="add_property.meter_field_error"
                className="text-xs text-destructive"
              >
                {errors.meterNumber.message}
              </p>
            )}
          </div>

          {/* Capacity */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="property-capacity"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Capacity (kVA)
            </label>
            <input
              id="property-capacity"
              data-ocid="add_property.capacity_input"
              type="number"
              step="0.5"
              {...register("capacityKva", {
                required: "Capacity is required",
                valueAsNumber: true,
                min: { value: 0.5, message: "Must be > 0" },
              })}
              placeholder="e.g. 5"
              className="bg-muted border border-input rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.capacityKva && (
              <p
                data-ocid="add_property.capacity_field_error"
                className="text-xs text-destructive"
              >
                {errors.capacityKva.message}
              </p>
            )}
          </div>

          {/* House Type */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="property-house-type"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              House Type
            </label>
            <select
              id="property-house-type"
              data-ocid="add_property.house_type_select"
              {...register("houseType")}
              className="bg-muted border border-input rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              {HOUSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            data-ocid="add_property.submit_button"
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors duration-200 mt-1"
          >
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────
interface PropertyCardProps {
  property: Property;
  index: number;
  onDelete: (id: string) => void;
  onAddSolar: (property: Property) => void;
}

function PropertyCard({
  property,
  index,
  onDelete,
  onAddSolar,
}: PropertyCardProps) {
  const handleDelete = () => {
    if (window.confirm("Delete this property?")) {
      onDelete(property.id);
    }
  };

  return (
    <div
      data-ocid={`property.item.${index}`}
      className="bg-card border border-border rounded-3xl overflow-hidden transition-smooth hover:border-primary/30"
    >
      {/* Card header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground font-display truncate">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin
              size={12}
              className="text-muted-foreground flex-shrink-0"
              strokeWidth={1.8}
            />
            <p className="text-xs text-muted-foreground truncate">
              {property.address}
            </p>
          </div>
        </div>
        <StatusBadge status={property.status} />
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-border" />

      {/* Meta row */}
      <div className="px-5 py-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Zap size={12} className="text-primary" strokeWidth={1.8} />
          <span className="text-xs text-muted-foreground">
            {property.capacityKva} kVA
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Hash size={12} className="text-muted-foreground" strokeWidth={1.8} />
          <span className="text-xs text-muted-foreground font-mono">
            {property.modelNumber || "—"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex items-center gap-2">
        <button
          type="button"
          data-ocid={`property.solar_button.${index}`}
          onClick={() => onAddSolar(property)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors duration-200"
        >
          <Plus size={13} />
          Add Solar
        </button>
        <button
          type="button"
          data-ocid={`property.edit_button.${index}`}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/70 text-muted-foreground transition-colors duration-200"
          aria-label="Edit property"
        >
          <Pencil size={14} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          data-ocid={`property.delete_button.${index}`}
          onClick={handleDelete}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors duration-200"
          aria-label="Delete property"
        >
          <Trash2 size={14} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

// ─── Property Page ────────────────────────────────────────────────────────────
function PropertyPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [solarTarget, setSolarTarget] = useState<Property | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleAddProperty = (data: AddPropertyForm) => {
    const newProp: Property = {
      id: String(Date.now()),
      userId: "user-1",
      title: data.title,
      address: data.address,
      meterNumber: data.meterNumber,
      capacityKva: data.capacityKva,
      modelNumber: "",
      status: "Online",
    };
    setProperties((prev) => [...prev, newProp]);
    setShowAddProperty(false);
    toast.success("Property added!");
  };

  const handleDeleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    toast.success("Property removed.");
  };

  const handleAddSolar = (data: AddSolarForm) => {
    if (!solarTarget) return;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === solarTarget.id
          ? {
              ...p,
              modelNumber: data.modelNumber,
              capacityKva: data.capacityKva,
              meterNumber: data.meterNumber,
            }
          : p,
      ),
    );
    setSolarTarget(null);
    toast.success("Solar system linked!");
  };

  return (
    <div data-ocid="property.page" className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground font-display">
            My Properties
          </h1>
          <button
            type="button"
            data-ocid="property.add_property_button"
            onClick={() => setShowAddProperty(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-2xl hover:bg-primary/90 transition-colors duration-200"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5">
        {/* Summary strip */}
        <div className="flex items-center gap-4 mb-5">
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
              {properties.filter((p) => p.status === "Online").length} Online
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">
              {properties.filter((p) => p.status === "Offline").length} Offline
            </span>
          </div>
        </div>

        {/* Properties list */}
        {properties.length === 0 ? (
          <div
            data-ocid="property.empty_state"
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center">
              <Home
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
            <button
              type="button"
              data-ocid="property.empty_add_button"
              onClick={() => setShowAddProperty(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-2xl hover:bg-primary/90 transition-colors duration-200"
            >
              <Plus size={16} />
              Add Property
            </button>
          </div>
        ) : (
          <div
            ref={listRef}
            data-ocid="property.list"
            className="flex flex-col gap-4"
          >
            {properties.map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={i + 1}
                onDelete={handleDeleteProperty}
                onAddSolar={(p) => setSolarTarget(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Property Dialog */}
      {showAddProperty && (
        <AddPropertyDialog
          onClose={() => setShowAddProperty(false)}
          onSubmit={handleAddProperty}
        />
      )}

      {/* Add Solar Dialog */}
      {solarTarget && (
        <AddSolarDialog
          propertyTitle={solarTarget.title}
          onClose={() => setSolarTarget(null)}
          onSubmit={handleAddSolar}
        />
      )}
    </div>
  );
}
