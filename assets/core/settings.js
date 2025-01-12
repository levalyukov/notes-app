function getSettings() {
    if (localStorage.getItem('.settings')) {
        loadSettings()
    } if (!localStorage.getItem('.settings')) {
        saveSettings('light', 'ru-ru')
        getSettings()
    } if (localStorage.getItem('settings')) {
        localStorage.removeItem('settings');
        saveSettings('light', 'ru-ru')
        getSettings()
    }
}

function saveSettings(theme, language) {
    const appData = {
        'theme': theme,
        'language': language,
    }
    localStorage.setItem('.settings', JSON.stringify(appData))
}

function loadSettings() {
    const appData = JSON.parse(localStorage.getItem('.settings'))
    if ('theme' in appData) {
        applyTheme(appData.theme)
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('theme', theme)
}