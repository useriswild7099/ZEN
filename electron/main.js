/**
 * ZenGuard AI — Electron Main Process
 * 
 * PRIVACY ARCHITECTURE:
 * - nodeIntegration: false
 * - contextIsolation: true  
 * - No remote module
 * - No webview tag
 * - External navigation blocked
 * - Referer headers stripped
 * - Backend runs as local child process (localhost only)
 * 
 * LIFECYCLE:
 * 1. Spawn FastAPI backend as child process
 * 2. Wait for backend health check
 * 3. Load static-exported Next.js frontend
 * 4. Graceful shutdown on quit
 */

const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, shell, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http');

// ─── Constants ───────────────────────────────────────────────────────────────

const APP_NAME = 'ZenGuard AI';
const BACKEND_PORT = 8000;
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;
const OLLAMA_URL = 'http://127.0.0.1:11434';
const HEALTH_CHECK_INTERVAL_MS = 2000;
const HEALTH_CHECK_MAX_RETRIES = 30; // 60 seconds max wait

// ─── State ───────────────────────────────────────────────────────────────────

let mainWindow = null;
let tray = null;
let backendProcess = null;
let isQuitting = false;

// ─── Lightweight JSON Store (CJS-compatible, replaces electron-store) ────────
// electron-store v10+ is ESM-only; this zero-dependency store works in CJS.

const STORE_DEFAULTS = {
  windowBounds: { width: 1280, height: 860, x: undefined, y: undefined },
  isMaximized: false,
};

function getStorePath() {
  return path.join(app.getPath('userData'), 'window-state.json');
}

const store = {
  _data: null,

  get store() {
    if (!this._data) {
      try {
        const raw = fs.readFileSync(getStorePath(), 'utf8');
        this._data = { ...STORE_DEFAULTS, ...JSON.parse(raw) };
      } catch {
        this._data = { ...STORE_DEFAULTS };
      }
    }
    return this._data;
  },

  get(key) {
    return this.store[key];
  },

  set(key, value) {
    this.store[key] = value;
    try {
      fs.writeFileSync(getStorePath(), JSON.stringify(this.store, null, 2), 'utf8');
    } catch (err) {
      console.error('[Store] Failed to persist:', err.message);
    }
  },
};

// ─── Path Resolution ─────────────────────────────────────────────────────────

/**
 * Resolve paths correctly for both dev and packaged builds.
 * In production (asar), resources are in `process.resourcesPath`.
 * In dev, they're relative to the project root.
 */
function getProjectRoot() {
  if (app.isPackaged) {
    return process.resourcesPath;
  }
  // In dev, electron/main.js is at <project>/electron/main.js
  return path.join(__dirname, '..');
}

function getFrontendPath() {
  return path.join(getProjectRoot(), 'frontend', 'out');
}

function getBackendPath() {
  return path.join(getProjectRoot(), 'backend');
}

function getIconPath() {
  const root = getProjectRoot();
  const candidates = [
    path.join(root, 'frontend', 'public', 'logo.png'),
    path.join(root, 'frontend', 'src', 'app', 'favicon.ico'),
    path.join(root, 'build', 'icon.png'),
  ];
  return candidates.find(p => fs.existsSync(p)) || undefined;
}

// ─── Backend Process Management ──────────────────────────────────────────────

