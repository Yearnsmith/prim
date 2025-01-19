// let { activeDirs } = remote.getGlobal('appPreferences');

const dirSelectorBtns = Array.from(document.getElementsByClassName('button\:openDir'));

dirSelectorBtns.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const slideshowNo = btn.getAttribute('data-slideshow');
    const dirPath = await window.electronAPI.openDir({
      sliderIndex: Number(slideshowNo),
    });

    const displayId = `result_dirPathDisplay-${slideshowNo}`;

    const dirPathDisplay = document.getElementById(displayId);
    dirPathDisplay.innerText = dirPath;
    console.log('slideshowNo:', slideshowNo);
    await appPrefs.setActiveDir({ slideshowNo, dirPath });
    console.dir(appPrefs);
  })
});

dirSelectorBtns.forEach(async (btn) => {
  const pathObj = await appPrefs.activeDirs();
  const slideshowNo = btn.getAttribute('data-slideshow');
  const displayId = `result_dirPathDisplay-${slideshowNo}`;
  dirPathDisplay = document.getElementById(displayId);
  console.log({ btn, slideshowNo, displayId, pathObj, [pathObj[slideshowNo]]: pathObj[slideshowNo] }, dirPathDisplay);
  dirPathDisplay.innerText = pathObj[slideshowNo];
});

const information = document.getElementById('info');

information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const runAsyncOnRender = async () => {
}

runAsyncOnRender();

