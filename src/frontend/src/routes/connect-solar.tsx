import { BottomNav } from "@/components/layout/BottomNav";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ChevronLeft, Keyboard, QrCode, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/connect-solar")({
  component: ConnectSolarPage,
});

// ─── Inline QR scanner mock ───────────────────────────────────────────────────
interface InlineQrScannerProps {
  onDetected: (code: string) => void;
}

function InlineQrScanner({ onDetected }: InlineQrScannerProps) {
  const [detected, setDetected] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDetected(true);
      onDetected("SB-2024-MOCK-001");
    }, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onDetected]);

  return (
    <div
      data-ocid="connect_solar.qr_scanner"
      className="flex flex-col items-center gap-3 mt-2"
    >
      {/* Scanner viewport */}
      <div className="relative w-[240px] h-[240px] bg-black rounded-2xl overflow-hidden border-2 border-primary/60 flex items-center justify-center">
        {/* Corner brackets */}
        <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-primary rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-primary rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-primary rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-primary rounded-br-lg" />
        {/* Scanline */}
        {!detected && (
          <div className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent qr-scanline" />
        )}
        {/* Center icon or success */}
        {detected ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2
              size={48}
              className="text-primary"
              strokeWidth={1.5}
            />
            <span className="text-xs text-primary font-semibold">
              Code detected!
            </span>
          </div>
        ) : (
          <QrCode
            size={56}
            className="text-primary opacity-30"
            strokeWidth={1.2}
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {detected ? (
          <span className="text-primary font-medium">
            ✓ Code captured — review below
          </span>
        ) : (
          "Point camera at QR code on the back of your inverter"
        )}
      </p>
    </div>
  );
}

// ─── Connect Solar Page ───────────────────────────────────────────────────────
function ConnectSolarPage() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<"qr" | "manual" | null>(null);
  const [inverterCode, setInverterCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleQrDetected = (code: string) => {
    setInverterCode(code);
  };

  const handleConnect = () => {
    if (!inverterCode.trim()) return;
    setIsConnecting(true);
    setTimeout(() => {
      try {
        sessionStorage.setItem("solarConnected", "true");
      } catch {
        /* ignore */
      }
      navigate({ to: "/dashboard", search: { connected: "true" } });
    }, 1200);
  };

  return (
    <div
      data-ocid="connect_solar.page"
      className="min-h-screen bg-background pb-24"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            data-ocid="connect_solar.back_button"
            onClick={() => navigate({ to: "/empty-dashboard" })}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/70 text-foreground transition-colors duration-200"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="flex-1 text-center text-base font-semibold text-foreground font-display">
            Connect Solar
          </h1>
          {/* Spacer to centre title */}
          <div className="w-9" aria-hidden="true" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Subtitle */}
        <p className="text-sm text-muted-foreground text-center">
          Choose how you'd like to link your inverter
        </p>

        {/* Option cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Scan QR */}
          <button
            type="button"
            data-ocid="connect_solar.scan_qr_card"
            onClick={() => setActiveMode((m) => (m === "qr" ? null : "qr"))}
            className={`flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all duration-200 text-left ${
              activeMode === "qr"
                ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/10"
                : "bg-card border-border hover:border-primary/30"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                activeMode === "qr" ? "bg-primary/20" : "bg-muted"
              }`}
            >
              <QrCode
                size={24}
                className={
                  activeMode === "qr" ? "text-primary" : "text-muted-foreground"
                }
                strokeWidth={1.8}
              />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  activeMode === "qr" ? "text-primary" : "text-foreground"
                }`}
              >
                Scan QR Code
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Point camera at QR on the back of your inverter
              </p>
            </div>
          </button>

          {/* Manual entry */}
          <button
            type="button"
            data-ocid="connect_solar.manual_card"
            onClick={() =>
              setActiveMode((m) => (m === "manual" ? null : "manual"))
            }
            className={`flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all duration-200 text-left ${
              activeMode === "manual"
                ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/10"
                : "bg-card border-border hover:border-primary/30"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                activeMode === "manual" ? "bg-primary/20" : "bg-muted"
              }`}
            >
              <Keyboard
                size={24}
                className={
                  activeMode === "manual"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
                strokeWidth={1.8}
              />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  activeMode === "manual" ? "text-primary" : "text-foreground"
                }`}
              >
                Enter Manually
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Type the serial code from the back of your device
              </p>
            </div>
          </button>
        </div>

        {/* Inline QR scanner */}
        {activeMode === "qr" && (
          <div
            data-ocid="connect_solar.qr_panel"
            className="bg-card border border-border rounded-3xl p-5 flex flex-col items-center"
          >
            <InlineQrScanner onDetected={handleQrDetected} />
          </div>
        )}

        {/* Inverter Code input — always visible */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="inverter-code"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Inverter Code
          </label>
          <input
            id="inverter-code"
            data-ocid="connect_solar.inverter_code_input"
            type="text"
            value={inverterCode}
            onChange={(e) => setInverterCode(e.target.value)}
            placeholder="e.g. SB-2024-XXXX-001"
            className="w-full bg-muted border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          />
        </div>

        {/* Connect button */}
        <button
          type="button"
          data-ocid="connect_solar.connect_button"
          onClick={handleConnect}
          disabled={!inverterCode.trim() || isConnecting}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full bg-primary text-primary-foreground text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
        >
          {isConnecting ? (
            <>
              <svg
                className="animate-spin w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeOpacity="0.25"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Connecting…
            </>
          ) : (
            <>
              <Zap size={20} strokeWidth={2.2} />
              Connect
            </>
          )}
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
