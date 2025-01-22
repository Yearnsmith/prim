const { app } = require('electron/main');
app.get
/**
 * GLOBAL_DEFAULTS
 * @readonly
 * @enum {number}
 */
const GLOBAL_APP_DEFAULTS = {
  IMAGE_INTERVAL: 1250,
  SLIDESHOW_COUNT: 3,
  PICTURES_DIR: app.getPath("pictures"),
};

/**
 * CONF_DEFAULTS
 * @readonly
 * @enum {string}
 */
const SLIDESHOW_DEFAULTS = {
  NAME: "Slideshow-$",
  DIR_PATH: GLOBAL_APP_DEFAULTS.PICTURES_DIR,
  /** @type {number} */
  INTERVAL_MS: GLOBAL_APP_DEFAULTS.IMAGE_INTERVAL,
  /** @type {number} */
  INTERVAL_S: GLOBAL_APP_DEFAULTS.IMAGE_INTERVAL / 1000,
  /** @type {boolean} */
  IS_IN_DEBUG: false,
};

module.exports = {
  GLOBAL_APP_DEFAULTS,
  SLIDESHOW_DEFAULTS,
};