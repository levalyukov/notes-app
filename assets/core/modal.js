function openAppSettings(
    captions = ['Тема', 'Язык', 'Очистить кэш'], 
    icons = ['fa-palette', 'fa-globe', 'fa-trash-can'], 
    contents = {
        'theme': {
            'type': 'select',
            'value': ['light'],
            'caption': ['Светлая'],
            },
        'language': {
            'type': 'select',
            'value': ['ru-ru'],
            'caption': ['Русский'],
            },
        'clear-hash': {
            'type': 'button',
            'caption': ['Очистить'],
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
        if (contents != {}) {
            for (let i in contents) {
                if ('type' in contents[i]) {
                    content_type.push(contents[i]["type"])
                } if ('value' in contents[i]) {
                    content_values.push(contents[i]["value"])
                } if ('caption' in contents[i]) {
                    content_captions.push(contents[i]["caption"])
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
                    for (let m = 0; m < content_values[i].length; m++) {
                        const option = document.createElement('option')
                        select.appendChild(option)
                        if (content_captions[i][m] !== undefined && content_captions[i][m] !== '') {
                            option.innerHTML += content_captions[i][m]
                        } if (content_values[i][m] !== undefined && content_values[i][m] !== '') {
                            option.setAttribute('value', content_values[i][m])
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
                        button_captions = ['Отмена', 'Очистить']
                        button_classes = ['cancel', 'apply']
                        if (!button.getAttribute('clicked')) {
                            button.setAttribute('clicked', true)
                            if (button_captions != [] && button_classes != []) {
                                const footer = document.createElement('footer')
                                const importantInfo = document.createElement('p')
                                modal.appendChild(footer)
                                section.appendChild(importantInfo)
                                importantInfo.innerText = "Внимание! Очистка кэша приведет к удалению всех заметок."
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
                                                footer.remove()
                                                importantInfo.remove()
                                                button.removeAttribute('clicked')
                                                hashClear()
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
        'Приложение для заметок хранит данные только локально на вашем устройстве с использованием LocalStorage. \n\nСохраняются: \n- Заголовки и содержимое заметок.',
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