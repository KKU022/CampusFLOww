'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'default' | 'mono';

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const THEME_STORAGE_KEY = 'cf_theme_mode';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('default');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'mono' || stored === 'default') {
        setModeState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('mono', mode === 'mono');

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => setModeState(next), []);
  const toggleMode = useCallback(() => setModeState((prev) => (prev === 'mono' ? 'default' : 'mono')), []);

  const value = useMemo<ThemeContextValue>(() => ({ mode, setMode, toggleMode }), [mode, setMode, toggleMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return ctx;
}
