import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/empty-dashboard")({
  component: EmptyDashboardPage,
});

function EmptyDashboardPage() {
  const navigate = useNavigate();

  return (
    <div
      data-ocid="empty_dashboard.page"
      className="min-h-screen bg-background flex flex-col items-center justify-between overflow-hidden"
    >
      {/* Top brand strip */}
      <div className="w-full px-6 pt-10 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap size={18} className="text-primary" strokeWidth={2.2} />
          </div>
          <span className="text-base font-bold text-foreground font-display tracking-tight">
            Sabi Solar
          </span>
        </div>
      </div>

      {/* Illustrated landscape SVG */}
      <div
        data-ocid="empty_dashboard.illustration"
        className="w-full flex-1 flex items-center justify-center px-4 py-6"
      >
        <svg
          viewBox="0 0 400 300"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-sm"
          aria-label="Landscape with wind turbines"
          role="img"
        >
          {/* Sky gradient */}
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1b3e" />
              <stop offset="55%" stopColor="#1a3a5c" />
              <stop offset="100%" stopColor="#2a5a4a" />
            </linearGradient>
            <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e7a4a" />
              <stop offset="100%" stopColor="#145534" />
            </linearGradient>
            <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#25904e" />
              <stop offset="100%" stopColor="#1a6638" />
            </linearGradient>
            <linearGradient id="hill3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2ecc71" />
              <stop offset="100%" stopColor="#1e9950" />
            </linearGradient>
            <radialGradient id="sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#ffa500" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sky */}
          <rect width="400" height="300" fill="url(#sky)" />

          {/* Sun glow */}
          <circle cx="320" cy="65" r="36" fill="url(#sun)" opacity="0.7" />
          <circle
            cx="320"
            cy="65"
            r="18"
            fill="#ffd700"
            opacity="0.9"
            filter="url(#glow)"
          />

          {/* Stars/dots in sky */}
          <circle cx="40" cy="30" r="1.2" fill="#ffffff" opacity="0.7" />
          <circle cx="80" cy="18" r="1" fill="#ffffff" opacity="0.5" />
          <circle cx="130" cy="40" r="0.8" fill="#ffffff" opacity="0.6" />
          <circle cx="180" cy="22" r="1.2" fill="#ffffff" opacity="0.4" />
          <circle cx="220" cy="50" r="0.8" fill="#ffffff" opacity="0.5" />
          <circle cx="260" cy="28" r="1" fill="#ffffff" opacity="0.3" />
          <circle cx="62" cy="55" r="0.8" fill="#ffffff" opacity="0.4" />
          <circle cx="150" cy="12" r="0.7" fill="#ffffff" opacity="0.6" />

          {/* Clouds */}
          <ellipse
            cx="70"
            cy="70"
            rx="40"
            ry="14"
            fill="#ffffff"
            opacity="0.08"
          />
          <ellipse
            cx="90"
            cy="63"
            rx="28"
            ry="11"
            fill="#ffffff"
            opacity="0.07"
          />
          <ellipse
            cx="200"
            cy="45"
            rx="35"
            ry="12"
            fill="#ffffff"
            opacity="0.06"
          />
          <ellipse
            cx="215"
            cy="38"
            rx="22"
            ry="9"
            fill="#ffffff"
            opacity="0.05"
          />

          {/* Back hill */}
          <path
            d="M0 240 Q80 170 160 195 Q240 220 320 185 Q370 168 400 180 L400 300 L0 300 Z"
            fill="url(#hill1)"
            opacity="0.7"
          />

          {/* Mid hill */}
          <path
            d="M0 260 Q60 210 140 225 Q220 240 290 210 Q350 192 400 210 L400 300 L0 300 Z"
            fill="url(#hill2)"
          />

          {/* Front hill */}
          <path
            d="M0 280 Q100 250 200 265 Q300 278 400 258 L400 300 L0 300 Z"
            fill="url(#hill3)"
          />

          {/* ── Wind Turbine 1 (left, tall) ── */}
          {/* Pole */}
          <line
            x1="68"
            y1="185"
            x2="68"
            y2="255"
            stroke="#c8e6c9"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Nacelle */}
          <rect x="63" y="181" width="10" height="7" rx="2" fill="#a5d6a7" />
          {/* Blades */}
          <line
            x1="68"
            y1="184"
            x2="68"
            y2="148"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="68"
            y1="184"
            x2="100"
            y2="204"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="68"
            y1="184"
            x2="36"
            y2="204"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="68" cy="184" r="3.5" fill="#2ecc71" />

          {/* ── Wind Turbine 2 (center-left) ── */}
          <line
            x1="165"
            y1="178"
            x2="165"
            y2="235"
            stroke="#c8e6c9"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="160" y="174" width="10" height="7" rx="2" fill="#a5d6a7" />
          <line
            x1="165"
            y1="177"
            x2="165"
            y2="144"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="165"
            y1="177"
            x2="195"
            y2="196"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="165"
            y1="177"
            x2="135"
            y2="196"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="165" cy="177" r="3.5" fill="#2ecc71" />

          {/* ── Wind Turbine 3 (center-right) ── */}
          <line
            x1="258"
            y1="172"
            x2="258"
            y2="228"
            stroke="#c8e6c9"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="253" y="168" width="10" height="7" rx="2" fill="#a5d6a7" />
          <line
            x1="258"
            y1="171"
            x2="258"
            y2="138"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="258"
            y1="171"
            x2="288"
            y2="190"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="258"
            y1="171"
            x2="228"
            y2="190"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="258" cy="171" r="3.5" fill="#2ecc71" />

          {/* ── Wind Turbine 4 (far right) ── */}
          <line
            x1="352"
            y1="168"
            x2="352"
            y2="220"
            stroke="#c8e6c9"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="347" y="164" width="10" height="7" rx="2" fill="#a5d6a7" />
          <line
            x1="352"
            y1="167"
            x2="352"
            y2="136"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="352"
            y1="167"
            x2="380"
            y2="185"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="352"
            y1="167"
            x2="324"
            y2="185"
            stroke="#81c784"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="352" cy="167" r="3.5" fill="#2ecc71" />

          {/* Foreground grass details */}
          <path
            d="M20 295 Q25 285 30 295"
            stroke="#2ecc71"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M50 298 Q55 288 60 298"
            stroke="#27ae60"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M120 292 Q125 282 130 292"
            stroke="#2ecc71"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M200 290 Q205 280 210 290"
            stroke="#27ae60"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M280 293 Q285 283 290 293"
            stroke="#2ecc71"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M350 291 Q355 281 360 291"
            stroke="#27ae60"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Bottom content */}
      <div className="w-full max-w-sm mx-auto px-6 pb-12 flex flex-col items-center gap-4 text-center">
        <h1
          data-ocid="empty_dashboard.heading"
          className="text-2xl font-bold text-foreground font-display leading-tight"
        >
          No Data Found
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
          Connect your solar system to start monitoring your energy in real
          time.
        </p>

        <button
          type="button"
          data-ocid="empty_dashboard.connect_button"
          onClick={() => navigate({ to: "/connect-solar" })}
          className="mt-2 w-full flex items-center justify-center gap-2.5 py-4 rounded-full bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/25"
        >
          <Zap size={20} strokeWidth={2.2} />
          Connect Solar
        </button>
      </div>
    </div>
  );
}
