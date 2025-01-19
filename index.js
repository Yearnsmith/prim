const { app, BrowserWindow, ipcMain, dialog } = require('electron/main');
const { ipcRenderer } = require('electron/renderer');
const path = require('node:path');

async function handleDirOpen ({ sliderIndex = 1, sliderName = '' }) {
  // const { cancelled, filePaths: paths } = await dialog.showOpenDialog({
  const response = await dialog.showOpenDialog({
    title: `Select Folder for ${sliderName || `Slider ${sliderIndex}`} images`,
    buttonLabel: 'Use this one',
    defaultPath: app.getPath('pictures'),
    properties: [
      'openDirectory',
      'multiSelections',
      'noResolveAliases',
      'dontAddToRecent',
    ],
  });
  console.log('response:', response);
  if (!response.canceled) {
    console.log('response.filePaths:\n', response.filePaths);
    console.log('joined response.filePaths:\n', response.filePaths.join(', '));
    return response.filePaths.join(', ');
  }
};

async function handleUpdateActiveDirs (event, { slideshowNo, dirPath }) {
  const webContents = event.sender;
  const window = BrowserWindow.fromWebContents(webContents);
  console.log('args:');
  console.log({ slideshowNo, dirPath });
  const appData = app.getPath('appData');
  console.log('appData:', appData);
  window.setTitle('var updated?');
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadFile('index.html');
}

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(() => {
  ipcMain.handle('dialog:openDir', handleDirOpen);
  ipcMain.on('variable:update:activeDirs', handleUpdateActiveDirs);
  ipcMain.handle('getPicturePath', () => app.getPath('pictures'));

  createWindow();
});