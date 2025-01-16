
const notesLastChangesMax = 3
let workspacesID = 0

function workspaceCreate(
    workspaceManipulationContent = {
        'functional': ['pinWorkspace', 'renameWorkspace', 'removeWorkspace'],
        'captions': ['Закрепить', 'Изменить', 'Удалить'],
        'icons': ['fa-thumbtack', 'fa-pen-to-square', 'fa-trash'],
    }) {
    const notes = document.querySelectorAll('.note-content')
    const workspaces = document.querySelectorAll('workspace')
    if (workspaces.length === 0 && notes.length === 0) {
        workspacesID++
        const main = document.getElementById('note')
        const workspace = document.createElement('workspace')
        const navWorkspaceMenu = document.createElement('nav')
        const navWorkspaceMenuButton = document.createElement('button')
        const navWorkspaceMenuButtonIcon = document.createElement('i')
        const navWorkspaceMenuButtonIconContainer = document.createElement('span')
        const workspaceHeader = document.createElement('h1')
        const workspaceDescription = document.createElement('description')
        const navWorkspaceMenuPins = document.createElement('pins')
        const id = 'workspace-'+workspacesID
        if (screen.width <= 750) {
            slideMenu()
        }
        closeHomePage()
        main.appendChild(workspace)
        workspace.appendChild(navWorkspaceMenu)
        workspace.appendChild(workspaceHeader)
        workspace.appendChild(workspaceDescription)

        workspaceHeader.setAttribute('id', 'workspaceHeader')
        workspaceDescription.setAttribute('id', 'workspaceDescription')

        workspace.setAttribute('pinned', 'false')

        navWorkspaceMenu.appendChild(navWorkspaceMenuPins)
        navWorkspaceMenu.appendChild(navWorkspaceMenuButton)
        navWorkspaceMenuButton.appendChild(navWorkspaceMenuButtonIconContainer)
        navWorkspaceMenuButtonIconContainer.appendChild(navWorkspaceMenuButtonIcon)
        navWorkspaceMenuButtonIcon.classList.add('fa-solid','fa-ellipsis')

        navWorkspaceMenu.setAttribute('id', 'workspaceManipulation')
        navWorkspaceMenuButton.setAttribute('id', 'workspaceManipulationButton')
        navWorkspaceMenuButton.addEventListener('click', (e) => {
            e.stopPropagation()
            const droplists = document.querySelectorAll('div#droplist')
            if (droplists.length === 0) {
                const droplist = document.createElement('div')
                droplist.setAttribute('id', 'droplist')
                navWorkspaceMenu.appendChild(droplist)
                if (workspaceManipulationContent != {}) {
                    let functional = []
                    let captions = []
                    let icons = []
                    for (let i in workspaceManipulationContent) {
                        if ('functional' in workspaceManipulationContent) {
                            functional = workspaceManipulationContent['functional']
                        } if ('captions' in workspaceManipulationContent) {
                            captions = workspaceManipulationContent['captions']
                        } if ('icons' in workspaceManipulationContent) {
                            icons = workspaceManipulationContent['icons']
                        }
                    }
                    if (functional != []) {
                        for (let i = 0; i < functional.length; i++) {
                            const droplistButton = document.createElement('a')
                            droplistButton.classList.add('item')
                            droplist.appendChild(droplistButton)
                            if (icons != []) {
                                const droplistButtonIcon = document.createElement('i')
                                const droplistButtonIconContainer = document.createElement('span')
                                droplistButton.appendChild(droplistButtonIconContainer)
                                droplistButtonIconContainer.appendChild(droplistButtonIcon)
                                if (functional[i] === 'pinWorkspace') {
                                    if (workspace.getAttribute('pinned') === 'false') {
                                        droplistButtonIcon.classList.add('fa-solid', 'fa-thumbtack')
                                    } else if (workspace.getAttribute('pinned') === 'true') {
                                        droplistButtonIcon.classList.add('fa-solid', 'fa-thumbtack-slash')
                                    }
                                } else {
                                    droplistButtonIcon.classList.add('fa-solid', icons[i])
                                }
                            } if (captions != []) {
                                if (captions[i] === 'Закрепить') {
                                    if (workspace.getAttribute('pinned') === 'false') {
                                        droplistButton.innerHTML += ' ' + captions[i]
                                    } else if (workspace.getAttribute('pinned') === 'true') {
                                        droplistButton.innerHTML += ' Открепить'
                                    }
                                } else {
                                    droplistButton.innerHTML += ' ' + captions[i]
                                }
                            }

                            if (functional[i] == "pinWorkspace") {
                                droplistButton.addEventListener('click', () => {
                                    if (workspace.getAttribute('pinned') === 'false') {
                                        workspace.setAttribute('pinned', 'true')
                                        workspaceUpdate(id)
                                        const buttonPinned = document.createElement('button')
                                        const buttonPinnedIcon = document.createElement('i')
                                        const buttonPinnedIconContainer = document.createElement('span')
                                        navWorkspaceMenuPins.appendChild(buttonPinned)
                                        buttonPinned.appendChild(buttonPinnedIconContainer)
                                        buttonPinnedIconContainer.appendChild(buttonPinnedIcon)
                                        buttonPinnedIcon.classList.add('fa-solid', 'fa-thumbtack')
                                        buttonPinnedIcon.setAttribute('id', 'pinnedIcon')

                                        buttonPinned.addEventListener('click', () => {
                                            buttonPinned.remove()
                                            workspace.setAttribute('pinned', 'false')
                                            const droplistMenu = document.querySelectorAll('div#droplist')
                                            workspaceUpdate(id)
                                            droplistMenu.forEach((e) => {
                                                e.remove()
                                            })
                                        })

                                        buttonPinned.addEventListener('mouseenter', () => {
                                            const iconElement = document.getElementById('pinnedIcon')
                                            if (!iconElement) {
                                                iconElement.classList.add('fa-solid', 'fa-thumbtack-slash')
                                            } else {
                                                iconElement.classList.remove('fa-thumbtack')
                                                iconElement.classList.add('fa-thumbtack-slash')
                                            }
                                        })

                                        buttonPinned.addEventListener('mouseleave', () => {
                                            const iconElement = document.getElementById('pinnedIcon')
                                            if (iconElement) {
                                                iconElement.classList.remove('fa-thumbtack-slash')
                                                iconElement.classList.add('fa-thumbtack')
                                            }
                                        })
                                    } else {
                                        workspace.setAttribute('pinned', 'false')
                                        workspaceUpdate(id)
                                    }
                                    droplist.remove()
                                })
                            } if (functional[i] == "renameWorkspace") {
                                droplistButton.addEventListener('click', () => {
                                    workspaceChangerModal(id, 'Изменения области', workspaceHeader.textContent, workspaceDescription.textContent)
                                    droplist.remove()
                                })
                            } if (functional[i] == "removeWorkspace") {
                                droplistButton.addEventListener('click', () => {
                                    const workspaces = document.querySelectorAll('workspace')
                                    workspaces.forEach((e) => {
                                        e.remove()
                                    })
                                    openHomePage()
                                    workspaceRemove(id)
                                })
                            }
                        }
                    }
                }
            } else {
                droplists.forEach((e) => {
                    e.remove()
                })
            }
        })
    
        workspaceHeader.innerHTML = 'Рабочая область #' + workspacesID
        workspaceDescription.innerHTML = 'Описание можно изменить в настройках рабочего пространства.'
 
        const paragraph = document.createElement('p')
        workspace.appendChild(paragraph)
        paragraph.innerHTML = 'В данной области нет заметок.'

        const date = new Date()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        const lastChange = `${hours}:${minutes}:${seconds}`
        const workspaceData = {
            'id': id,
            'caption': workspaceHeader.textContent,
            'description': workspaceDescription.textContent,
            'lastChange': lastChange,
            'pinned': workspace.getAttribute('pinned')
        }
        localStorage.setItem(id, JSON.stringify(workspaceData))
    } else {
        workspaces.forEach((e) => {
            e.remove()
        })
        notes.forEach((e) => {
            e.remove()
        })
        workspaceCreate()
    }
    
}

