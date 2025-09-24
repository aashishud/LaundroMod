// src/preload/index.js

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// =============================================================================
// API exposed to the renderer process.
// Note: Functions for getting app config and handling licenses have been removed
// as they are now handled by the secure Cloudflare Worker.
// =============================================================================
const api = {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),

  // App version
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
 // External links
  openExternalLink: (url) => ipcRenderer.send('open-external-link', url),

  // Generic mod installer (Steam)
  installMod: (args) => ipcRenderer.send('install-mod', args),

  // WeMod-specific functions
  installWeModMod: (mod) => ipcRenderer.invoke('install-wemod-mod', mod),
  selectWeModPath: () => ipcRenderer.invoke('select-wemod-path'),
  scanForWeModAsar: (path) => ipcRenderer.invoke('scan-for-wemod-asar', path),
  openContainingFolder: (path) => ipcRenderer.send('open-containing-folder', path),
  
  // Universal mod removal
  removeAllMods: () => ipcRenderer.invoke('remove-all-mods'),

  // Event listener for progress updates from the main process
  onInstallStatusUpdate: (callback) => {
    const handler = (_event, value) => callback(value)
    ipcRenderer.on('install-status-update', handler)
    return () => ipcRenderer.removeListener('install-status-update', handler)
  },

  // Steam-specific path functions
  getSteamPath: () => ipcRenderer.invoke('get-steam-path'),
  selectSteamPath: () => ipcRenderer.invoke('select-steam-path'),
  openStplugInFolder: () => ipcRenderer.invoke('open-stplug-in-folder'),
  
  // Global notification listener
  onShowNotification: (callback) => {
    const handler = (_event, notif) => callback(notif);
    ipcRenderer.on('show-notification', handler);
    return () => ipcRenderer.removeListener('show-notification', handler);
  },
}

// Securely expose the API to the renderer process
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose preload API:', error)
  }
} else {
  // Fallback for non-context-isolated environments (less secure)
  window.electron = electronAPI
  window.api = api
}

