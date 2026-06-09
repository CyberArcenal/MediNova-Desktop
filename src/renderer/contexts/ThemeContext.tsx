// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { themesAPI } from '../api/core/themes';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Light theme - clinical, clean, medical blue
const lightThemeVars = {
  '--background-color': '#f8fafc',
  '--sidebar-bg': '#ffffff',
  '--sidebar-border': '#e2e8f0',
  '--sidebar-text': '#1e293b',
  '--card-bg': '#ffffff',
  '--card-secondary-bg': '#f1f5f9',
  '--card-hover-bg': '#f8fafc',
  '--card-border': '#e2e8f0',
  '--border-color': '#e2e8f0',
  '--border-light': '#e2e8f0',
  '--text-primary': '#1e293b',
  '--text-secondary': '#475569',
  '--text-tertiary': '#94a3b8',
  '--input-bg': '#ffffff',
  '--input-border': '#cbd5e1',
  '--btn-secondary-bg': '#f1f5f9',
  '--btn-secondary-hover': '#e2e8f0',
  '--btn-secondary-text': '#1e293b',
  '--status-success-bg': 'rgba(46, 125, 100, 0.1)',
  '--status-inactive-bg': 'rgba(100, 116, 139, 0.1)',
  // Primary color (medical blue)
  '--primary-color': '#2c6e9e',
  '--primary-hover': '#1b4f73',
  '--accent-blue': '#2c6e9e',
  '--accent-blue-hover': '#1b4f73',
  '--accent-blue-light': '#eef2ff',
  // Other accents
  '--accent-green': '#2e7d64',
  '--accent-green-hover': '#236151',
  '--accent-orange': '#e6a017',
  '--accent-orange-hover': '#c48a12',
  '--accent-red': '#c73e3e',
  '--accent-red-hover': '#a83232',
  '--accent-purple': '#7c3aed',
  '--accent-purple-hover': '#6d28d9',
  '--accent-emerald': '#10b981',
  '--accent-emerald-hover': '#059669',
};

// Dark theme - softer, medical blue accents, less harsh
const darkThemeVars = {
  '--background-color': '#0f172a',
  '--sidebar-bg': '#1e293b',
  '--sidebar-border': '#334155',
  '--sidebar-text': '#f1f5f9',
  '--card-bg': '#1e293b',
  '--card-border': '#334155',
  '--card-secondary-bg': '#0f172a',
  '--card-hover-bg': '#334155',
  '--border-color': '#334155',
  '--border-light': '#475569',
  '--text-primary': '#f1f5f9',
  '--text-secondary': '#cbd5e1',
  '--text-tertiary': '#94a3b8',
  '--input-bg': '#334155',
  '--input-border': '#475569',
  '--btn-secondary-bg': '#334155',
  '--btn-secondary-hover': '#475569',
  '--btn-secondary-text': '#f1f5f9',
  '--status-success-bg': 'rgba(46, 125, 100, 0.2)',
  '--status-inactive-bg': 'rgba(148, 163, 184, 0.2)',
  // Primary color (medical blue, slightly brighter for dark mode)
  '--primary-color': '#3b82f6',
  '--primary-hover': '#2563eb',
  '--accent-blue': '#3b82f6',
  '--accent-blue-hover': '#2563eb',
  '--accent-blue-light': '#1e3a8a',
  // Other accents
  '--accent-green': '#10b981',
  '--accent-green-hover': '#059669',
  '--accent-orange': '#f59e0b',
  '--accent-orange-hover': '#d97706',
  '--accent-red': '#ef4444',
  '--accent-red-hover': '#dc2626',
  '--accent-purple': '#a78bfa',
  '--accent-purple-hover': '#8b5cf6',
  '--accent-emerald': '#34d399',
  '--accent-emerald-hover': '#10b981',
};

const applyTheme = (theme: 'light' | 'dark') => {
  const vars = theme === 'light' ? lightThemeVars : darkThemeVars;
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light'); // Default to light for medical

  const loadTheme = async () => {
    try {
      const res = await themesAPI.getCurrent();
      if (res.status && res.data) {
        setThemeState(res.data);
        applyTheme(res.data);
      } else {
        // Fallback to system preference or light
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? 'dark' : 'light';
        setThemeState(defaultTheme);
        applyTheme(defaultTheme);
      }
    } catch (err) {
      console.error('Failed to load theme', err);
    }
  };

  useEffect(() => {
    loadTheme();
    // Listen for theme changes from other windows (e.g., settings changed)
    const unsubscribe = window.backendAPI?.on?.('theme:changed', (data: { theme: 'light' | 'dark' }) => {
      setThemeState(data.theme);
      applyTheme(data.theme);
    });
    return () => unsubscribe?.();
  }, []);

  const setTheme = async (newTheme: 'light' | 'dark') => {
    try {
      await themesAPI.set(newTheme);
      setThemeState(newTheme);
      applyTheme(newTheme);
    } catch (err) {
      console.error('Failed to set theme', err);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};