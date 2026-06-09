// src/renderer/types/global.d.ts
export {};

declare global {
  interface Window {
    backendAPI: {
      // ---------- Core Modules ----------
      auth: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      clients: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      appointments: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      treatments: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      categories: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      packages: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      staff: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      users: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      roles: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      invoices: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      payments: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      reports: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      photos: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      notifications: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      dashboard: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      audit: (method: string, params?: any) => Promise<{ status: boolean; message: string; data: any }>;
      themes: (payload: any) => Promise<any>;

      // ---------- Window Controls ----------
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      getWindowState: () => Promise<{ isMaximized: boolean; isMinimized: boolean }>;
      onWindowMaximized: (callback: () => void) => () => void;
      onWindowRestored: (callback: () => void) => () => void;
      onWindowMinimized: (callback: () => void) => () => void;
      notifyAppReady?: () => void;
      openExternal: (url: string) => Promise<void>;

      // ---------- App Info ----------
      appInfo: () => Promise<{ name: string; version: string; isDev: boolean; platform: string; arch: string }>;

      // ---------- Updater API ----------
      updater: (payload: { method: string; params?: any }) => Promise<{
        status: boolean;
        message: string;
        data: any;
      }>;

      // ---------- Utilities ----------
      openLogFolder: () => Promise<void>;

      // ---------- Generic Event Listener ----------
      on: (channel: string, callback: (event: any, ...args: any[]) => void) => () => void;
      off: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}