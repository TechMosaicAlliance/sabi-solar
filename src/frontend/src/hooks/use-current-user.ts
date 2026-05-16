import type { User } from "@/types";
import { useCallback, useState } from "react";

const STORAGE_KEY = "sabi_solar_user";

export function useCurrentUser() {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearUser = useCallback(() => setUser(null), [setUser]);

  return { user, setUser, clearUser, isAuthenticated: user !== null };
}
