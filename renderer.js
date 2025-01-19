const dirSelectorBtns = Array.from(document.getElementsByClassName('button\:openDir'));

async function getDefaultPicturePath(index) {
  const pathString = await appPrefs.picturePath();
  return pathString;
}

const DIR_PATH_CONFIG = JSON.parse(window.localStorage.getItem('activeDirs'));
dirSelectorBtns.forEach(async (btn) => {

  const slideshowNo = btn.getAttribute('data-slideshow');
  const displayId = `result_dirPathDisplay-${slideshowNo}`;
  const dirPathDisplay = document.getElementById(displayId);

  dirPathDisplay.innerText = DIR_PATH_CONFIG?.[slideshowNo] ?? await getDefaultPicturePath();

  btn.addEventListener('click', async () => {
    const currentDirPathConfig = JSON.parse(window.localStorage.getItem('activeDirs'))
    console.dir('currentDirPathConfig:');
    console.dir(currentDirPathConfig);
    console.log('slideshowNo:', slideshowNo);
    console.log('currentDirPathConfig?.[slideshowNo]:', currentDirPathConfig?.[slideshowNo]);
    const dirPath = await electronAPI.openDir({
      slideshowName: '',
      currentPath: currentDirPathConfig?.[slideshowNo],
    });

    dirPathDisplay.innerText = dirPath;
    localStorage.setItem('activeDirs', JSON.stringify({
      ...(currentDirPathConfig ?? {}),
      [slideshowNo]: dirPath,
    }));
  });
});

const information = document.getElementById('info');

information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const runAsyncOnRender = async () => {
}

runAsyncOnRender();

