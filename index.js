const { app, BrowserWindow, ipcMain, nativeTheme, Menu } = require('electron/main');
const path = require('node:path');

const {
  handleDirOpen,
  handleGetDefaultState,
  handleUpdateActiveDirs,
  handleNavBack,
  handleGetFileNames,
  handleGetImagesBase64,
  handleDarkModeToggle,
} = require('./handlers/mainHandlers');
const { GLOBAL_APP_DEFAULTS, SLIDESHOW_DEFAULTS } = require('./typing/enums');
const types = require('./typing/types');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setMenuBarVisibility(false);
  const menu = Menu.buildFromTemplate([{
    label: "File",
    submenu: [{
      click: () => mainWindow.webContents.send('quit-application'),
      label: 'Quit'
    },
    {
      click: () => mainWindow.webContents.send('update-counter', -1),
      label: 'Decrement'
    }],
  }]);

  // Menu.setApplicationMenu(menu)

  mainWindow.loadFile(`${app.getAppPath()}/index.html`);
  mainWindow.show();
  mainWindow.maximize();
  mainWindow.webContents.openDevTools();
}

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('variable:update:activeDirs', handleUpdateActiveDirs);

ipcMain.handle('getTypings', () => ({
    GLOBAL_APP_DEFAULTS,
    SLIDESHOW_DEFAULTS,
  }));

  ipcMain.handle('dark-mode:toggle', handleDarkModeToggle);

  ipcMain.handle('dark-mode:system', () => nativeTheme.themeSource = 'system');

app.whenReady().then(() => {
  ipcMain.handle('prefs:getDefaultAppState', handleGetDefaultState);
  ipcMain.handle('dialog:openDir', handleDirOpen);
  ipcMain.handle('getPicturePath', () => SLIDESHOW_DEFAULTS.DIR_PATH);
  ipcMain.handle('nav:back', handleNavBack);
  ipcMain.handle('slideshow:getFileNames', handleGetFileNames);
  ipcMain.handle('slideshow:getImagesBase64', handleGetImagesBase64);
  createWindow();
  app.setBadgeCount(5);
});