function workspaceLoad(
    index,
    header,
    description,
    workspaceManipulationContent = {
        'functional': ['pinWorkspace', 'renameWorkspace', 'removeWorkspace'],
        'captions': ['Закрепить', 'Изменить', 'Удалить'],
        'icons': ['fa-thumbtack', 'fa-pen-to-square', 'fa-trash'],
    }
    ) {
    const notes = document.querySelectorAll('.note-content')
    const workspaces = document.querySelectorAll('workspace')
    if (workspaces.length === 0 && notes.length === 0) {
        const workspaceData = JSON.parse(localStorage.getItem(index))

        const main = document.getElementById('note')
        const workspace = document.createElement('workspace')
        const navWorkspaceMenu = document.createElement('nav')
        const navWorkspaceMenuButton = document.createElement('button')
        const navWorkspaceMenuButtonIcon = document.createElement('i')
        const navWorkspaceMenuButtonIconContainer = document.createElement('span')
        const workspaceHeader = document.createElement('h1')
        const workspaceDescription = document.createElement('description')
        const navWorkspaceMenuPins = document.createElement('pins')
        const id = index
        
        if (screen.width <= 750) {
            slideMenu()
        }
        closeHomePage()

        main.appendChild(workspace)
        workspace.appendChild(navWorkspaceMenu)
        workspace.appendChild(workspaceHeader)
        workspace.appendChild(workspaceDescription)
        workspace.setAttribute('pinned', workspaceData.pinned)

        workspaceHeader.setAttribute('id', 'workspaceHeader')
        workspaceDescription.setAttribute('id', 'workspaceDescription')

        if (workspaceData.pinned) {
            if (workspaceData.pinned === "true") {
                const buttonPinned = document.createElement('button')
                const buttonPinIcon = document.createElement('i')
                const buttonPinIconContainer = document.createElement('span')
                navWorkspaceMenuPins.appendChild(buttonPinned)
                buttonPinned.setAttribute('id', 'buttonPinned')
                buttonPinned.appendChild(buttonPinIconContainer)
                buttonPinIconContainer.appendChild(buttonPinIcon)
                buttonPinIcon.classList.add('fa-solid','fa-thumbtack')
                buttonPinIcon.setAttribute('id', 'pinIcon')
                buttonPinned.addEventListener('click', () => {
                    buttonPinned.remove()
                    workspace.setAttribute('pinned', 'false')
                    workspaceUpdate(index)
                    const droplistMenu = document.querySelectorAll('div#droplist')
                    droplistMenu.forEach((e) => {
                        e.remove()
                    })
                })
                buttonPinned.addEventListener('mouseenter', () => {
                    const iconElement = document.getElementById('pinIcon')
                    if (!iconElement) {
                        buttonPinIcon.classList.add('fa-solid', 'fa-thumbtack-slash')
                    } else {
                        iconElement.classList.remove('fa-thumbtack')
                        iconElement.classList.add('fa-thumbtack-slash')
                    }
                })
                
                buttonPinned.addEventListener('mouseleave', () => {
                    const iconElement = document.getElementById('pinIcon')
                    if (iconElement) {
                        iconElement.classList.remove('fa-thumbtack-slash')
                        iconElement.classList.add('fa-thumbtack')
                    }
                })
            }
        }  

        navWorkspaceMenu.appendChild(navWorkspaceMenuPins)
        navWorkspaceMenu.appendChild(navWorkspaceMenuButton)
        navWorkspaceMenuButton.appendChild(navWorkspaceMenuButtonIconContainer)
        navWorkspaceMenuButtonIconContainer.appendChild(navWorkspaceMenuButtonIcon)
        navWorkspaceMenuButtonIcon.classList.add('fa-solid','fa-ellipsis')

        navWorkspaceMenu.setAttribute('id', 'workspaceManipulation')
        navWorkspaceMenuButton.setAttribute('id', 'workspaceManipulationButton')
        navWorkspaceMenuButton.addEventListener('click', (e) => {
            e.stopPropagation()
            const droplists = document.querySelectorAll('div#droplist')
            if (droplists.length === 0) {
                const droplist = document.createElement('div')
                droplist.setAttribute('id', 'droplist')
                navWorkspaceMenu.appendChild(droplist)
                if (workspaceManipulationContent != {}) {
                    let functional = []
                    let captions = []
                    let icons = []
                    for (let i in workspaceManipulationContent) {
                        if ('functional' in workspaceManipulationContent) {
                            functional = workspaceManipulationContent['functional']
                        } if ('captions' in workspaceManipulationContent) {
                            captions = workspaceManipulationContent['captions']
                        } if ('icons' in workspaceManipulationContent) {
                            icons = workspaceManipulationContent['icons']
                        }
                    }
                    if (functional != []) {
                        for (let i = 0; i < functional.length; i++) {
                            const droplistButton = document.createElement('a')
                            droplistButton.classList.add('item')
                            droplist.appendChild(droplistButton)
                            if (icons != []) {
                                const droplistButtonIcon = document.createElement('i')
                                const droplistButtonIconContainer = document.createElement('span')
                                droplistButton.appendChild(droplistButtonIconContainer)
                                droplistButtonIconContainer.appendChild(droplistButtonIcon)
                                if (functional[i] === 'pinWorkspace') {
                                    if (workspace.getAttribute('pinned') === 'false') {
                                        droplistButtonIcon.classList.add('fa-solid', 'fa-thumbtack')
                                    } else if (workspace.getAttribute('pinned') === 'true') {
                                        droplistButtonIcon.classList.add('fa-solid', 'fa-thumbtack-slash')
                                    }
                                } else {
                                    droplistButtonIcon.classList.add('fa-solid', icons[i])
                                }
                            } if (captions != []) {
                                if (captions[i] === 'Закрепить') {
                                    if (workspace.getAttribute('pinned') === 'false') {
                                        droplistButton.innerHTML += ' ' + captions[i]
                                    } else if (workspace.getAttribute('pinned') === 'true') {
                                        droplistButton.innerHTML += ' Открепить'
                                    }
                                } else {
                                    droplistButton.innerHTML += ' ' + captions[i]
                                }
                            }

                            if (functional[i] == "pinWorkspace") {
                                droplistButton.addEventListener('click', () => {
                                    const buttonPinneds = document.querySelectorAll('button#buttonPinned')
                                    if (buttonPinneds.length === 0) {
                                        if (workspace.getAttribute('pinned') === 'false') {
                                            workspace.setAttribute('pinned', 'true')
                                            workspaceUpdate(index)
                                            const buttonPinned = document.createElement('button')
                                            const buttonPinnedIcon = document.createElement('i')
                                            const buttonPinnedIconContainer = document.createElement('span')
                                            navWorkspaceMenuPins.appendChild(buttonPinned)
                                            buttonPinned.appendChild(buttonPinnedIconContainer)
                                            buttonPinnedIconContainer.appendChild(buttonPinnedIcon)
                                            buttonPinnedIcon.classList.add('fa-solid', 'fa-thumbtack')
                                            buttonPinnedIcon.setAttribute('id', 'pinnedIcon')
                                            buttonPinned.setAttribute('id', 'buttonPinned')
    
                                            buttonPinned.addEventListener('click', () => {
                                                buttonPinned.remove()
                                                workspace.setAttribute('pinned', 'false')
                                                const droplistMenu = document.querySelectorAll('div#droplist')
                                                workspaceUpdate(index)
                                                droplistMenu.forEach((e) => {
                                                    e.remove()
                                                })
    
                                                const buttonPinneds = document.querySelectorAll('button#buttonPinned')
                                                if (buttonPinneds.length > 0) {
                                                    buttonPinneds.forEach((e) => {
                                                        e.remove()
                                                    })
                                                }
                                            })
    
                                            buttonPinned.addEventListener('mouseenter', () => {
                                                const iconElement = document.getElementById('pinnedIcon')
                                                if (!iconElement) {
                                                    iconElement.classList.add('fa-solid', 'fa-thumbtack-slash')
                                                } else {
                                                    iconElement.classList.remove('fa-thumbtack')
                                                    iconElement.classList.add('fa-thumbtack-slash')
                                                }
                                            })
    
                                            buttonPinned.addEventListener('mouseleave', () => {
                                                const iconElement = document.getElementById('pinnedIcon')
                                                if (iconElement) {
                                                    iconElement.classList.remove('fa-thumbtack-slash')
                                                    iconElement.classList.add('fa-thumbtack')
                                                }
                                            })
                                        } else {
                                            workspace.setAttribute('pinned', 'false')
                                            workspaceUpdate(index)
                                            const buttonPinneds = document.querySelectorAll('button#buttonPinned')
                                            if (buttonPinneds.length > 0) {
                                                buttonPinneds.forEach((e) => {
                                                    e.remove()
                                                })
                                            }
                                        }
                                    } else {
                                        workspace.setAttribute('pinned', 'false')
                                        workspaceUpdate(index)
                                        const buttonPinneds = document.querySelectorAll('button#buttonPinned')
                                        buttonPinneds.forEach((e) => {
                                            e.remove()
                                        })
                                    }
                                    droplist.remove()
                                })
                            } if (functional[i] == "renameWorkspace") {
                                droplistButton.addEventListener('click', () => {
                                    workspaceChangerModal(id, 'Изменения области', workspaceHeader.textContent, workspaceDescription.textContent)
                                    droplist.remove()
                                })
                            } if (functional[i] == "removeWorkspace") {
                                droplistButton.addEventListener('click', () => {
                                    const workspaces = document.querySelectorAll('workspace')
                                    workspaces.forEach((e) => {
                                        e.remove()
                                    })
                                    openHomePage()
                                    workspaceRemove(id)
                                })
                            }
                        }
                    }
                }
            } else {
                droplists.forEach((e) => {
                    e.remove()
                })
            }
        })

        workspaceHeader.innerHTML = workspaceData.caption
        workspaceDescription.innerHTML = workspaceData.description

        const noteLastChanges = []
        const allNotes = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key.startsWith('note-')) {
                const workspaceData = JSON.parse(localStorage.getItem(key))
                if (workspaceData.workspace === index) {
                    allNotes.push(workspaceData)
                    noteLastChanges.push(workspaceData)
                }
            }
        }
        noteLastChanges.sort((a, b) => {
            const idA = parseInt(a.id.replace('note-', ''), 10)
            const idB = parseInt(b.id.replace('note-', ''), 10)
            return b.lastChange.localeCompare(a.lastChange);
        })
        
        allNotes.sort((a, b) => {
            if (a.pinned === "true" && b.pinned !== "true") return -1;
            if (a.pinned !== "true" && b.pinned === "true") return 1;
            return b.lastChange.localeCompare(a.lastChange);
        })

        if (noteLastChanges.length > 0) {
            const articleContainer = document.createElement('container')
            const lastChangesHeader = document.createElement('p')
            const recentChangesSection = document.createElement('section')
            workspace.appendChild(recentChangesSection)
            recentChangesSection.appendChild(lastChangesHeader)
            recentChangesSection.appendChild(articleContainer)
            lastChangesHeader.innerHTML = 'Последние изменения:'
            noteLastChanges.forEach((note) => {
                const articles = document.querySelectorAll('article#lastchanges')
                if (articles.length < notesLastChangesMax) {
                    const article = document.createElement('article')
                    articleContainer.appendChild(article)
                    const caption = document.createElement('h3')
                    const content = document.createElement('p')
                    const footer = document.createElement('footer')
                    const datetime = document.createElement('datetime')
                    const pins = document.createElement('pins')
                    article.setAttribute('id', 'lastchanges')
    
                    articleContainer.appendChild(article)
                    article.appendChild(caption)
                    article.appendChild(content)
                    article.appendChild(footer)
                    footer.appendChild(pins)
                    footer.appendChild(datetime)
                    if (note.caption == '') {
                        caption.innerHTML = 'Новая заметка #' + note.id.substring(5)
                    } else {
                        if (note.caption.length > 22) {
                            caption.innerHTML = note.caption.substring(0, 22) + "..."
                        } else {
                            caption.innerHTML = note.caption
                        }
                    } if (note.content == '') {
                        content.innerHTML = 'Заметка пустая'
                    } else {
                        if (note.content.length > 125) {
                            content.innerHTML = note.content.substring(0, 100) + "..."
                        } else {
                            content.innerHTML = note.content
                        }
                    } if (note.lastChange != undefined) {
                        datetime.innerHTML = note.lastChange.substring(0,5)
                    } if (note.pinned != undefined) {
                        if (note.pinned == 'true') {
                            const noteIcon = document.createElement('i')
                            const noteIconContainer = document.createElement('span')
                            pins.appendChild(noteIconContainer)
                            noteIconContainer.appendChild(noteIcon)
                            noteIcon.classList.add('fa-solid','fa-thumbtack')
                        }
                    }
    
                    article.addEventListener('click', () => {
                        loadNoteContent(
                            note.id, 
                            note.caption, 
                            note.content, 
                            note.pinned, 
                            note.workspace
                        )
                        closeHomePage()
                    })
                }
            })
        } if (allNotes.length > 0) {
            const articleContainer = document.createElement('container')
            const lastChangesHeader = document.createElement('p')
            const recentChangesSection = document.createElement('section')
            workspace.appendChild(recentChangesSection)
            recentChangesSection.appendChild(lastChangesHeader)
            recentChangesSection.appendChild(articleContainer)
            lastChangesHeader.innerHTML = 'Все заметки'
            allNotes.forEach((note) => {
                const articles = document.querySelectorAll('article#lastchanges')
                const article = document.createElement('article')
                articleContainer.appendChild(article)
                const caption = document.createElement('h3')
                const content = document.createElement('p')
                const footer = document.createElement('footer')
                const datetime = document.createElement('datetime')
                const pins = document.createElement('pins')
                article.setAttribute('id', 'lastchanges')

                articleContainer.appendChild(article)
                article.appendChild(caption)
                article.appendChild(content)
                article.appendChild(footer)
                footer.appendChild(pins)
                footer.appendChild(datetime)
                if (note.caption == '') {
                    caption.innerHTML = 'Новая заметка #' + note.id.substring(5)
                } else {
                    if (note.caption.length > 22) {
                        caption.innerHTML = note.caption.substring(0, 22) + "..."
                    } else {
                        caption.innerHTML = note.caption
                    }
                } if (note.content == '') {
                    content.innerHTML = 'Заметка пустая'
                } else {
                    if (note.content.length > 125) {
                        content.innerHTML = note.content.substring(0, 100) + "..."
                    } else {
                        content.innerHTML = note.content
                    }
                } if (note.lastChange != undefined) {
                    datetime.innerHTML = note.lastChange.substring(0,5)
                } if (note.pinned != undefined) {
                    if (note.pinned == 'true') {
                        const noteIcon = document.createElement('i')
                        const noteIconContainer = document.createElement('span')
                        pins.appendChild(noteIconContainer)
                        noteIconContainer.appendChild(noteIcon)
                        noteIcon.classList.add('fa-solid','fa-thumbtack')
                    }
                }

                article.addEventListener('click', () => {
                    loadNoteContent(
                        note.id, 
                        note.caption, 
                        note.content, 
                        note.pinned, 
                        note.workspace
                    )
                    closeHomePage()
                })  
            })
        }
        
        
        else {
            const paragraph = document.createElement('p')
            workspace.appendChild(paragraph)
            paragraph.innerHTML = 'В данной области нет заметок.'
        }

    } else {
        workspaces.forEach((e) => {
            e.remove()
        })
        notes.forEach((e) => {
            e.remove()
        })
        workspaceLoad(index, header, description)
    }
}

