interface GaugeCircleProps {
  percent: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function GaugeCircle({
  percent,
  size = 180,
  strokeWidth = 12,
  label,
  sublabel,
  className = "",
}: GaugeCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percent));
  const dashOffset = circumference * (1 - clampedPct / 100);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="oklch(var(--border))"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="oklch(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        {/* Glow effect */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="oklch(var(--primary) / 0.25)"
          strokeWidth={strokeWidth + 6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: "blur(4px)",
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground font-display leading-none">
          {clampedPct}%
        </span>
        {label && (
          <span className="text-xs text-muted-foreground mt-1 text-center px-3">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-xs text-primary font-medium mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
