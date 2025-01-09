function getSettings() {
    if (localStorage.getItem('settings')) {
        loadSettings()
    } else {
        saveSettings('light', 'ru-ru')
        getSettings()
    }
}

function saveSettings(theme, language) {
    const appData = {
        'theme': theme,
        'language': language,
    }
    localStorage.setItem('settings', JSON.stringify(appData))
}

function loadSettings() {
    const key = localStorage.key('settings')
    const appData = JSON.parse(localStorage.getItem(key))
    if ('theme' in appData) {
        document.documentElement.setAttribute('theme', appData.theme)
    }
}