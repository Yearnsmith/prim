const { app, BrowserWindow, ipcMain, dialog } = require('electron/main');
const { readdirSync, readFileSync } = require('node:fs');
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
  ipcMain.handle('dialog:openDir', (e, args) => handleDirOpen(e, args));
  ipcMain.handle('getPicturePath', () => app.getPath('pictures'));
  ipcMain.handle('nav:back', (event) => {
    if (event.sender.navigationHistory.canGoBack()) {
      return event.sender.navigationHistory.goBack();
    }
  });
  ipcMain.handle('slideshow:getFileNames', (e, path) => {
    console.log('path', path);
    const items = readdirSync(path, { withFileTypes: true })
      .filter(f => f.isFile && f.name.match(/\.(?:jpg|JPG|JPEG|gif|GIF|png|PNG|svg|bmp|BMP|webp|webP)$/))
      .flatMap(f => f.name);
      return items;
  });
  ipcMain.handle('slideshow:getImagesBase64', (e, folderPath, pathArray) => {
    const imageArray = [];
    for (const path of pathArray) {
      const fullPath = `${folderPath}/${path}`;
      console.log(fullPath);
      imageArray.push({
        fileName: path,
        fileType: path.match(/(?<=\.)(?:jpg|JPG|JPEG|gif|GIF|png|PNG|svg|bmp|BMP|webp|webP)$/)[0],
        base64: readFileSync(fullPath, { encoding: 'base64' }),
      });
    }
    return imageArray;
  });
  createWindow();
});