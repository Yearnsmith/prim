const { app } = require('electron');
const { ipcRenderer, contextBridge } = require('electron/renderer');
console.log('app:', app);
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('appPrefs', {
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
    return ipcRenderer.send('variable:update:activeDirs', args);
  },
  sliderNameMap: {
    '1': 'Slideshow 1',
    '2': 'Slideshow 2',
    '3': 'Slideshow 3',
  },
});

contextBridge.exposeInMainWorld('electronAPI', {
  openDir: (options) => ipcRenderer.invoke('dialog:openDir', options),
});
