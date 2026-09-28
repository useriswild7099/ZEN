/**
 * ZenGuard AI — Electron Preload Script
 * 
 * SECURITY:
 * - Uses contextBridge to safely expose APIs to the renderer
 * - NO direct access to Node.js APIs (require, fs, child_process, etc.)
 * - All communication goes through ipcRenderer invoke/send/on
 * 
 * EXPOSED API: window.electronAPI
 * - getAppVersion()        → string
 * - getPlatform()          → string  
 * - getBackendStatus()     → { alive, ollama, model, privacy }
 * - minimizeToTray()       → void
 * - quit()                 → void
 * - installUpdate()        → void
 * - checkForUpdates()      → void
 * - onUpdateAvailable(cb)  → unsubscribe function
 * - onUpdateProgress(cb)   → unsubscribe function
 * - onUpdateDownloaded(cb) → unsubscribe function
 * - onBackendStatus(cb)    → unsubscribe function
 */

const { contextBridge, ipcRenderer } = require('electron');

// ─── Sanitized IPC Channels ──────────────────────────────────────────────────

// Whitelist of allowed channels — prevents renderer from listening to arbitrary events
const VALID_SEND_CHANNELS = [
  'minimize-to-tray',
  'quit-app',
  'install-update',
  'check-for-updates',
];

const VALID_RECEIVE_CHANNELS = [
  'update-available',
  'update-progress',
  'update-downloaded',
  'backend-status',
];

const VALID_INVOKE_CHANNELS = [
  'get-app-version',
  'get-platform',
  'get-backend-status',
];

// ─── Helper: Create safe listener with cleanup ───────────────────────────────

function createSafeListener(channel) {
  if (!VALID_RECEIVE_CHANNELS.includes(channel)) {
    console.warn(`[Preload] Blocked attempt to listen on invalid channel: ${channel}`);
    return () => () => {}; // Return no-op
  }

  return (callback) => {
    const handler = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, handler);

    // Return unsubscribe function
    return () => {
      ipcRenderer.removeListener(channel, handler);
    };
  };
}

// ─── Expose API ──────────────────────────────────────────────────────────────

contextBridge.exposeInMainWorld('electronAPI', {
  // ─── App Info ───
  
  /**
   * Get the current app version from package.json
   * @returns {Promise<string>} e.g., "1.0.0"
   */
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  /**
   * Get the current platform
   * @returns {Promise<string>} 'win32' | 'darwin' | 'linux'
   */
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // ─── Backend Health ───

  /**
   * Check if the backend server is alive and get its status
   * @returns {Promise<{alive: boolean, ollama: string, model: string, privacy: string}>}
   */
  getBackendStatus: () => ipcRenderer.invoke('get-backend-status'),

  // ─── Window Controls ───

  /**
   * Hide the window to system tray
   */
  minimizeToTray: () => ipcRenderer.send('minimize-to-tray'),

  /**
   * Quit the application (stops backend, closes everything)
   */
  quit: () => ipcRenderer.send('quit-app'),

  // ─── Auto-Update ───

  /**
   * Trigger installation of a downloaded update (will restart the app)
   */
  installUpdate: () => ipcRenderer.send('install-update'),

  /**
   * Manually check for available updates
   */
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),

  /**
   * Listen for update-available events
   * @param {function} callback - Receives { version, releaseDate, releaseNotes }
   * @returns {function} Unsubscribe function
   */
  onUpdateAvailable: createSafeListener('update-available'),

  /**
   * Listen for download progress events
   * @param {function} callback - Receives { percent, transferred, total }
   * @returns {function} Unsubscribe function
   */
  onUpdateProgress: createSafeListener('update-progress'),

  /**
   * Listen for update-downloaded events
   * @param {function} callback - Receives { version }
   * @returns {function} Unsubscribe function
   */
  onUpdateDownloaded: createSafeListener('update-downloaded'),

  /**
   * Listen for backend status changes (e.g., backend crashed)
   * @param {function} callback - Receives { alive, error? }
   * @returns {function} Unsubscribe function
   */
  onBackendStatus: createSafeListener('backend-status'),

  // ─── Environment Detection ───

  /**
   * Whether we're running inside Electron
   * This is a static value, not a function — always true in Electron
   */
  isElectron: true,
});

// ─── Log successful preload ──────────────────────────────────────────────────
console.log('[Preload] ZenGuard AI secure bridge initialized');
