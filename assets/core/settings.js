function AppSettings() {
    if (localStorage.getItem('settings')) {
        const key = localStorage.key('settings')
        const appData = JSON.parse(localStorage.getItem(key))
        if ('theme' in appData) {
            document.documentElement.setAttribute('theme', appData.theme)
        }
    } else {
        const appData = {
            'theme': 'light',
            'language': 'ru',
        }
        localStorage.setItem('settings', JSON.stringify(appData))
        AppSettings()
    }
}