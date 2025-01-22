const dirSelectorBtns = Array.from(document.getElementsByClassName('button\:openDir'));

async function getDefaultPicturePath(index) {
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

information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

