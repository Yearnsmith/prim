const dirSelectorBtns = Array.from(document.getElementsByClassName('button\:openDir'));

async function getDefaultPicturePath() {
  const pathString = await appPrefs.picturePath();
  return pathString;
}

const DIR_PATH_CONFIG = JSON.parse(window.localStorage.getItem('activeDirs'));
dirSelectorBtns.forEach(async (dirSelector) => {

  const slideshowNo = dirSelector.getAttribute('data-slideshow');
  const displayId = `result_dirPathDisplay-${slideshowNo}`;
  const dirPathDisplay = document.getElementById(displayId);

  dirPathDisplay.value = DIR_PATH_CONFIG?.[slideshowNo] ?? await getDefaultPicturePath();

  dirSelector.addEventListener('click', async () => {
    const currentDirPathConfig = JSON.parse(window.localStorage.getItem('activeDirs'))

    const dirPath = await electronAPI.openDir({
      slideshowName: '',
      currentPath: currentDirPathConfig?.[slideshowNo],
    });

    dirPathDisplay.value = dirPath;
    localStorage.setItem('activeDirs', JSON.stringify({
      ...(currentDirPathConfig ?? {}),
      [slideshowNo]: dirPath,
    }));
  });
});

const information = document.getElementById('info');

const copyright = `© yrnsmth 2025${2025 < new Date().getFullYear() ? ` ‒ ${new Date().getFullYear()}` : ''}`;
const version = 'v0.1.0';

information.style.whiteSpaceCollapse = 'preserve'
information.innerText = `${copyright}  ${version}`;

