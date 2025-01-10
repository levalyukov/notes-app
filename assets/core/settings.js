function getSettings() {
    if (!localStorage.getItem('settings')) {
        if (localStorage.getItem('.settings')) {
            loadSettings()
        } else {
            saveSettings('light', 'ru-ru')
            getSettings()
        }
    } else {
        localStorage.removeItem('settings')
        getSettings()
        notice(
            'Система',
            "'settings' → '.settings'.\nНастройки были сброшены."
        )
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
    const key = localStorage.key('.settings')
    const appData = JSON.parse(localStorage.getItem(key))
    if ('theme' in appData) {
        applyTheme(appData.theme)
    }
}

function applyTheme(id) {
    document.documentElement.setAttribute('theme', id)
}