function workspaceRemove(id) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key == id) {
            localStorage.removeItem(id)
        }
    }

    workspacesID = 0
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('workspace-')) {
            workspacesID+=1
        }
    }

    const menuOpened = document.querySelector('aside')
    if (menuOpened) {
        updateWorkspacesTab()
    }
    openHomePage()
}

function workspaceUpdate(id) {
    const workspacePinned = document.querySelector('workspace')
    const workspaceCaption = document.getElementById('workspaceHeader')
    const workspaceDescription = document.getElementById('workspaceDescription')
    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const lastChange = `${hours}:${minutes}:${seconds}`
    const workspaceData = {
        'id': id,
        'caption': workspaceCaption.textContent,
        'description': workspaceDescription.textContent,
        'lastChange': lastChange,
        'pinned': workspacePinned.getAttribute('pinned'),
    }
    localStorage.setItem(id, JSON.stringify(workspaceData))
}

function removeNoteFromWorkspace(noteID) {
    const noteData = JSON.parse(localStorage.getItem(noteID))
    if (noteID) {
        const newData = {
            'id': noteID,
            'caption': noteData.caption,
            'content': noteData.content,
            'lastChange': noteData.lastChange,
            'pinned': noteData.pinned,
            'workspace': ''
        }
        localStorage.setItem(noteID, JSON.stringify(newData))
    }
}

function removeWorkspaceInNotes() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('note-')) {
            const noteData = JSON.parse(localStorage.getItem(key))
            if (noteData.workspace) {
                if (noteData.workspace) {
                    removeNoteFromWorkspace(noteData.id)
                }
            }
        }
    }
}