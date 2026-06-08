// src/renderer/types/global.d.ts
export {};

declare global {
  interface Window {
    backendAPI: {
      // ---------- Window Controls ----------
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      getWindowState: () => Promise<{
        isMaximized: boolean;
        isMinimized: boolean;
      }>;
      onWindowMaximized: (callback: () => void) => () => void;
      onWindowRestored: (callback: () => void) => () => void;
      onWindowMinimized: (callback: () => void) => () => void;
      notifyAppReady?: () => void;
      openExternal: (url: string) => Promise<void>;

      appInfo: () => Promise<any>;

      // 🆕 Updater API (invoke)
      updater: (payload: { method: string; params?: any }) => Promise<{
        status: boolean;
        message: string;
        data: any;
      }>;

      openLogFolder: () => Promise<void>;
      getGoalOverlayHTML: () => Promise<string>;
      getFullGoalOverlayHTML: () => Promise<string>;

      // 🎧 Generic event listener (returns cleanup function)
      on: (
        channel: string,
        callback: (event: any, ...args: any[]) => void,
      ) => () => void;
      off: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}
