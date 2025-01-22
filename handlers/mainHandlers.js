const {
  app,
  dialog,
  IpcMainInvokeEvent,
} = require('electron/main');
const { SlideshowConfigMap } = require('../typing/types');
const {
  SLIDESHOW_DEFAULTS,
  GLOBAL_APP_DEFAULTS,
} = require('../typing/enums');
const { readdirSync, readFileSync } = require('node:fs');

/**
 *
 * @param {IpcMainInvokeEvent} _ - event (unused)
 * @param {Object} options
 * @param {string?} options.currentPath - path to directory images reside in
 * @param {string?} options.slideshowName - name of the slideshow
 *
 * @returns {string}
 */
async function handleDirOpen(_, {
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
    return currentPath;
  }
};

/**
 * handleSetDefaultState
 * @param {Event<HTMLElement>} _ - event. This is unused
 * @param {number} slideShowCount - number of slideshows
 *
 * @returns {SlideshowConfigMap}
 */
function handleSetDefaultState (_, slideShowCount = GLOBAL_APP_DEFAULTS.SLIDESHOW_COUNT) {

  /** @type {SlideshowConfigMap} */
  const obj = {};

  for (let n = 1; n<=slideShowCount; n++) {
    obj[i] = {
      name: SLIDESHOW_DEFAULTS.NAME,
      dirPath: SLIDESHOW_DEFAULTS.DIR_PATH,
      intervalMs: SLIDESHOW_DEFAULTS.INTERVAL_MS,
      intervalS: SLIDESHOW_DEFAULTS.INTERVAL_S,
      isInDebug: SLIDESHOW_DEFAULTS.IS_IN_DEBUG,
    }
  }

  return obj;
}

/**
 *
 * @param {IpcMainInvokeEvent} event
 * @param {Object} options
 * @param {number} options.slideShowNo
 * @param {string} options.dirPath
 */
async function handleUpdateActiveDirs (event, { slideshowNo, dirPath }) {

}

/**
 *
 * @param {IpcMainInvokeEvent} event
 * @returns {function}
 */
function handleNavBack(event) {
  if (event.sender.navigationHistory.canGoBack()) {
    return event.sender.navigationHistory.goBack();
  }
}

/**
 *
 * @param {IpcMainInvokeEvent} _ - event (unused)
 * @param {string} path - path to files
 *
 * @returns {string[]}
 */
function handleGetFileNames(_, path) {
  const items = readdirSync(path, { withFileTypes: true })
    .filter(f => f.isFile && f.name.match(/\.(?:jpg|JPG|JPEG|gif|GIF|png|PNG|svg|bmp|BMP|webp|webP)$/))
    .flatMap(f => f.name);
    return items;
}

/**
 * @param {IpcMainInvokeEvent} _ - event (unused)
 * @param {string} folderPath - path to parent dir of images
 * @param {string[]} imageNameArray - array containing images
 *
 * @returns {Array<{fileName: string, fileType: string, base64: string}>}
 */
function handleGetImagesBase64(_, folderPath, imageNameArray) {
  console.log('[handleGetFileNames] folderPath:', folderPath);
  console.log('[handleGetFileNames] imageNameArray:', imageNameArray);
  return imageNameArray.reduce((acc, currName) => {
    const fullPath = `${folderPath}/${currName}`;

    /** @type {{fileName: string, fileType: string, base64: string}} */
    const fileObject = {
      fileName: currName,
      fileType: currName.match(/(?<=\.)(?:jpg|JPG|JPEG|gif|GIF|png|PNG|svg|bmp|BMP|webp|webP)$/)[0],
      base64: readFileSync(fullPath, { encoding: 'base64' }),
    };

    return [ ...acc, fileObject ];
  }, []);
}

module.exports = {
  handleDirOpen,
  handleSetDefaultState,
  handleUpdateActiveDirs,
  handleNavBack,
  handleGetFileNames,
  handleGetImagesBase64,
};