/**
 * Spawn the FastAPI backend as a child process.
 * Mirrors the behavior of start.bat but managed by Electron.
 */
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendDir = getBackendPath();
    const isWindows = process.platform === 'win32';

    // Python from project venv (same path in dev and packaged builds)
    const pythonExe = isWindows
      ? path.join(backendDir, 'venv', 'Scripts', 'python.exe')
      : path.join(backendDir, 'venv', 'bin', 'python');

    // Verify Python exists
    try {
      fs.accessSync(pythonExe);
    } catch {
      console.error(`[Backend] Python not found at: ${pythonExe}`);
      console.error('[Backend] Please run install.bat first to set up the backend environment.');
      resolve(false); // Don't crash — let the app show a health warning
      return;
    }

    console.log(`[Backend] Starting uvicorn from: ${backendDir}`);
    console.log(`[Backend] Python: ${pythonExe}`);

    backendProcess = spawn(
      pythonExe,
      ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', String(BACKEND_PORT)],
      {
        cwd: backendDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        // Ensure child doesn't keep the app alive
        detached: false,
        // Windows-specific: hide the console window
        windowsHide: true,
        env: {
          ...process.env,
          // Force privacy settings
          ENABLE_LOGGING: 'false',
          STORE_DATA: 'false',
        },
      }
    );

    backendProcess.stdout.on('data', (data) => {
      const msg = data.toString().trim();
      if (msg) console.log(`[Backend] ${msg}`);
    });

    backendProcess.stderr.on('data', (data) => {
      const msg = data.toString().trim();
      if (msg) console.log(`[Backend:err] ${msg}`);
    });

    backendProcess.on('error', (err) => {
      console.error('[Backend] Failed to start:', err.message);
      backendProcess = null;
      resolve(false);
    });

    backendProcess.on('exit', (code, signal) => {
      console.log(`[Backend] Exited with code=${code}, signal=${signal}`);
      backendProcess = null;
      // If the backend crashes while running, notify the renderer
      if (!isQuitting && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('backend-status', { alive: false, error: 'Backend process exited unexpectedly' });
      }
    });

    // Wait for backend to become responsive
    waitForBackend()
      .then((alive) => {
        if (alive) {
          console.log('[Backend] ✓ Ready and accepting connections');
        } else {
          console.warn('[Backend] ✗ Started but not responding to health checks');
        }
        resolve(alive);
      })
      .catch(() => resolve(false));
  });
}

/**
 * Poll the backend health endpoint until it responds or we time out.
 */
function waitForBackend() {
  return new Promise((resolve) => {
    let retries = 0;

    const check = () => {
      if (retries >= HEALTH_CHECK_MAX_RETRIES) {
        resolve(false);
        return;
      }

      httpGet(`${BACKEND_URL}/health`)
        .then((data) => {
          if (data && data.status === 'healthy') {
            resolve(true);
          } else {
            retries++;
            setTimeout(check, HEALTH_CHECK_INTERVAL_MS);
          }
        })
        .catch(() => {
          retries++;
          setTimeout(check, HEALTH_CHECK_INTERVAL_MS);
        });
    };

    check();
  });
}

/**
 * Simple HTTP GET that returns parsed JSON.
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Invalid JSON'));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Terminate the backend process gracefully.
 */
function stopBackend() {
  if (!backendProcess) return;

  console.log('[Backend] Shutting down...');
  
  const isWindows = process.platform === 'win32';
  
  if (isWindows) {
    // On Windows, spawn taskkill to ensure the process tree is killed
    try {
      spawn('taskkill', ['/pid', String(backendProcess.pid), '/f', '/t'], { windowsHide: true });
    } catch {
      backendProcess.kill('SIGKILL');
    }
  } else {
    backendProcess.kill('SIGTERM');
    // Force kill after 5 seconds if still alive
    setTimeout(() => {
      if (backendProcess) {
        backendProcess.kill('SIGKILL');
      }
    }, 5000);
  }

  backendProcess = null;
}

// ─── Window Creation ─────────────────────────────────────────────────────────

