const camelfy = (str) => str.toLowerCase().replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());

(async function getConstants (){
  const {
    /**@enum {{IMAGE_INTERVAL: number, SLIDESHOW_COUNT: number, PICTURES_DIR: string}}*/
    GLOBAL_APP_DEFAULTS: GAP,
    SLIDESHOW_DEFAULTS: S_D
  } = await window.appPrefs.getTypings();
  let appConfig = JSON.parse(window.localStorage.getItem('appConfig')) ?? {};
  let slideshowConfig = JSON.parse(window.localStorage.getItem('slideshowConfig')) ?? {};

  const newAppConfig = {}
  for (const KEY in GAP) {
    let newValue;
    const camelKey = camelfy(KEY);
    Object.assign(newAppConfig, {
      [camelKey]: appConfig?.[camelKey] || (newValue || GAP[KEY]),
    });
  }
  window.localStorage.setItem('appConfig', JSON.stringify(newAppConfig));

  const count = appConfig.slideshowCount || GAP.SLIDESHOW_COUNT
  const newSlideShowConfig = {}
  for (let i = 1; i<=count; i++) {
    for (const KEY in S_D) {
      let newValue;
      if (KEY === 'NAME') newValue = S_D[KEY].replace('$', i);
      const camelKey = camelfy(KEY);
      newSlideShowConfig[i] = {
        ...(newSlideShowConfig[i]),
        [camelKey]: slideshowConfig?.[i]?.[camelKey] || (newValue || S_D[KEY]),
      }
    }
  }
  window.localStorage.setItem('slideshowConfig', JSON.stringify(newSlideShowConfig));


/////
  const settingsForms = Array.from(document.querySelectorAll('form.settings-box'));

  slideshowConfig = JSON.parse(window.localStorage.getItem('slideshowConfig'));
  appConfig = JSON.parse(window.localStorage.getItem('appConfig'));

  settingsForms.forEach(async (form) => {

    const slideshowNo = form.getAttribute('data-slideshow');

    const dirPathDisplay = form.querySelector('input[name^=file-path]');
    dirPathDisplay.value = slideshowConfig?.[slideshowNo].dirPath ?? appConfig.picturesDir;

    const dirSelector = form.querySelector('button.folder-picker');
    dirSelector.addEventListener('click', async () => {
      const _appConfig = JSON.parse(window.localStorage.getItem('appConfig'));
      const _s_config = JSON.parse(window.localStorage.getItem('slideshowConfig'));

      const dirPath = await electronAPI.openDir({
        slideshowName: _s_config?.[slideshowNo]?.name ?? '',
        currentPath: _s_config?.[slideshowNo]?.dirPath ?? _appConfig.picturesDir,
      });

      dirPathDisplay.value = dirPath;
      localStorage.setItem('slideshowConfig', JSON.stringify({
        ..._s_config,
        [slideshowNo]: {
          ..._s_config[slideshowNo],
          dirPath,
        },
      }));
    });

    const intervalDisplay = form.querySelector('input[name^=interval-picker');
    intervalDisplay.value = slideshowConfig?.[slideshowNo].intervalS ?? appConfig.imageInterval;

    intervalDisplay.addEventListener('change', ({ target: { value } }) => {
      const _s_config = JSON.parse(window.localStorage.getItem('slideshowConfig'));
      localStorage.setItem('slideshowConfig', JSON.stringify({
        ..._s_config,
        [slideshowNo]: {
          ..._s_config[slideshowNo],
          intervalS: value,
          intervalMs: value * 1000,
        },
      }));
    });

  });

})();

document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById('toggle-dark-mode').innerText = `Theme: ${isDarkMode ? 'Dark' : 'Light'}`;
  const rts = document.getElementById('reset-to-system');
  rts.removeAttribute("disabled", "");
});

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system()
  document.getElementById('toggle-dark-mode').innerText = 'Theme: System'
  document.getElementById('reset-to-system').toggleAttribute('disabled')
})

async function getDefaultPicturePath() {
  const pathString = await appPrefs.picturePath();
  return pathString;
}

const information = document.getElementById('info');

const copyright = `© yrnsmth 2025${2025 < new Date().getFullYear() ? ` ‒ ${new Date().getFullYear()}` : ''}`;
const version = 'v0.1.0';

information.style.whiteSpaceCollapse = 'preserve'
information.innerText = `${copyright}  ${version}`;

