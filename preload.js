const { ipcRenderer, contextBridge } = require('electron');
// const { handleSetDefaultAppState } = require('./handlers/preloadHandlers');
const { app } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  application: () => app.getVersion(),
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
});

contextBridge.exposeInMainWorld('appPrefs', {
  getTypings: async () => ipcRenderer.invoke('getTypings'),
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

// async function getAndSetDefaults() {
//   /** @type {SlideshowConfigMap} */
//   const slideshowState = window.localStorage.getItem('slideshowConfig') ?? SLIDESHOW_DEFAULTS;

//   /** @enum {GlobalConfig} */
//   const applicationState = window.localStorage.getItem('globalConfig') ?? GLOBAL_APP_DEFAULTS;

//   let done = await handleSetDefaultAppState(applicationState);
//   done = await handleSetDefaultAppState(slideshowState);
// }

// await getAndSetDefaults();



contextBridge.exposeInMainWorld('electronAPI', {
  openDir: (options) => ipcRenderer.invoke('dialog:openDir', options),
  navBack: () => ipcRenderer.invoke('nav:back'),
  getImageFileNames: (path) => ipcRenderer.invoke('slideshow:getFileNames', path),
  getImagesBase64: (folderPath, pathArray) => ipcRenderer.invoke('slideshow:getImagesBase64', folderPath, pathArray),
});
