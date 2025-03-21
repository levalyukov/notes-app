function openAppSettings(
    captions = ['Тема', 'Язык', 'Удалить данные'], 
    icons = ['fa-palette', 'fa-globe', 'fa-trash-can'], 
    contents = {
        'theme': {
            'type': 'select',
            'name': 'theme',
            'value': ['light', 'dark'],
            'caption': ['Светлая', 'Тёмная'],
            },
        'language': {
            'type': 'select',
            'name': 'language',
            'value': ['ru-ru'],
            'caption': ['Русский'],
            },
        'clear-hash': {
            'type': 'button',
            'caption': ['Удалить'],
            'danger': true,
            },
        }
    ) {
    const container = document.querySelector("modals")
    const background = document.createElement('background')
    const modal = document.createElement('modal_settings')
    const header = document.createElement('header')
    const section = document.createElement('section')
    const h1 = document.createElement('h1')
    const button = document.createElement('button')
    const buttonCloseIcon = document.createElement('i')

    container.appendChild(background)
    background.appendChild(modal)
    modal.appendChild(header)
    modal.appendChild(section)
    
    header.appendChild(button)
    button.appendChild(buttonCloseIcon)
    header.appendChild(h1)
    h1.innerHTML = "Настройки"
    button.setAttribute('id', 'modal-close')
    buttonCloseIcon.classList.add('fa-solid', 'fa-xmark')

    if (captions != []) {
        let content_captions = []
        let content_values = []
        let content_type = []
        let content_name = []
        if (contents != {}) {
            for (let i in contents) {
                if ('type' in contents[i]) {
                    content_type.push(contents[i]["type"])
                } if ('value' in contents[i]) {
                    content_values.push(contents[i]["value"])
                } if ('caption' in contents[i]) {
                    content_captions.push(contents[i]["caption"])
                } if ('name' in contents[i]) {
                    content_name.push(contents[i]["name"])
                }
            }
        }

        for(let i = 0; i < captions.length; i++) {
            const component = document.createElement('div')
            const paragraph = document.createElement('p')
            const iconContainer = document.createElement('span')
            const icon = document.createElement('i')
            section.appendChild(component)
            component.classList.add('component')
            if (icons[i] != undefined) {
                component.appendChild(paragraph)
                paragraph.appendChild(iconContainer)
                iconContainer.appendChild(icon)
                icon.classList.add('fa-solid', icons[i])
            } if (content_type != [] && content_values != [] && content_captions != []) {
                if (content_type[i] == "select") {
                    const form = document.createElement('form')
                    const select = document.createElement('select')
                    component.appendChild(form)
                    form.appendChild(select)
                    select.setAttribute('id', content_name[i])
                    for (let m = 0; m < content_values[i].length; m++) {
                        const option = document.createElement('option')
                        select.appendChild(option)
                        if (content_captions[i][m] !== undefined && content_captions[i][m] !== '') {
                            option.innerHTML += content_captions[i][m]
                        } if (content_values[i][m] !== undefined && content_values[i][m] !== '') {
                            option.setAttribute('value', content_values[i][m])
                        }
                        const data = JSON.parse(localStorage.getItem('.settings'))
                        if (select.getAttribute('id') == "theme") {
                            select.value = data.theme
                        } if (select.getAttribute('id') == "language") {
                            select.value = data.language
                        }
                    }
                } if (content_type[i] == "button") {
                    const button = document.createElement('button')
                    component.appendChild(button)
                    button.innerHTML = content_captions[i]
                    for (let s in contents) {
                        if ('danger' in contents[s]) {
                            component.classList.add('danger')
                        }
                    }
                    button.addEventListener('click', () => {
                        button_captions = ['Отмена', 'Удалить']
                        button_classes = ['cancel', 'apply']
                        if (!button.getAttribute('clicked')) {
                            button.setAttribute('clicked', true)
                            if (button_captions != [] && button_classes != []) {
                                const footer = document.createElement('footer')
                                const importantInfo = document.createElement('p')
                                modal.appendChild(footer)
                                section.appendChild(importantInfo)
                                importantInfo.innerText = "Внимание! Очистка кэша приведет к удалению всех данных."
                                importantInfo.appendChild(footer)
                                importantInfo.setAttribute('id', 'danger')
                                for (let i = 0; i < button_captions.length; i++) {
                                    if (button_captions[i] !== undefined) {
                                        const button_function = document.createElement('button')
                                        footer.appendChild(button_function)
                                        button_function.innerHTML = button_captions[i]
                                        if (button_classes[i] !== undefined) {
                                            button_function.setAttribute('id', 'modal-button')
                                            button_function.classList.add(button_classes[i])
                                        } if (button_function.classList.contains('apply')) {
                                            button_function.addEventListener('click', () => {
                                                button.removeAttribute('clicked')
                                                hashClear()
                                                modal.style.animationName = "modalClose"
                                                background.style.animationName = "modalClose-background"
                                                background.addEventListener('animationend', () => {
                                                    background.remove()
                                                })
                                            })
                                        } if (button_function.classList.contains('cancel')) {
                                            button_function.addEventListener('click', () => {
                                                footer.remove()
                                                importantInfo.remove()
                                                button.removeAttribute('clicked')
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }
            paragraph.innerHTML += ' ' + captions[i]
        }
        const themeSelect = document.getElementById('theme')
        const languageSelect = document.getElementById('language')
        const saveSettingsButton = document.createElement('button')
        const footer = document.createElement('footer')

        const data = JSON.parse(localStorage.getItem('.settings'))
        if ('theme' in data) {
            themeSelect.value = data.theme
        } if ('language' in data) {
            languageSelect.value = data.language
        }

        modal.appendChild(footer)
        footer.setAttribute('id', 'saveSettingsFooter')
        footer.appendChild(saveSettingsButton)
        saveSettingsButton.setAttribute('id', 'saveSettingsButton')
        saveSettingsButton.innerHTML = 'Сохранить'
        saveSettingsButton.addEventListener('click', () => {
            notice(
                'Система',
                'Настройки сохранены.'
            )
            saveSettings(themeSelect.value, languageSelect.value)
            loadSettings()
            modal.style.animationName = "modalClose"
            background.style.animationName = "modalClose-background"
            background.addEventListener('animationend', () => {
                background.remove()
            })
        })
    }

    button.addEventListener('click', () => {
        modal.style.animationName = "modalClose"
        background.style.animationName = "modalClose-background"
        background.addEventListener('animationend', () => {
            background.remove()
        })
    })
}

function openPrivacyPolicy(
    caption, 
    headers = ['Сбор и хранение данных', 'Использование данных', 'Удаление данных'], 
    contents = [
        'Приложение для заметок хранит данные только локально на вашем устройстве с использованием LocalStorage. \n\nСохраняются: \n- Заголовки;\n- Содержимое заметок;\n- Время их создания.',
        'Данные используются исключительно для работы приложения — создания, сохранения и отображения ваших заметок.',
        'Вы можете удалить все заметки (данные LocalStorage) в настройках приложения или через настройки браузера. \n\nВосстановление удалённых данных невозможно.'
    ]
    ) {
    const container = document.querySelector("modals")
    const background = document.createElement('background')
    const modal = document.createElement('modal')
    const header = document.createElement('header')
    const section = document.createElement('section')
    const h1 = document.createElement('h1')
    const content = document.createElement('p')
    const button = document.createElement('button')
    const buttonCloseIcon = document.createElement('i')

    container.appendChild(background)
    background.appendChild(modal)
    modal.appendChild(header)
    modal.appendChild(section)
    header.appendChild(button)
    button.appendChild(buttonCloseIcon)
    header.appendChild(h1)
    section.appendChild(content)
    h1.innerHTML = caption
    button.setAttribute('id', 'modal-close')
    buttonCloseIcon.classList.add('fa-solid', 'fa-xmark')

    if (headers != []) {
        for (let i = 0; i < headers.length; i++) {
            const h3 = document.createElement('h3')
            section.appendChild(h3)
            h3.innerHTML = headers[i]
            const p = document.createElement('p')
            section.appendChild(p)
            p.innerHTML = contents[i]
        }
    }

    button.addEventListener('click', () => {
        modal.style.animationName = "modalClose"
        background.style.animationName = "modalClose-background"
        background.addEventListener('animationend', () => {
            background.remove()
        })
    })
}

function workspaceChangerModal(workspaceID, modalCaption, modalHeader, modalDescription) {
    const maxChars = 100

    const container = document.querySelector("modals")
    const background = document.createElement('background')
    const modal = document.createElement('modal_settings')
    const header = document.createElement('header')
    const section = document.createElement('section')
    const h1 = document.createElement('h1')
    const button = document.createElement('button')
    const buttonCloseIcon = document.createElement('i')

    container.appendChild(background)
    background.appendChild(modal)
    modal.appendChild(header)
    modal.appendChild(section)
    header.appendChild(button)
    button.appendChild(buttonCloseIcon)
    header.appendChild(h1)
    h1.innerHTML = modalCaption

    modal.setAttribute('id', 'workspace')
    button.setAttribute('id', 'modal-close')
    buttonCloseIcon.classList.add('fa-solid', 'fa-xmark')

    // main content
    const inputCaptionWorkspace = document.createElement('input')
    const textareaDescriptionWorkspace = document.createElement('textarea')
    const headerInputCaption = document.createElement('h2')
    const headerInputDescription = document.createElement('h2')
    const buttonSavingChanges = document.createElement('button')

    section.appendChild(headerInputCaption)
    section.appendChild(inputCaptionWorkspace)
    section.appendChild(headerInputDescription)
    section.appendChild(textareaDescriptionWorkspace)
    section.appendChild(buttonSavingChanges)

    inputCaptionWorkspace.setAttribute('id', 'inputCaptionWorkspace')
    inputCaptionWorkspace.setAttribute('placeholder', 'Введите название')
    inputCaptionWorkspace.setAttribute('maxlength', '50')
    textareaDescriptionWorkspace.setAttribute('id', 'textareaDescriptionWorkspace')
    textareaDescriptionWorkspace.setAttribute('placeholder', 'Введите описание')
    textareaDescriptionWorkspace.setAttribute('maxlength', '50')
    buttonSavingChanges.setAttribute('id', 'buttonSavingChanges')

    headerInputCaption.innerHTML = "Название"
    headerInputDescription.innerHTML = "Описание"
    buttonSavingChanges.innerHTML = 'Применить'

    if (modalHeader != '' || modalDescription != '') {
        inputCaptionWorkspace.value = modalHeader
        textareaDescriptionWorkspace.innerHTML = modalDescription
    }

    textareaDescriptionWorkspace.setAttribute('maxlength', maxChars)
    buttonSavingChanges.addEventListener('click', () => {
        const date = new Date()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        const lastChange = `${hours}:${minutes}:${seconds}`
        const workspace = document.querySelector('workspace')
        const workspaceContent = JSON.parse(localStorage.getItem(workspaceID))
        if (!inputCaptionWorkspace.value.length !== 0 || !textareaDescriptionWorkspace.value.length !== 0) {
            const workspaceData = {
                    'id': workspaceID,
                    'caption': inputCaptionWorkspace.value,
                    'description': textareaDescriptionWorkspace.value,
                    'lastChange': lastChange,
                    'pinned': workspace.getAttribute('pinned'),
                    'notes': workspaceContent.notes
                }
            localStorage.setItem(workspaceID, JSON.stringify(workspaceData))
            workspaceLoad(workspaceID)
            modal.style.animationName = "modalClose"
            background.style.animationName = "modalClose-background"
            background.addEventListener('animationend', () => {
                background.remove()
            })
            updateWorkspacesTab()
        }
    })

    button.addEventListener('click', () => {
        modal.style.animationName = "modalClose"
        background.style.animationName = "modalClose-background"
        background.addEventListener('animationend', () => {
            background.remove()
        })
    })
}

function allWorkspacesModalOpen(noteID) {
    const container = document.querySelector("modals")
    const background = document.createElement('background')
    const modal = document.createElement('modal_settings')
    const header = document.createElement('header')
    const section = document.createElement('section')
    const h1 = document.createElement('h1')
    const button = document.createElement('button')
    const buttonCloseIcon = document.createElement('i')

    container.appendChild(background)
    background.appendChild(modal)
    modal.appendChild(header)
    modal.appendChild(section)
    header.appendChild(button)
    button.appendChild(buttonCloseIcon)
    header.appendChild(h1)
    h1.innerHTML = 'Выберите папку'
    modal.setAttribute('id', 'workspace')
    button.setAttribute('id', 'modal-close')
    buttonCloseIcon.classList.add('fa-solid', 'fa-xmark')
    section.setAttribute('id', 'workspaceSelect')

    // main content
    let workspaces = []
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('workspace-')) {
            const workspaceData = JSON.parse(localStorage.getItem(key))
            workspaces.push(workspaceData)
        }
    }

    workspaces.sort((a, b) => {
        const idA = parseInt(a.id.replace('workspace-', ''), 10)
        const idB = parseInt(b.id.replace('workspace-', ''), 10)
        return idA - idB
    })

    if (workspaces.length > 0) {
        const speficalContainer = document.createElement('ul')
        speficalContainer.setAttribute('id','workspacesFound')
        const noteData = JSON.parse(localStorage.getItem(noteID))
        if (noteData.workspace === '') {
            workspaces.forEach((workspaceData) => {
                const article = document.createElement('article')
                const h2 = document.createElement('h2')
                section.appendChild(speficalContainer)
                speficalContainer.appendChild(article)
                article.appendChild(h2)
                if (workspaceData.caption.length > 15) {
                    h2.innerHTML = workspaceData.caption.substring(0,15) + "..."
                } else {
                    h2.innerHTML = workspaceData.caption
                }
                article.addEventListener('click', () => {
                    noteSetWorkspace(noteID,workspaceData.id)
                    notice(
                        'Система',
                        'Перенесено в папку «' + workspaceData.caption + '»'
                    )
                    modal.style.animationName = "modalClose"
                    background.style.animationName = "modalClose-background"
                    background.addEventListener('animationend', () => {
                        background.remove()
                    })
                })
            })
        } else {
            const buttonRemoveWorkspace = document.createElement('button')
            section.appendChild(buttonRemoveWorkspace)
            buttonRemoveWorkspace.setAttribute('id', 'buttonRemoveWorkspace')
            buttonRemoveWorkspace.innerHTML = 'Удалить из папки'
            buttonRemoveWorkspace.addEventListener('click', () => {
                removeNoteFromWorkspace(noteData.id)
                modal.style.animationName = "modalClose"
                background.style.animationName = "modalClose-background"
                background.addEventListener('animationend', () => {
                    background.remove()
                })
                notice(
                    "Система", "Успешно удалена из папки."
                )
            })
            const hr = document.createElement('hr')
            section.appendChild(hr)
            workspaces.forEach((workspaceData) => {
                const article = document.createElement('article')
                const h2 = document.createElement('h2')
                section.appendChild(speficalContainer)
                speficalContainer.appendChild(article)
                article.appendChild(h2)
                if (workspaceData.caption.length > 12) {
                    h2.innerHTML = workspaceData.caption.substring(0, 12) + "..."
                } else {
                    h2.innerHTML = workspaceData.caption
                }
                article.addEventListener('click', () => {
                    noteSetWorkspace(noteID,workspaceData.id)
                    modal.style.animationName = "modalClose"
                    background.style.animationName = "modalClose-background"
                    background.addEventListener('animationend', () => {
                        background.remove()
                    })
                })
            })
        }
    } else {
        const paragraph = document.createElement('div')
        const h4 = document.createElement('h4')
        section.appendChild(paragraph)
        paragraph.appendChild(h4)
        h4.innerHTML = 'Нет папок'
        paragraph.setAttribute('id','error_paragraph')
    }

    button.addEventListener('click', () => {
        modal.style.animationName = "modalClose"
        background.style.animationName = "modalClose-background"
        background.addEventListener('animationend', () => {
            background.remove()
        })
    })
}