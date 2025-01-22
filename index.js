const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

const {
  CONF_DEFAULTS,
  handleDirOpen,
  handleSetDefaultState,
  handleUpdateActiveDirs,
  handleNavBack,
  handleGetFileNames,
  handleGetImagesBase64,
} = require('./handlers/mainHandlers')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadFile(`${app.getAppPath()}/index.html`);
}

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('variable:update:activeDirs', handleUpdateActiveDirs);

app.whenReady().then(() => {
  ipcMain.handle('setup:setDefaultAppState', handleSetDefaultState);
  ipcMain.handle('dialog:openDir', handleDirOpen);
  ipcMain.handle('getPicturePath', () => CONF_DEFAULTS.DIR_PATH);
  ipcMain.handle('nav:back', handleNavBack);
  ipcMain.handle('slideshow:getFileNames', handleGetFileNames);
  ipcMain.handle('slideshow:getImagesBase64', handleGetImagesBase64);
  createWindow();
});