import { useRouterState } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

const HIDE_NAV_ROUTES = ["/", "/auth"];

export function Layout({ children }: LayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const showNav = !HIDE_NAV_ROUTES.includes(currentPath);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main
        className={`flex-1 flex flex-col w-full max-w-lg mx-auto ${
          showNav ? "pb-20" : ""
        }`}
      >
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
