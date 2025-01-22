const {
  app,
  dialog,
  IpcMainInvokeEvent,
} = require('electron/main');
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
 * @typedef {Object} SlideshowConfig
 * @property {string} SlideshowConfig.name
 * @property {string} SlideshowConfig.dirPath
 * @property {number} SlideshowConfig.intervalMs
 * @property {number} SlideshowConfig.intervalS
 * @property {boolean} SlideshowConfig.isInDebug
 */

const DEFAULT_INTERVAL = 1250;

/**
 * CONF_DEFAULTS
 * @readonly
 * @enum {string}
 */
const CONF_DEFAULTS = {
  NAME: "Slideshow-$",
  DIR_PATH: app.getPath("pictures"),
  /** @type {number} */
  INTERVAL_MS: DEFAULT_INTERVAL,
  /** @type {number} */
  INTERVAL_S: DEFAULT_INTERVAL / 1000,
  /** @type {boolean} */
  IS_IN_DEBUG: false,
};

/**
 * @typedef {Object.<number, SlideshowConfig>} SlideshowConfigMap
 */

/**
 * handleSetDefaultState
 * @param {Event<HTMLElement>} _ - event. This is unused
 * @param {number} slideShowCount - number of slideshows
 *
 * @returns {SlideshowConfigMap}
 */
function handleSetDefaultState (_, slideShowCount = 3) {

  /** @type {SlideshowConfigMap} */
  const obj = {};

  for (let n = 1; n<=slideShowCount; n++) {
    obj[i] = {
      name: CONF_DEFAULTS.NAME,
      dirPath: CONF_DEFAULTS.DIR_PATH,
      intervalMs: CONF_DEFAULTS.INTERVAL_MS,
      intervalS: CONF_DEFAULTS.INTERVAL_S,
      isInDebug: CONF_DEFAULTS.IS_IN_DEBUG,
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
  CONF_DEFAULTS,
  handleSetDefaultState,
  handleUpdateActiveDirs,
  handleNavBack,
  handleGetFileNames,
  handleGetImagesBase64,
};