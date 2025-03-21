function slideMenu(
    header_content = {
        'header': 'Pocket Notes',
        'homeButton': {
            'caption': 'Домашняя страница',
            'icon': 'fa-house',
            'id': 'openHomePage',
        }
    },
    main_content = {
        'note': {
            'header': 'Заметки',
            'button': {
                'caption': 'Создать заметку',
                'icon': 'fa-circle-plus',
                'id': 'create-note',
            }
        },
        'workspace': {
            'header': 'Папки',
            'button': {
                'caption': 'Создать папку',
                'icon': 'fa-folder-plus',
                'id': 'create-workspace',
            }
        },
    },
    footer_content = {
        'links': {
            'captions': ['Настройки', 'Конфиденциальность', 'GitHub'],
            'icons': ['fa-gear','fa-shield-halved','fa-github'],
            'token': ['fa-solid', 'fa-solid','fa-brands'],
            'ids': ['app-settings', 'privacy-policy', 'lasted-version'],
            'url': ['', '', 'https://github.com/levalyukov/notes-app']
        },
        'author': '© Miroro'
    }
) {
    const menuButton = document.getElementById('menu')
    const button = document.createElement('button')
    const buttonIcon = document.createElement('i')
    const buttonContainer = document.querySelector('buttoncontainer')
    const menuContainer = document.querySelector('menu_container')

    if (!buttonContainer.getAttribute('opened')) {
        buttonContainer.setAttribute('opened', true)
        menuButton.remove()
        buttonContainer.appendChild(button)
        button.appendChild(buttonIcon)
        button.setAttribute('id', 'menu')
        buttonIcon.classList.add('fa-solid', 'fa-xmark')
        button.addEventListener('click', () => {
            slideMenu()
        })
        const menu = document.createElement('aside')
        const header = document.createElement('ul')
        const workspaces = document.createElement('ul')
        const footer = document.createElement('ul')

        menuContainer.appendChild(menu)
        menu.appendChild(header)
        menu.appendChild(workspaces)

        header.setAttribute('id', 'header')
        workspaces.setAttribute('id', 'workspaces')
        if (header_content != {}) {
            if ('logo-url' in header_content) {
                const img = document.createElement('img')
                header.appendChild(img)
                img.setAttribute('src', header_content['logo-url'])
                img.addEventListener('click', () => {
                    if (screen.width > 750) {
                        openHomePage()
                    } else {
                        openHomePage()
                        slideMenu()
                    }
                })
            } if ('header' in header_content) {
                const h1 = document.createElement('h1')
                header.appendChild(h1)
                h1.innerHTML = header_content['header']
            } if ('homeButton' in header_content) {
                const button = document.createElement('a')
                header.appendChild(button)
                if ('icon' in header_content['homeButton']) {
                    const buttonIcon = document.createElement('i')
                    const buttonIconContainer = document.createElement('span')
                    button.appendChild(buttonIconContainer)
                    buttonIconContainer.appendChild(buttonIcon)
                    buttonIcon.classList.add('fa-solid', header_content['homeButton']['icon'])
                }

                button.innerHTML += ' ' + header_content['homeButton']['caption']
                button.addEventListener('click', () => {
                    if (screen.width > 750) {
                        openHomePage()
                    } else {
                        openHomePage()
                        slideMenu()
                    } 
                })
            }
        } if (main_content != {}) {

            let headers = []
            let captions = []
            let icons = []
            let ids = []

            for (let i in main_content) {
                if ('header' in main_content[i]) {
                    headers.push(main_content[i]['header'])
                } if ('button' in main_content[i]) {
                    if ('caption' in main_content[i]['button']) { 
                        captions.push(main_content[i]['button']['caption']) 
                    } if ('icon' in main_content[i]['button']) {
                        icons.push(main_content[i]['button']['icon'])
                    } if ('id' in main_content[i]['button']) {
                        ids.push(main_content[i]['button']['id'])
                    }
                }
            }
            // create elements
            if (ids != []) {
                for (let q = 0; q < ids.length; q++) {
                    if (ids != []) {
                        const newSection = document.createElement('ul')
                        workspaces.appendChild(newSection)
                        newSection.setAttribute('id', ids[q])
                        if (headers != []) {
                            const headerSection = document.createElement('h3')
                            newSection.appendChild(headerSection)
                            headerSection.innerHTML = headers[q]
                            if (captions != []) {
                                const button = document.createElement('a')
                                newSection.appendChild(button)
                                if (icons != []) { 
                                    const buttonIcon = document.createElement('i')
                                    const buttonIconContainer = document.createElement('span')      
                                    button.appendChild(buttonIconContainer)
                                    buttonIconContainer.appendChild(buttonIcon)
                                    buttonIcon.classList.add('fa-solid', icons[q])
                                } if (ids != []) {
                                    button.setAttribute('id', ids[q])
                                    if (ids[q] == "create-note") {
                                        button.addEventListener('click', () => {
                                            const containers = document.querySelectorAll('.note-content')
                                            if (containers.length === 0) {
                                                createNote()
                                                closeHomePage()
                                            } else {
                                                containers.forEach((element) => {
                                                    element.style.animationName = "contentRemove"
                                                    element.addEventListener('animationend', () => {
                                                        element.remove()
                                                    })
                                                })
                                                closeHomePage()
                                                createNote()
                                            }
                                            updateNotesTab()
                                            if (screen.width <= 750) {
                                                slideMenu()
                                            }
                                        })
                                    } if (ids[q] == "create-workspace") {
                                        button.addEventListener('click', () => {
                                            workspaceCreate()
                                            updateWorkspacesTab()
                                        })
                                    }
                                }
                                button.innerHTML += ' ' + captions[q]
                            } 
                        }
                    }
                }
            }
        } if (footer_content != {}) {
            menu.appendChild(footer)
            let links_captions
            let links_icons
            let links_token
            let links_ids
            let links_url
            if ('links' in footer_content) {
                if ('captions' in footer_content['links']) {
                    links_captions = footer_content['links']['captions']
                } if ('icons' in footer_content['links']) {
                    links_icons = footer_content['links']['icons']
                } if ('token' in footer_content['links']) {
                    links_token = footer_content['links']['token']
                } if ('ids' in footer_content['links']) {
                    links_ids = footer_content['links']['ids']
                } if ('url' in footer_content['links']) {
                    links_url = footer_content['links']['url']
                }
            } if (links_captions != []) {
                for (let i = 0; i < links_captions.length; i++) {
                    const link = document.createElement('a')
                    footer.appendChild(link)
                    if (links_icons[i] != undefined) {
                        const span = document.createElement('span')
                        const icon = document.createElement('i')
                        link.appendChild(span)
                        span.appendChild(icon)
                        icon.classList.add(links_token[i], links_icons[i])
                        if (links_url[i] != '') {
                            link.setAttribute('href', links_url[i])
                        }
                    } if (links_ids[i] != undefined) {
                        link.setAttribute('id', links_ids[i])
                        if (links_ids[i] == 'app-settings') {
                            const appSettingsButton = document.getElementById("app-settings")
                            appSettingsButton.addEventListener('click', () => openAppSettings())
                        } if (links_ids[i] == 'licenses') {
                            const appSettingsButton = document.getElementById("licenses")
                            appSettingsButton.addEventListener('click', () => licenseModal())
                        } if (links_ids[i] == 'privacy-policy') {
                            const appSettingsButton = document.getElementById("privacy-policy")
                            appSettingsButton.addEventListener('click', () => openPrivacyPolicy(
                                "Политика Конфиденциальности"
                            ))
                        }
                    }
                    link.innerHTML += ' ' + links_captions[i]
                }
            } if ('author' in footer_content) {
                const author = document.createElement('p')
                var date = new Date().getFullYear()
                footer.appendChild(author)
                author.classList.add('author')
                author.innerHTML = footer_content['author'] + ' ' + date
            }
        }
        
    } else {
        buttonContainer.removeAttribute('opened')
        menuButton.remove()
        buttonContainer.appendChild(button)
        button.appendChild(buttonIcon)
        button.setAttribute('id', 'menu')
        buttonIcon.classList.add('fa-solid', 'fa-bars')
        button.addEventListener('click', () => {
            slideMenu()
        })

        const menu = document.querySelector('aside')
        const section = document.createElement('ul')
        menu.style.animationName = "menuClose"
        menu.addEventListener('animationend', () => {
            menu.remove()
        })
    }
    updateNotesTab()
    updateWorkspacesTab()
}

