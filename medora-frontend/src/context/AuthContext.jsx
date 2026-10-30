import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { announceChange, STORAGE_KEYS } from "../services/localStore.js";

const AuthContext = createContext(null);
const USER_KEY = STORAGE_KEYS.currentUser;

function readUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    announceChange(USER_KEY);
  }, []);

  const signIn = useCallback((nextUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    announceChange(USER_KEY);
  }, []);

  useEffect(() => {
    const syncUser = (event) => {
      if (event.type === "storage" && event.key !== USER_KEY) return;
      setUser(readUser());
    };
    window.addEventListener("storage", syncUser);
    window.addEventListener("medora:data-updated", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("medora:data-updated", syncUser);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      logout,
      updateUser: (nextUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
        announceChange(USER_KEY);
      },
    }),
    [user, signIn, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
