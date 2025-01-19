const { app, BrowserWindow, ipcMain, dialog } = require('electron/main');
const path = require('node:path');

async function handleDirOpen(event, {
  currentPath = app.getPath('pictures'),
  slideshowName = 'Slideshow'
}) {
  const { canceled, filePaths: paths } = await dialog.showOpenDialog({
    title: `Select Folder for ${slideshowName} images`,
    buttonLabel: 'Use this one',
    defaultPath: currentPath,
    properties: [
      'openDirectory',
      'multiSelections',
      'noResolveAliases',
      'dontAddToRecent',
    ],
  });
  if (!canceled) {
    return paths[0];
  } else {
    return 'isCancelled' ?? currentPath;
  }
};

async function handleUpdateActiveDirs (event, { slideshowNo, dirPath }) {
  const webContents = event.sender;
  const window = BrowserWindow.fromWebContents(webContents);
  console.log('args:');
  console.log({ slideshowNo, dirPath });

  console.log(webContents.localStorage);

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

ipcMain.on('variable:update:activeDirs', handleUpdateActiveDirs);

app.whenReady().then(() => {
  ipcMain.handle('dialog:openDir', (e, args) => handleDirOpen(e, args));
  ipcMain.handle('getPicturePath', () => app.getPath('pictures'));

  createWindow();
});