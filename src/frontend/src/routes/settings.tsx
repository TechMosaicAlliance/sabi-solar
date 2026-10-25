import { useCurrentUser } from "@/hooks/use-current-user";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BellOff,
  ChevronDown,
  ChevronRight,
  Cpu,
  FileText,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Moon,
  Shield,
  Sun,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

type ExpandedSection =
  | "account"
  | "solar"
  | "paired"
  | "appearance"
  | "language"
  | "pushNotifications"
  | "help"
  | "terms"
  | "privacy"
  | "about"
  | null;

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
  { code: "ar", label: "Arabic" },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  ocid: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Divider() {
  return <div className="mx-5 border-t border-border" />;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted-foreground flex-shrink-0">
        {label}
      </span>
      <span className="text-xs text-foreground font-medium text-right break-words max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  ocid,
  isExpanded,
  onToggle,
  children,
}: SettingsRowProps) {
  return (
    <div>
      <button
        type="button"
        data-ocid={ocid}
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <span className="flex-1 text-sm font-medium text-foreground text-left">
          {label}
        </span>
        <ChevronRight
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>
      {isExpanded && (
        <div className="px-5 pb-4">
          <div className="bg-muted/40 rounded-2xl p-4">{children}</div>
        </div>
      )}
    </div>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearUser } = useCurrentUser();
  const [expanded, setExpanded] = useState<ExpandedSection>(null);

  // ── Appearance (dark/light mode) ──────────────────────────────────
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
    } catch {
      /* ignore */
    }
    return document.documentElement.classList.contains("dark");
  });

  // ── Language ─────────────────────────────────────────────────────
  const [language, setLanguage] = useState<LangCode>(() => {
    try {
      return (localStorage.getItem("lang") as LangCode) || "en";
    } catch {
      return "en";
    }
  });

  // ── Push notifications toggle ─────────────────────────────────────
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("pushNotifications");
      return stored !== null ? stored === "true" : true;
    } catch {
      return true;
    }
  });

  // Apply theme immediately on change
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  if (!isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const solar = MOCK_PROPERTIES[0];

  function toggle(section: Exclude<ExpandedSection, null>) {
    setExpanded((prev) => (prev === section ? null : section));
  }

  function handleLogout() {
    clearUser();
    navigate({ to: "/" });
  }

  function handleLanguageChange(code: LangCode) {
    setLanguage(code);
    try {
      localStorage.setItem("lang", code);
    } catch {
      /* ignore */
    }
  }

  function handlePushToggle() {
    const next = !pushEnabled;
    setPushEnabled(next);
    try {
      localStorage.setItem("pushNotifications", String(next));
    } catch {
      /* ignore */
    }
  }

  const selectedLang =
    LANGUAGES.find((l) => l.code === language)?.label ?? "English";

  return (
    <div data-ocid="settings.page" className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold text-foreground font-display">
            Settings
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Profile card */}
        <div className="mx-4 mt-5 bg-card border border-border rounded-2xl px-4 py-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <User size={24} className="text-primary" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground font-display truncate">
              {user?.name ?? "Sabi Solar User"}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {user?.email ?? user?.phone ?? "—"}
            </p>
          </div>
        </div>

        {/* Settings list */}
        <div className="mx-4 mt-4 bg-card border border-border rounded-2xl overflow-hidden">
          {/* Account */}
          <SettingsRow
            icon={<User size={18} className="text-primary" />}
            label="Account"
            ocid="settings.account_row"
            isExpanded={expanded === "account"}
            onToggle={() => toggle("account")}
          >
            {user && (
              <div className="space-y-2.5">
                <DetailRow label="Name" value={user.name} />
                <DetailRow label="Email" value={user.email || "—"} />
                <DetailRow label="Phone" value={user.phone || "—"} />
                {user.gender && (
                  <DetailRow label="Gender" value={user.gender} />
                )}
                {user.dob && (
                  <DetailRow label="Date of Birth" value={user.dob} />
                )}
                <button
                  type="button"
                  data-ocid="settings.edit_account_button"
                  className="mt-2 w-full py-2 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </SettingsRow>

          <Divider />

          {/* Solar Details */}
          <SettingsRow
            icon={<Zap size={18} className="text-primary" />}
            label="Solar Details"
            ocid="settings.solar_row"
            isExpanded={expanded === "solar"}
            onToggle={() => toggle("solar")}
          >
            <div className="space-y-2.5">
              <DetailRow label="Model Number" value={solar.modelNumber} />
              <DetailRow label="Capacity" value={`${solar.capacityKva} kVA`} />
              <DetailRow label="Meter Number" value={solar.meterNumber} />
              <DetailRow label="Address" value={solar.address} />
              <DetailRow label="House Type" value="Residential" />
            </div>
          </SettingsRow>

          <Divider />

          {/* Paired Solar Panel */}
          <SettingsRow
            icon={<Cpu size={18} className="text-primary" />}
            label="Paired Solar Panel"
            ocid="settings.paired_row"
            isExpanded={expanded === "paired"}
            onToggle={() => toggle("paired")}
          >
            <div className="space-y-2.5">
              <DetailRow label="Inverter Serial" value={solar.modelNumber} />
              <DetailRow label="Status" value={solar.status} />
              <DetailRow label="Meter Number" value={solar.meterNumber} />
            </div>
          </SettingsRow>

          <Divider />

          {/* Appearance */}
          <div>
            <button
              type="button"
              data-ocid="settings.appearance_row"
              onClick={() => toggle("appearance")}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                {isDark ? (
                  <Moon size={18} className="text-primary" />
                ) : (
                  <Sun size={18} className="text-primary" />
                )}
              </div>
              <span className="flex-1 text-sm font-medium text-foreground text-left">
                Appearance
              </span>
              <span className="text-xs text-muted-foreground mr-1">
                {isDark ? "Dark" : "Light"}
              </span>
              <ChevronRight
                size={16}
                className={`text-muted-foreground transition-transform duration-200 ${
                  expanded === "appearance" ? "rotate-90" : ""
                }`}
              />
            </button>
            {expanded === "appearance" && (
              <div className="px-5 pb-4">
                <div className="bg-muted/40 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Choose your preferred display theme
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      data-ocid="settings.theme.dark_button"
                      onClick={() => setIsDark(true)}
                      className={[
                        "flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors duration-200",
                        isDark
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40",
                      ].join(" ")}
                    >
                      <Moon size={20} />
                      Dark Mode
                    </button>
                    <button
                      type="button"
                      data-ocid="settings.theme.light_button"
                      onClick={() => setIsDark(false)}
                      className={[
                        "flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors duration-200",
                        !isDark
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40",
                      ].join(" ")}
                    >
                      <Sun size={20} />
                      Day Mode
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* Language */}
          <div>
            <button
              type="button"
              data-ocid="settings.language_row"
              onClick={() => toggle("language")}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Globe size={18} className="text-primary" />
              </div>
              <span className="flex-1 text-sm font-medium text-foreground text-left">
                Language
              </span>
              <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
                {selectedLang}
                <ChevronDown size={13} className="text-muted-foreground" />
              </span>
            </button>
            {expanded === "language" && (
              <div className="px-5 pb-4">
                <div className="bg-muted/40 rounded-2xl p-2 flex flex-col gap-0.5">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      data-ocid={`settings.language.${lang.code}`}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={[
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                        language === lang.code
                          ? "bg-primary/15 text-primary"
                          : "text-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      {lang.label}
                      {language === lang.code && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* Push Notifications toggle */}
          <div>
            <button
              type="button"
              data-ocid="settings.push_notifications_row"
              onClick={handlePushToggle}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                {pushEnabled ? (
                  <Bell size={18} className="text-primary" />
                ) : (
                  <BellOff size={18} className="text-muted-foreground" />
                )}
              </div>
              <span className="flex-1 text-sm font-medium text-foreground text-left">
                Push Notifications
              </span>
              {/* Toggle pill */}
              <div
                data-ocid="settings.push_notifications_toggle"
                className={[
                  "relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0",
                  pushEnabled ? "bg-primary" : "bg-muted-foreground/30",
                ].join(" ")}
                aria-checked={pushEnabled}
                role="switch"
                aria-label="Toggle push notifications"
                tabIndex={0}
              >
                <span
                  className={[
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300",
                    pushEnabled ? "translate-x-5" : "translate-x-0.5",
                  ].join(" ")}
                />
              </div>
            </button>
          </div>

          <Divider />

          {/* Help & Support */}
          <SettingsRow
            icon={<HelpCircle size={18} className="text-muted-foreground" />}
            label="Help & Support"
            ocid="settings.help_row"
            isExpanded={expanded === "help"}
            onToggle={() => toggle("help")}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              Need help? Contact our support team at{" "}
              <span className="text-primary font-medium">
                support@sabisolar.com
              </span>{" "}
              or visit our help centre for FAQs and setup guides.
            </p>
          </SettingsRow>

          <Divider />

          {/* Terms & Conditions */}
          <SettingsRow
            icon={<FileText size={18} className="text-muted-foreground" />}
            label="Terms & Conditions"
            ocid="settings.terms_row"
            isExpanded={expanded === "terms"}
            onToggle={() => toggle("terms")}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              By using Sabi Solar, you agree to our Terms of Service. We reserve
              the right to modify these terms at any time. Continued use of the
              app constitutes your acceptance of any changes.
            </p>
          </SettingsRow>

          <Divider />

          {/* Privacy Policy */}
          <SettingsRow
            icon={<Shield size={18} className="text-muted-foreground" />}
            label="Privacy Policy"
            ocid="settings.privacy_row"
            isExpanded={expanded === "privacy"}
            onToggle={() => toggle("privacy")}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sabi Solar collects energy usage data solely to provide the
              monitoring service. We do not sell your data to third parties. You
              may request deletion at any time via support@sabisolar.com.
            </p>
          </SettingsRow>

          <Divider />

          {/* About */}
          <SettingsRow
            icon={<Info size={18} className="text-muted-foreground" />}
            label="About"
            ocid="settings.about_row"
            isExpanded={expanded === "about"}
            onToggle={() => toggle("about")}
          >
            <div className="space-y-2.5">
              <DetailRow label="App Version" value="v1.0.0" />
              <DetailRow label="Build" value="2024.12" />
              <p className="text-xs text-muted-foreground pt-1">
                Sabi Solar — Remote energy monitoring for Nigerian homes and
                businesses.
              </p>
              <p className="text-xs text-muted-foreground">
                Sabi Solar © {new Date().getFullYear()}. All rights reserved.
              </p>
            </div>
          </SettingsRow>

          <Divider />

          {/* Logout */}
          <button
            type="button"
            data-ocid="settings.logout_button"
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-destructive/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <LogOut size={18} className="text-destructive" />
            </div>
            <span className="flex-1 text-sm font-semibold text-destructive text-left">
              Logout
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
