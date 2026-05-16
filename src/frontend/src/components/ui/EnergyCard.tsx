import type { LucideIcon } from "lucide-react";

interface EnergyCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  accent?: boolean;
  className?: string;
  "data-ocid"?: string;
}

export function EnergyCard({
  icon: Icon,
  label,
  value,
  unit,
  accent = false,
  className = "",
  "data-ocid": dataOcid,
}: EnergyCardProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={`rounded-2xl p-4 flex flex-col gap-2 ${
        accent
          ? "bg-primary/10 border border-primary/30"
          : "bg-card border border-border"
      } ${className}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          accent ? "bg-primary/20" : "bg-muted"
        }`}
      >
        <Icon
          size={18}
          className={accent ? "text-primary" : "text-muted-foreground"}
        />
      </div>
      <div className="mt-1">
        <div className="text-2xl font-semibold text-foreground font-display leading-none">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
