// src/main/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backendAPI", {
  clients: (method, params) =>
    ipcRenderer.invoke("medinova:clients", { method, params }),
  appointments: (method, params) =>
    ipcRenderer.invoke("medinova:appointments", { method, params }),
  treatments: (method, params) =>
    ipcRenderer.invoke("medinova:treatments", { method, params }),
  categories: (method, params) =>
    ipcRenderer.invoke("medinova:categories", { method, params }),
  packages: (method, params) =>
    ipcRenderer.invoke("medinova:packages", { method, params }),
  staff: (method, params) =>
    ipcRenderer.invoke("medinova:staff", { method, params }),
  invoices: (method, params) =>
    ipcRenderer.invoke("medinova:invoices", { method, params }),
  payments: (method, params) =>
    ipcRenderer.invoke("medinova:payments", { method, params }),
  reports: (method, params) =>
    ipcRenderer.invoke("medinova:reports", { method, params }),
  photos: (method, params) =>
    ipcRenderer.invoke("medinova:photos", { method, params }),
  notifications: (method, params) =>
    ipcRenderer.invoke("medinova:notifications", { method, params }),
  users: (method, params) =>
    ipcRenderer.invoke("medinova:users", { method, params }),
  roles: (method, params) =>
    ipcRenderer.invoke("medinova:roles", { method, params }),
  auth: (method, params) =>
    ipcRenderer.invoke("medinova:auth", { method, params }),
  themes: (payload) => ipcRenderer.invoke("themes", payload),
  // window controls
  minimizeWindow: () => ipcRenderer.send("window:minimize"),
  maximizeWindow: () => ipcRenderer.send("window:maximize"),
  closeWindow: () => ipcRenderer.send("window:close"),

  // Window control
  windowControl: (payload) => ipcRenderer.invoke("window-control", payload),
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  notifyAppReady: () => ipcRenderer.send("app:renderer-ready"),

  openExternal: (url) => ipcRenderer.invoke("app: open-external", url),
  appInfo: () => ipcRenderer.invoke("app:get-info"),
  updater: (payload) => ipcRenderer.invoke("updater", payload),

  // 🆕 Utility methods
  openLogFolder: () => ipcRenderer.invoke("app:open-log-folder"),

  // Event listeners
  on: (channel, callback) => {
    const newCallback = (_, data) => callback(data);
    ipcRenderer.on(channel, newCallback);
    return () => ipcRenderer.removeListener(channel, newCallback);
  },
  off: (channel, callback) => ipcRenderer.removeListener(channel, callback),
});