function updateNotesTab() {
    const aside = document.querySelector('aside')
    const notes = []

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('note-')) {
            const noteData = JSON.parse(localStorage.getItem(key))
            if (noteData && noteData.id) {
                notes.push(noteData)
            }
        }
    }

    notes.sort((a, b) => {
        const idA = parseInt(a.id.replace('note-', ''), 10)
        const idB = parseInt(b.id.replace('note-', ''), 10)
        return idA - idB
    })

    const existingTabs = document.querySelectorAll('.note-tab')
    existingTabs.forEach((tab) => tab.remove())

    if (aside) {
        notes.forEach((noteData) => {
            const noteTab = document.createElement('a')
            const tabIcon = document.createElement('i')
            const tabIconContainer = document.createElement('span')
            const notesButtonRemove = document.createElement('button')
            const notesIconRemoveContainer = document.createElement('span')
            const notesIconRemove = document.createElement('i')
            const noteWorkspace = document.getElementById('create-note')
    
            noteWorkspace.appendChild(noteTab)
            noteTab.appendChild(tabIconContainer)
            tabIconContainer.appendChild(tabIcon)
            noteTab.classList.add('note-tab')
            tabIcon.classList.add('fa-solid', 'fa-note-sticky')
    
            if (noteData.caption != "") {
                if (noteData.caption.length > 15) {
                    noteTab.innerHTML += ' ' + noteData.caption.substring(0,15) + "..."
                } else {
                    noteTab.innerHTML += ' ' + noteData.caption
                }
            } else {
                noteTab.innerHTML += ' ' + 'Новая заметка'
            }
            noteTab.setAttribute('data-id', noteData.id)
            noteTab.appendChild(notesButtonRemove)
            notesButtonRemove.appendChild(notesIconRemoveContainer)
            notesIconRemoveContainer.appendChild(notesIconRemove)
            notesIconRemove.classList.add('fa-solid', 'fa-trash')
            notesButtonRemove.classList.add('remove_note')
    
            notesButtonRemove.addEventListener('click', (event) => {
                event.stopPropagation()
                removeNoteLocalStorage(noteData.id)
                const noteContainers = document.querySelectorAll('workspace');
                const workspaceContainers = document.querySelectorAll('workspace');
                noteContainers.forEach((element) => {
                    element.remove()
                })

                workspaceContainers.forEach((element) => {
                    element.style.animationName = "contentRemove"
                    element.addEventListener('animationend', () => {
                        element.remove()
                    })
                })
                openHomePage()
            })
            noteTab.addEventListener('click', () => {
                loadNoteContent(
                    noteData.id, 
                    noteData.caption, 
                    noteData.content, 
                    noteData.pinned,
                    noteData.workspace
                )
                closeHomePage()
                if (screen.width <= 750) {
                    slideMenu()
                }
            })
        })
    }
}

