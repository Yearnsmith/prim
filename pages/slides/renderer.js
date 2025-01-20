const backNav = Array.from(
  document.getElementsByClassName('back-nav')
)[0].addEventListener('click', async (e) => {
  e.preventDefault();
  electronAPI.navBack();
});

const activeDirs = JSON.parse(window.localStorage.getItem('activeDirs'));
const slideshows = Array.from(document.querySelectorAll('[id|=slideshow]'));
slideshows.forEach(async (s) => {
  const dataSet = s.dataset.slideshow;
  const dirString = activeDirs[dataSet];
  s.querySelector('[id|=result_dirPathDisplay').innerText = dirString;
  const images = await loadSlideshowImages(dirString);

  cycleImages(s, images);
  // setBackgroundImage(s, images);
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

function cycleImages(el, nameArray) {
  setInterval(() => setBackgroundImage(el, nameArray), 1250);
}

/**
 *
 * @param {HTMLElement} el
 * @param {Array.<imageObject>} imageObjectArray
 * @
 */
function setBackgroundImage (el, imageObjectArray) {
  const image = imageObjectArray[Math.floor(Math.random() * imageObjectArray.length)];
  let captionEl = el.querySelector('.image-caption');
  captionEl.innerText = image.fileName;
  el.insertAdjacentElement('beforeend', captionEl);
  el.style.backgroundImage = `url("data:image/${image.fileType};base64,${image.base64}")`;
}
