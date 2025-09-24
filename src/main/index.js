// src/main/index.js

import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, dirname, basename } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import { createWriteStream } from 'fs'
import axios from 'axios'
import { tmpdir } from 'os'

// =============================================================================
// Settings Management
// =============================================================================
let settingsPath;

// Determine settings path based on environment
if (is.dev) {
  settingsPath = join(app.getAppPath(), 'settings.json');
} else {
  settingsPath = join(app.getPath('userData'), 'settings.json');
}

function readSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading settings file:', error);
  }
  // Return default settings if file doesn't exist or on error
  return { steamPath: '' };
}

function writeSettings(settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error writing settings file:', error);
  }
}

// =============================================================================
// WeMod Helper Function (More Robust)
// =============================================================================
// This helper function reliably finds the path to WeMod's app.asar file.
const findWeModAsarPath = () => {
    const localAppData = process.env.LOCALAPPDATA;
    if (!localAppData) {
        console.error('LOCALAPPDATA environment variable not found.');
        return null;
    }

    const weModDir = join(localAppData, 'WeMod');
    if (!fs.existsSync(weModDir)) {
        return null; // WeMod directory doesn't exist
    }

    // Find the latest app-* directory
    try {
        const appDirs = fs.readdirSync(weModDir)
            .filter(file => file.startsWith('app-') && fs.statSync(join(weModDir, file)).isDirectory())
            .sort()
            .reverse();

        if (appDirs.length === 0) {
            return null; // No app-* directory found
        }
        
        const latestAppDir = appDirs[0];
        const asarPath = join(weModDir, latestAppDir, 'resources', 'app.asar');
        return asarPath; // Return the full potential path
    } catch (error) {
        console.error('Error finding WeMod app directory:', error);
        return null;
    }
};


// =============================================================================
// IPC Handlers
// =============================================================================

// Window Controls
ipcMain.on('minimize-window', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});
ipcMain.on('close-window', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

// External Link
ipcMain.on('open-external-link', (event, url) => {
  shell.openExternal(url);
});


// App Version
ipcMain.handle('get-app-version', () => app.getVersion());

// Steam Path
ipcMain.handle('get-steam-path', () => {
  const settings = readSettings();
  return settings.steamPath || '';
});

ipcMain.handle('select-steam-path', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select your Steam Installation Directory'
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const newPath = result.filePaths[0];
    const settings = readSettings();
    settings.steamPath = newPath;
    writeSettings(settings);
    return newPath;
  }
  return null;
});

ipcMain.handle('open-stplug-in-folder', async () => {
  const { steamPath } = readSettings();
  if (!steamPath) {
    return { success: false, message: 'Steam path is not configured.' };
  }
  const pluginPath = join(steamPath, 'config', 'stplugin');
  try {
    await fs.promises.mkdir(pluginPath, { recursive: true });
    shell.openPath(pluginPath);
    return { success: true };
  } catch (error) {
    console.error('Failed to open stplugin folder:', error);
    return { success: false, message: 'Could not create or open the plugin folder.' };
  }
});

// WeMod Path & Scanning
ipcMain.handle('select-wemod-path', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return !canceled && filePaths.length > 0 ? filePaths[0] : null;
});

// FIXED: This logic now correctly handles when app.asar is not found.
ipcMain.handle('scan-for-wemod-asar', async () => {
    const asarPath = findWeModAsarPath();
    if (asarPath && fs.existsSync(asarPath)) {
      return { success: true, message: `Found app.asar at: ${asarPath}`, path: asarPath };
    }
    // If the file doesn't exist, it's not an error. It means we're ready to patch.
    // We still return the expected path so the installer knows where to write the new file.
    return { success: true, message: 'Original app.asar not found. Ready to patch.', path: asarPath };
});

ipcMain.on('open-containing-folder', (event, filePath) => {
  shell.showItemInFolder(filePath);
});

// Mod Installation
ipcMain.on('install-mod', async (event, mod) => {
  const webContents = event.sender;
  const { downloadUrl, installPath, name } = mod;
  const tempPath = join(tmpdir(), `laundromod-download-${Date.now()}`);

  try {
    const response = await axios({ url: downloadUrl, method: 'GET', responseType: 'stream' });
    const writer = createWriteStream(tempPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const finalPath = join(installPath, 'hid.dll'); // Specific for Steam mod
    await fs.promises.rename(tempPath, finalPath);
    
    // Also create the stplugin folder as part of the install process
    const pluginDir = join(installPath, 'config', 'stplugin');
    await fs.promises.mkdir(pluginDir, { recursive: true });

    webContents.send('show-notification', { type: 'success', message: `${name} installed successfully.` });
    webContents.send('install-status-update', { downloadUrl, status: 'complete' });
  } catch (error) {
    console.error(`Installation failed for ${name}:`, error);
    webContents.send('show-notification', { type: 'error', message: `Failed to install ${name}.` });
    webContents.send('install-status-update', { downloadUrl, status: 'failed' });
  }
});

ipcMain.handle('install-wemod-mod', async (event, { asarUrl, exactAsarPath }) => {
  try {
    const response = await axios.get(asarUrl, { responseType: 'arraybuffer' });
    await fs.promises.writeFile(exactAsarPath, Buffer.from(response.data));
    return { success: true };
  } catch (error) {
    console.error('Error installing WeMod mod:', error);
    return { success: false, message: `Download or write failed: ${error.message}` };
  }
});

// FIXED: This logic now correctly handles when files are already missing.
ipcMain.handle('remove-all-mods', async () => {
  const settings = readSettings();
  const messages = [];

  // Remove Steam Mod
  if (settings.steamPath && fs.existsSync(settings.steamPath)) {
    const steamModPath = join(settings.steamPath, 'hid.dll');
    if (fs.existsSync(steamModPath)) {
      try {
        await fs.promises.unlink(steamModPath);
        messages.push('Steam mod (hid.dll) was removed.');
      } catch (e) {
        messages.push(`Error removing Steam mod: ${e.message}`);
      }
    } else {
      messages.push('Steam mod (hid.dll) was not found.');
    }
  } else {
    messages.push('Steam path not set or found, skipping.');
  }

  // Remove WeMod Patch
  const asarPath = findWeModAsarPath();
  if (asarPath && fs.existsSync(asarPath)) {
    try {
      await fs.promises.unlink(asarPath);
      messages.push('WeMod patch (app.asar) was removed.');
    } catch (e) {
      messages.push(`Error removing WeMod patch: ${e.message}`);
    }
  } else {
    messages.push('WeMod patch (app.asar) was not found.');
  }

  return { success: true, detail: messages.join(' ') };
});

// =============================================================================
// App Lifecycle
// =============================================================================
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    resizable: false, // Window is now unresizable
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

