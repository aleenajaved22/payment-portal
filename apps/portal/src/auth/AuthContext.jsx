import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from './sessionStorage';

const AuthContext = createContext(null);

function deriveName(email) {
  const local = email.split('@')[0] || 'User';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());

  const login = useCallback((email) => {
    const trimmed = email.trim();
    const next = {
      email: trimmed,
      name: deriveName(trimmed),
      loggedInAt: new Date().toISOString(),
    };
    setStoredSession(next);
    setSession(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  const updateSessionProfile = useCallback((patch) => {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      setStoredSession(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.email),
      login,
      logout,
      updateSessionProfile,
    }),
    [session, login, logout, updateSessionProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