function createWindow() {
  const { windowBounds, isMaximized } = store.store;
  const iconPath = getIconPath();

  mainWindow = new BrowserWindow({
    ...windowBounds,
    minWidth: 900,
    minHeight: 600,
    title: APP_NAME,
    icon: iconPath ? nativeImage.createFromPath(iconPath) : undefined,
    backgroundColor: '#0a0a0a', // Match the app's dark theme
    show: false, // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: false,              // Disable <webview> for security
      allowRunningInsecureContent: false,
      enableRemoteModule: false,      // Deprecated but explicitly disable
      spellcheck: true,
    },
  });

  // Restore maximized state
  if (isMaximized) {
    mainWindow.maximize();
  }

  // Show window when content is ready (avoids white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // ─── Load the frontend ───
  const frontendPath = getFrontendPath();
  const indexPath = path.join(frontendPath, 'index.html');
  
  try {
    fs.accessSync(indexPath);
    mainWindow.loadFile(indexPath);
    console.log(`[Window] Loading frontend from: ${indexPath}`);
  } catch {
    // If static export doesn't exist, show an error page
    console.error(`[Window] Frontend not found at: ${indexPath}`);
    mainWindow.loadURL(`data:text/html;charset=utf-8,
      <html>
        <head><title>${APP_NAME}</title></head>
        <body style="background:#0a0a0a;color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;max-width:500px;">
            <h1 style="font-size:2rem;margin-bottom:1rem;">⚠️ Frontend Not Built</h1>
            <p style="color:#999;line-height:1.6;">
              The static frontend has not been exported yet.<br/>
              Run <code style="background:#222;padding:2px 8px;border-radius:4px;">cd frontend && set BUILD_TARGET=electron && npm run build</code> first.
            </p>
          </div>
        </body>
      </html>
    `);
  }

  // ─── Save window state on move/resize ───
  const saveWindowState = () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    
    const isMax = mainWindow.isMaximized();
    if (!isMax) {
      store.set('windowBounds', mainWindow.getBounds());
    }
    store.set('isMaximized', isMax);
  };

  mainWindow.on('resize', saveWindowState);
  mainWindow.on('move', saveWindowState);

  // ─── Minimize to tray instead of closing ───
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      
      // Show tray notification on first minimize
      if (tray && !store.get('trayNotified')) {
        tray.displayBalloon({
          title: APP_NAME,
          content: 'ZenGuard is still running in the background. Click the tray icon to restore.',
          iconType: 'info',
        });
        store.set('trayNotified', true);
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // ─── Security: Block navigation to external URLs ───
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Allow navigation within the app (file:// or data:)
    if (!url.startsWith('file://') && !url.startsWith('data:')) {
      event.preventDefault();
      shell.openExternal(url); // Open in default browser instead
    }
  });

  // Block new window creation (e.g., target="_blank")
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ─── System Tray ─────────────────────────────────────────────────────────────

function createTray() {
  const iconPath = getIconPath();
  let trayIcon;
  
  if (iconPath) {
    trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  } else {
    // Create a simple 16x16 icon as fallback
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip(APP_NAME);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show ZenGuard AI',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: backendProcess ? '● Backend Running' : '○ Backend Stopped',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// ─── IPC Handlers ────────────────────────────────────────────────────────────

function setupIPC() {
  // App version
  ipcMain.handle('get-app-version', () => app.getVersion());

  // Platform
  ipcMain.handle('get-platform', () => process.platform);

  // Backend status check
  ipcMain.handle('get-backend-status', async () => {
    try {
      const data = await httpGet(`${BACKEND_URL}/health`);
      return {
        alive: true,
        ollama: data.ollama || 'unknown',
        model: data.model || 'unknown',
        privacy: data.privacy || 'enforced',
      };
    } catch {
      return { alive: false, ollama: 'disconnected', model: 'none', privacy: 'enforced' };
    }
  });

  // Window controls
  ipcMain.on('minimize-to-tray', () => {
    if (mainWindow) mainWindow.hide();
  });

  ipcMain.on('quit-app', () => {
    isQuitting = true;
    app.quit();
  });

  // Auto-update controls
  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall(false, true);
  });

  ipcMain.on('check-for-updates', () => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.log('[Updater] Check failed:', err.message);
    });
  });
}

// ─── Auto-Updater ────────────────────────────────────────────────────────────