function updateWorkspacesTab() {
    const aside = document.querySelector('aside')
    const workspaces = []

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('workspace-')) {
            const workspaceData = JSON.parse(localStorage.getItem(key))
            if (workspaceData && workspaceData.id) {
                workspaces.push(workspaceData)
            }
        }
    }

    workspaces.sort((a, b) => {
        const idA = parseInt(a.id.replace('workspace-', ''), 10)
        const idB = parseInt(b.id.replace('workspace-', ''), 10)
        return idA - idB
    })

    const existingTabs = document.querySelectorAll('.workspace-tab')
    existingTabs.forEach((tab) => tab.remove())

    if (aside) {
        workspaces.forEach((workspaceData) => {
            const workspaceTab = document.createElement('a')
            const tabIcon = document.createElement('i')
            const tabIconContainer = document.createElement('span')
            const workspaceButtonRemove = document.createElement('button')
            const workspaceIconRemoveContainer = document.createElement('span')
            const workspaceIconRemove = document.createElement('i')
            const noteWorkspace = document.getElementById('create-workspace')
    
            noteWorkspace.appendChild(workspaceTab)
            workspaceTab.appendChild(tabIconContainer)
            tabIconContainer.appendChild(tabIcon)
            workspaceTab.classList.add('workspace-tab')
            tabIcon.classList.add('fa-solid', 'fa-folder')
    
            if (workspaceData.caption != "") {
                if (workspaceData.caption.length > 12) {
                    workspaceTab.innerHTML += ' ' + workspaceData.caption.substring(0,12) + "..."
                } else {
                    workspaceTab.innerHTML += ' ' + workspaceData.caption
                }
            } else {
                workspaceTab.innerHTML += ' ' + 'Новая папка'
            }
            workspaceTab.setAttribute('data-id', workspaceData.id)
            workspaceTab.appendChild(workspaceButtonRemove)
            workspaceTab.addEventListener('click', () => {
                workspaceLoad(
                    workspaceData.id,
                    workspaceData.caption,
                    workspaceData.description,
                )
                if (screen.width <= 750) {
                    slideMenu()
                }
            })

            workspaceButtonRemove.appendChild(workspaceIconRemoveContainer)
            workspaceIconRemoveContainer.appendChild(workspaceIconRemove)
            workspaceIconRemove.classList.add('fa-solid', 'fa-trash')
            workspaceButtonRemove.classList.add('remove_note')
            workspaceButtonRemove.addEventListener('click', (e) => {
                e.stopPropagation()
                workspaceRemove(workspaceData.id)
                updateWorkspacesTab()
                removeWorkspaceInNotes()
                const noteContainers = document.querySelectorAll('workspace');
                const workspaceContainers = document.querySelectorAll('workspace');
                noteContainers.forEach((element) => {
                    element.remove()
                })

                workspaceContainers.forEach((element) => {
                    element.style.animationName = "contentRemove"
                    element.addEventListener('animationend', () => {
                        element.remove()
                    })
                })
                openHomePage()
            })
        })
    }
}
