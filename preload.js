const { ipcRenderer, contextBridge } = require('electron/renderer');
const {GLOBAL_APP_DEFAULTS, SLIDESHOW_DEFAULTS } = require('./typing/enums');
const {  SlideshowConfigMap, GlobalConfig } = require('./typing/types');
const { app } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  application: () => app.getVersion(),
});

contextBridge.exposeInMainWorld('appPrefs', {
  defaultGlobalConfig: GLOBAL_APP_DEFAULTS,
  picturePath: async () => ipcRenderer.invoke('getPicturePath'),
  activeDirs: async () => {
    const picturePath = await ipcRenderer.invoke('getPicturePath');
    const value = {
    '1': picturePath,
    '2': picturePath,
    '3': picturePath,
  };
  return value;
},
  setActiveDir: (args) => {
    ipcRenderer.send('variable:update:activeDirs', args);
  },
  sliderNameMap: {
    '1': 'Slideshow 1',
    '2': 'Slideshow 2',
    '3': 'Slideshow 3',
  },
});

contextBridge.exposeInMainWorld('electronAPI', {
  openDir: (options) => ipcRenderer.invoke('dialog:openDir', options),
  navBack: () => ipcRenderer.invoke('nav:back'),
  getImageFileNames: (path) => ipcRenderer.invoke('slideshow:getFileNames', path),
  getImagesBase64: (folderPath, pathArray) => ipcRenderer.invoke('slideshow:getImagesBase64', folderPath, pathArray),
});