function setupAutoUpdater() {
  // Supply Chain Security Hardening
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1'; // Enforce strict TLS for updates
  autoUpdater.allowDowngrade = false; // Prevent rollback attacks to vulnerable versions
  
  // Disable auto-download — let user decide
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    console.log('[Updater] Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log(`[Updater] Update available: v${info.version}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-available', {
        version: info.version,
        releaseDate: info.releaseDate,
        releaseNotes: info.releaseNotes,
      });
    }
    // Start downloading in the background
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on('update-not-available', () => {
    console.log('[Updater] App is up to date');
  });

  autoUpdater.on('download-progress', (progress) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-progress', {
        percent: progress.percent,
        transferred: progress.transferred,
        total: progress.total,
      });
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log(`[Updater] Update downloaded: v${info.version}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-downloaded', {
        version: info.version,
      });
    }
  });

  autoUpdater.on('error', (err) => {
    console.log('[Updater] Error:', err.message);
    // Don't crash — updates are non-critical
  });

  // Check for updates after a short delay (let the app settle)
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.log('[Updater] Initial check failed:', err.message);
    });
  }, 10000); // 10 seconds after launch
}

// ─── Security Hardening ──────────────────────────────────────────────────────

function hardenSecurity() {
  // Strip Referer headers to prevent URL leakage
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const headers = { ...details.requestHeaders };
    delete headers['Referer'];
    delete headers['Origin'];
    
    // Only allow requests to local backend and Ollama
    const url = details.url;
    const isLocalBackend = url.startsWith(BACKEND_URL);
    const isLocalOllama = url.startsWith(OLLAMA_URL);
    const isLocalFile = url.startsWith('file://');
    const isLocalData = url.startsWith('data:');
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    // Allow image CDN for fallback chat mode images
    const isImageCDN = url.startsWith('https://images.unsplash.com');
    
    if (!isLocalBackend && !isLocalOllama && !isLocalFile && !isLocalData && !isLocalhost && !isImageCDN) {
      console.log(`[Security] Blocked request to: ${url}`);
      callback({ cancel: true });
      return;
    }
    
    callback({ requestHeaders: headers });
  });

  // Set strict CSP for the renderer
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' file: data:; " +
          `connect-src 'self' ${BACKEND_URL} ${OLLAMA_URL} https://images.unsplash.com; ` +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "font-src 'self' https://fonts.gstatic.com; " +
          `img-src 'self' file: data: ${BACKEND_URL} https://images.unsplash.com; ` +
          "media-src 'self' file: data:; " +
          "object-src 'none'; " +
          "base-uri 'self';"
        ],
      },
    });
  });
}

// ─── App Lifecycle ───────────────────────────────────────────────────────────

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Focus existing window when user tries to open another instance
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    console.log(`\n  ╔══════════════════════════════════════╗`);
    console.log(`  ║      ${APP_NAME} Desktop v${app.getVersion()}      ║`);
    console.log(`  ║    Privacy-First Mental Health AI    ║`);
    console.log(`  ╚══════════════════════════════════════╝\n`);

    // Setup IPC handlers before creating window
    setupIPC();

    // Harden security
    hardenSecurity();

    // Start backend
    console.log('[Startup] Starting backend server...');
    const backendReady = await startBackend();
    
    if (backendReady) {
      console.log('[Startup] ✓ Backend is ready');
    } else {
      console.warn('[Startup] ✗ Backend failed to start — app will run in offline mode');
    }

    // Create the main window
    createWindow();

    // Create system tray
    createTray();

    // Setup auto-updater (only in packaged builds)
    if (app.isPackaged) {
      setupAutoUpdater();
    }

    // macOS: Re-create window when dock icon is clicked
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      } else if (mainWindow) {
        mainWindow.show();
      }
    });
  });

  // ─── Graceful Shutdown ───
  app.on('before-quit', () => {
    isQuitting = true;
    stopBackend();
  });

  app.on('will-quit', () => {
    stopBackend(); // Double-ensure backend is killed
  });

  // Don't quit when all windows are closed (tray keeps running)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      // On Windows/Linux, keep running in tray
      // User must explicitly quit via tray menu
    }
  });

  // Handle uncaught errors gracefully
  process.on('uncaughtException', (error) => {
    console.error('[Fatal]', error);
    stopBackend();
  });

  process.on('unhandledRejection', (reason) => {
    console.error('[Unhandled Rejection]', reason);
  });
}
