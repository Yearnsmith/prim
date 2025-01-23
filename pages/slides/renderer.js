const backNav = Array.from(
  document.getElementsByClassName('back-nav')
)[0].addEventListener('click', async (e) => {
  e.preventDefault();
  electronAPI.navBack();
});

let slideshowConfig = JSON.parse(window.localStorage.getItem('slideshowConfig'));
let appConfig = JSON.parse(window.localStorage.getItem('appConfig'));

const slideshows = Array.from(document.querySelectorAll('[id|=slideshow]'));
slideshows.forEach(async (s) => {
  const dataSet = s.dataset.slideshow;
  const dirString = slideshowConfig?.[dataSet]?.dirPath ?? appConfig.picturesDir;
  s.querySelector('[id|=result_dirPathDisplay').innerText = dirString;
  const images = await loadSlideshowImages(dirString);

  const interval = slideshowConfig?.[dataSet]?.intervalMs;
  cycleImages(s, images, interval);
});

/**
 *
 * @typedef {Object} imageObject
 * @property {string} fileName - Name of the file.
 * @property {string} fileType - image type (png, jpg, etc.).
 * @property {string} base64 - base64 representation of the image.
 */


/**
 * @param {string} path
 * @returns {imageObject[]}
 */
async function loadSlideshowImages(path) {
  const imageFileNames = await electronAPI.getImageFileNames(path);
  const base64Images = await electronAPI.getImagesBase64(path, imageFileNames);

  return base64Images;
}

/**
 *
 * @param {HTMLElement} el
 * @param {imageObject[]} imageObjectArray
 */
function cycleImages(el, imageObjectArray, interval = 1250) {
  setInterval(() => setBackgroundImage(el, imageObjectArray), interval);
}

/**
 *
 * @param {HTMLElement} el
 * @param {imageObject[]} imageObjectArray
 */
function setBackgroundImage (el, imageObjectArray) {
  if (imageObjectArray && imageObjectArray.length) {
    const image = imageObjectArray[Math.floor(Math.random() * imageObjectArray.length)];
    let captionEl = el.querySelector('.image-caption');
    captionEl.innerText = image.fileName;
    el.insertAdjacentElement('beforeend', captionEl);
    el.style.backgroundImage = `url("data:image/${image.fileType};base64,${image.base64}")`;
  }
}
