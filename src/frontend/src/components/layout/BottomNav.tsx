import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Bell, Building2, Home } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", Icon: Home, ocid: "nav.dashboard" },
  { to: "/property", label: "Property", Icon: Building2, ocid: "nav.property" },
  {
    to: "/analytics",
    label: "Analytics",
    Icon: BarChart3,
    ocid: "nav.analytics",
  },
  {
    to: "/notifications",
    label: "Alerts",
    Icon: Bell,
    ocid: "nav.notifications",
  },
] as const;

export function BottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [unreadCount, setUnreadCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("sabi_unread_count");
      return stored !== null ? Number.parseInt(stored, 10) : 2;
    } catch {
      return 2;
    }
  });

  // Sync unread count from localStorage whenever path changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sabi_unread_count");
      if (stored !== null) setUnreadCount(Number.parseInt(stored, 10));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-stretch max-w-lg mx-auto">
        {NAV_ITEMS.map(({ to, label, Icon, ocid }) => {
          const active = currentPath === to || currentPath.startsWith(`${to}/`);
          const isBell = to === "/notifications";
          return (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors duration-200 relative ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {isBell && unreadCount > 0 && (
                  <span
                    data-ocid="nav.notifications_badge"
                    className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-[3px]"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[10px] font-medium ${active ? "text-primary" : ""}`}
              >
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
