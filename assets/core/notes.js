let noteIDCount = 0
function createNote(
    noteManipulationContent = {
        'functional': ['pinNote', 'moveWorkspace', 'removeNote'],
        'captions': ['Закрепить', 'Переместить в область', 'Удалить'],
        'icons': ['fa-thumbtack', 'fa-file-arrow-up', 'fa-trash'],
    }
    ) {
    noteIDCount++
    const main = document.getElementById('note')
    const container = document.createElement('main')
    const caption = document.createElement('input')
    const content = document.createElement('textarea')

    const navContainer = document.createElement('nav')
    const pins = document.createElement('pins')
    const noteManipulationButton = document.createElement('button')
    const noteManipulationIcon = document.createElement('i')
    const noteManipulationIconContainer = document.createElement('span')

    let id = "note-"+noteIDCount

    navContainer.classList.add('note-manipulation')
    noteManipulationButton.setAttribute('id', 'noteManipulationButton')
    noteManipulationIcon.classList.add('fa-solid','fa-ellipsis')

    main.appendChild(container)
    container.classList.add('note-content')
    
    // note manipulation menu 
    container.appendChild(navContainer)
    navContainer.appendChild(pins)
    navContainer.appendChild(noteManipulationButton)
    noteManipulationButton.appendChild(noteManipulationIconContainer)
    noteManipulationIconContainer.appendChild(noteManipulationIcon)

    container.appendChild(caption)
    container.appendChild(content)
    caption.classList.add('noteCaption')
    content.classList.add('noteContent')

    caption.setAttribute('placeholder', 'Заголовок')
    content.setAttribute('placeholder', 'Начните излагать свои мысли')

    caption.value = ""
    content.value = ""

    caption.addEventListener('input', () => saveNoteLocalStorage(id))
    content.addEventListener('input', () => saveNoteLocalStorage(id))
    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const lastChange = `${hours}:${minutes}:${seconds}`
    const noteData = {
        'id': id,
        'caption': caption.value,
        'content': content.value,
        'lastChange': lastChange,
        'pinned': 'false',
        'workspace': ''
    }
    localStorage.setItem(id, JSON.stringify(noteData))
    document.title = 'Pocket Notes: ' + 'Новая заметка #' + noteIDCount

    container.setAttribute('pinned', false)
    noteManipulationButton.addEventListener('click', () => {
        const droplists = document.querySelectorAll('div#droplist')
        if (droplists.length == 0) {
            if (noteManipulationContent != {}) {
                let functional = []
                let captions = []
                let icons = []
                if ('functional' in noteManipulationContent) {
                    functional = noteManipulationContent['functional']
                } if ('captions' in noteManipulationContent) {
                    captions = noteManipulationContent['captions']
                } if ('icons' in noteManipulationContent) {
                    icons = noteManipulationContent['icons']
                }
                
                if (functional != [] && captions!= [] && icons != []) {
                    const droplist = document.createElement('div')
                    navContainer.appendChild(droplist)
                    droplist.setAttribute('id', 'droplist')
                    for (let i = 0; i < captions.length; i++) {
                        const item = document.createElement('a')
                        if (icons[i] != undefined) {
                            const itemIcon = document.createElement('i')
                            const itemIconContainer = document.createElement('span')
                            item.appendChild(itemIconContainer)
                            itemIconContainer.appendChild(itemIcon)
                            if (icons[i] == 'fa-thumbtack' && container.getAttribute('pinned') == 'true') {
                                itemIcon.classList.add('fa-solid', 'fa-thumbtack-slash')
                            } else {
                                itemIcon.classList.add('fa-solid', icons[i])
                            }
                            if (functional[i] != undefined) {
                                if (functional[i] == "pinNote") {
                                    if (container.getAttribute('pinned') == 'false') {
                                        item.addEventListener('click', () => {
                                            if (container.getAttribute('pinned') === "false") {
                                                container.setAttribute('pinned', 'true')
                                                const buttonPin = document.createElement('button')
                                                const buttonPinIcon = document.createElement('i')
                                                const buttonPinIconContainer = document.createElement('span')
                                                pins.appendChild(buttonPin)
                                                buttonPin.appendChild(buttonPinIconContainer)
                                                buttonPinIconContainer.appendChild(buttonPinIcon)
                                                buttonPinIcon.classList.add('fa-solid','fa-thumbtack')
                                                buttonPinIcon.setAttribute('id', 'pinIcon')
                                                buttonPin.setAttribute('id', 'pin')
                                                buttonPin.addEventListener('click', () => {
                                                    buttonPin.remove()
                                                    container.setAttribute('pinned', 'false')
                                                    const droplistMenu = document.querySelectorAll('div#droplist')
                                                    droplistMenu.forEach((e) => {
                                                        e.remove()
                                                    })
                                                    saveNoteLocalStorage(id)
                                                })
                                                buttonPin.addEventListener('mouseenter', () => {
                                                    const iconElement = document.getElementById('pinIcon')
                                                    if (!iconElement) {
                                                        iconElement.classList.add('fa-solid', 'fa-thumbtack-slash')
                                                    } else {
                                                        iconElement.classList.remove('fa-thumbtack')
                                                        iconElement.classList.add('fa-thumbtack-slash')
                                                    }
                                                })
                                                
                                                buttonPin.addEventListener('mouseleave', () => {
                                                    const iconElement = document.getElementById('pinIcon')
                                                    if (iconElement) {
                                                        iconElement.classList.remove('fa-thumbtack-slash')
                                                        iconElement.classList.add('fa-thumbtack')
                                                    }
                                                })                                            
                                            }
                                            saveNoteLocalStorage(id)
                                            droplist.remove()
                                        })
                                    } else {
                                        item.addEventListener('click', () => {
                                            const buttonPin = document.getElementById('pin')
                                            buttonPin.remove()
                                            container.setAttribute('pinned', 'false')
                                            saveNoteLocalStorage(id)
                                            droplist.remove()
                                        })
                                    }
                                }  if (functional[i] == "moveWorkspace") {
                                    item.addEventListener('click', () => {
                                        allWorkspacesModalOpen(id)
                                        droplist.remove()
                                        if (screen.width <= 750) {
                                            slideMenu()
                                        }
                                    })
                                } if (functional[i] == "removeNote") {
                                    item.addEventListener('click', (event) => {
                                        removeNoteLocalStorage(id)
                                        droplist.remove()
                                        if (screen.width <= 750) {
                                            slideMenu()
                                        }
                                    })
                                }
                            }
                        }

                        droplist.appendChild(item)
                        item.classList.add('item')
                        if (captions[i] == "Закрепить" && container.getAttribute('pinned') == 'true') {
                            item.innerHTML += ' Открепить'
                        } else {
                            item.innerHTML += ' ' + captions[i]
                        }
                    }
                }
            }
        } else {
            droplists.forEach((element) => {
                element.remove()
            })
        }
    })

    const workspaceWindow = document.querySelectorAll('workspace')
    if (workspaceWindow.length > 0) {
        workspaceWindow.forEach((e) => {
            e.remove()
        })
    }
}

function loadNote(
    index, 
    header, 
    description, 
    pinned,
    workspace,
    noteManipulationContent = {
        'functional': ['pinNote', 'moveWorkspace', 'removeNote'],
        'captions': ['Закрепить', 'Переместить в область', 'Удалить'],
        'icons': ['fa-thumbtack', 'fa-file-arrow-up', 'fa-trash'],
    }
    ) {
    const main = document.getElementById('note')
    const container = document.createElement('main')
    const caption = document.createElement('input')
    const content = document.createElement('textarea')
    let id = index

    const navContainer = document.createElement('nav')
    const pins = document.createElement('pins')
    const noteManipulationButton = document.createElement('button')
    const noteManipulationIcon = document.createElement('i')
    const noteManipulationIconContainer = document.createElement('span')

    main.appendChild(container)
    navContainer.classList.add('note-manipulation')
    noteManipulationButton.setAttribute('id', 'noteManipulationButton')
    noteManipulationIcon.classList.add('fa-solid','fa-ellipsis')
    container.appendChild(navContainer)
    navContainer.appendChild(pins)
    navContainer.appendChild(noteManipulationButton)
    noteManipulationButton.appendChild(noteManipulationIconContainer)
    noteManipulationIconContainer.appendChild(noteManipulationIcon)
    container.classList.add('note-content')
    container.appendChild(caption)
    container.appendChild(content)
    caption.classList.add('noteCaption')
    content.classList.add('noteContent')

    caption.setAttribute('placeholder', 'Заголовок')
    content.setAttribute('placeholder', 'Начните излагать свои мысли')

    caption.value = header
    content.value = description

    caption.addEventListener('input', () => saveNoteLocalStorage(id))
    content.addEventListener('input', () => saveNoteLocalStorage(id))
    if (header != '') {
        if (header.length > 14) {
            document.title = 'Pocket Notes: ' + header.substring(0,14) + '...'
        } else {
            document.title = 'Pocket Notes: ' + header
        }
    } else {
        document.title = 'Pocket Notes: ' + 'Новая заметка #' + index.substring(5)
    }

    if (pinned != null) {
        container.setAttribute('pinned', pinned)
        if (pinned == 'true') {
            const buttonPin = document.createElement('button')
            const buttonPinIcon = document.createElement('i')
            const buttonPinIconContainer = document.createElement('span')
            pins.appendChild(buttonPin)
            buttonPin.appendChild(buttonPinIconContainer)
            buttonPinIconContainer.appendChild(buttonPinIcon)
            buttonPinIcon.classList.add('fa-solid','fa-thumbtack')
            buttonPinIcon.setAttribute('id', 'pinIcon')
            buttonPin.setAttribute('id', 'pin')
            buttonPin.addEventListener('click', () => {
                buttonPin.remove()
                container.setAttribute('pinned', 'false')
                saveNoteLocalStorage(id)
            })
            buttonPin.addEventListener('mouseenter', () => {
                const iconElement = document.getElementById('pinIcon')
                if (!iconElement) {
                    buttonPinIcon.classList.add('fa-solid', 'fa-thumbtack-slash')
                } else {
                    iconElement.classList.remove('fa-thumbtack')
                    iconElement.classList.add('fa-thumbtack-slash')
                }
            })
            
            buttonPin.addEventListener('mouseleave', () => {
                const iconElement = document.getElementById('pinIcon')
                if (iconElement) {
                    iconElement.classList.remove('fa-thumbtack-slash')
                    iconElement.classList.add('fa-thumbtack')
                }
            })
        }
    } else {
        container.setAttribute('pinned', 'false')
    }

    noteManipulationButton.addEventListener('click', () => {
        const droplists = document.querySelectorAll('div#droplist')
        if (droplists.length == 0) {
            if (noteManipulationContent != {}) {
                let functional = []
                let captions = []
                let icons = []
                if ('functional' in noteManipulationContent) {
                    functional = noteManipulationContent['functional']
                } if ('captions' in noteManipulationContent) {
                    captions = noteManipulationContent['captions']
                } if ('icons' in noteManipulationContent) {
                    icons = noteManipulationContent['icons']
                }
                
                if (functional != [] && captions!= [] && icons != []) {
                    const droplist = document.createElement('div')
                    navContainer.appendChild(droplist)
                    droplist.setAttribute('id', 'droplist')
                    for (let i = 0; i < captions.length; i++) {
                        const item = document.createElement('a')
                        if (icons[i] != undefined) {
                            const itemIcon = document.createElement('i')
                            const itemIconContainer = document.createElement('span')
                            item.appendChild(itemIconContainer)
                            itemIconContainer.appendChild(itemIcon)
                            if (icons[i] == 'fa-thumbtack' && container.getAttribute('pinned') == 'true') {
                                itemIcon.classList.add('fa-solid', 'fa-thumbtack-slash')
                            } else {
                                itemIcon.classList.add('fa-solid', icons[i])
                            }
                            if (functional[i] != undefined) {
                                if (functional[i] == "pinNote") {
                                    if (container.getAttribute('pinned') == 'false') {
                                        item.addEventListener('click', () => {
                                            if (container.getAttribute('pinned') === "false") {
                                                container.setAttribute('pinned', 'true')
                                                const buttonPin = document.createElement('button')
                                                const buttonPinIcon = document.createElement('i')
                                                const buttonPinIconContainer = document.createElement('span')
                                                pins.appendChild(buttonPin)
                                                buttonPin.appendChild(buttonPinIconContainer)
                                                buttonPinIconContainer.appendChild(buttonPinIcon)
                                                buttonPinIcon.classList.add('fa-solid','fa-thumbtack')
                                                buttonPinIcon.setAttribute('id', 'pinIcon')
                                                buttonPin.setAttribute('id', 'pin')
                                                buttonPin.addEventListener('click', () => {
                                                    buttonPin.remove()
                                                    container.setAttribute('pinned', 'false')
                                                    const droplistMenu = document.querySelectorAll('div#droplist')
                                                    droplistMenu.forEach((e) => {
                                                        e.remove()
                                                    })
                                                    saveNoteLocalStorage(id)
                                                })
                                                buttonPin.addEventListener('mouseenter', () => {
                                                    const iconElement = document.getElementById('pinIcon')
                                                    if (!iconElement) {
                                                        buttonPinIcon.classList.add('fa-solid', 'fa-thumbtack-slash')
                                                    } else {
                                                        iconElement.classList.remove('fa-thumbtack')
                                                        iconElement.classList.add('fa-thumbtack-slash')
                                                    }
                                                })
                                                
                                                buttonPin.addEventListener('mouseleave', () => {
                                                    const iconElement = document.getElementById('pinIcon')
                                                    if (iconElement) {
                                                        iconElement.classList.remove('fa-thumbtack-slash')
                                                        iconElement.classList.add('fa-thumbtack')
                                                    }
                                                })                                            
                                            }
                                            saveNoteLocalStorage(id)
                                            droplist.remove()
                                        })
                                    } else {
                                        item.addEventListener('click', () => {
                                            const buttonPin = document.getElementById('pin')
                                            if (buttonPin) {buttonPin.remove()}
                                            container.setAttribute('pinned', 'false')
                                            saveNoteLocalStorage(id)
                                            droplist.remove()
                                        })
                                    }
                                }  if (functional[i] == "moveWorkspace") {
                                    item.addEventListener('click', () => {
                                        allWorkspacesModalOpen(id)
                                        droplist.remove()
                                        if (screen.width <= 750) {
                                            slideMenu()
                                        }
                                    })
                                } if (functional[i] == "removeNote") {
                                    item.addEventListener('click', (event) => {
                                        removeNoteLocalStorage(id)
                                        droplist.remove()
                                        if (screen.width <= 750) {
                                            slideMenu()
                                        }
                                    })
                                }
                            }
                        }

                        droplist.appendChild(item)
                        item.classList.add('item')
                        if (captions[i] == "Закрепить" && container.getAttribute('pinned') == 'true') {
                            item.innerHTML += ' Открепить'
                        } else {
                            item.innerHTML += ' ' + captions[i]
                        }
                    }
                }
            }
        } else {
            droplists.forEach((element) => {
                element.remove()
            })
        }
    })
}

function saveNoteLocalStorage(id) {
    const noteCaption = document.querySelector('.noteCaption')
    const noteContent = document.querySelector('.noteContent')
    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const lastChange = `${hours}:${minutes}:${seconds}`
    const noteMain = document.querySelector("main.note-content") 
    const noteDataContent = noteMain.getAttribute('pinned')
    const noteWorkspace = JSON.parse(localStorage.getItem(id))
    const noteData = {
        'id': id,
        'caption': noteCaption.value,
        'content': noteContent.value,
        'lastChange': lastChange,
        'pinned': noteDataContent,
        'workspace': noteWorkspace.workspace
    }
    localStorage.setItem(id, JSON.stringify(noteData))
    const slideMenu = document.querySelector('aside')
    if (noteCaption.value.length > 0) {
        if (noteCaption.value.length > 14) {
            document.title = 'Pocket Notes: ' + noteCaption.value.substring(0,14) + '...'
        } else {
            document.title = 'Pocket Notes: ' + noteCaption.value
        } 
    } else {
        document.title = 'Pocket Notes: ' + 'Новая заметка #' + id.substring(5)
    }

    if (slideMenu) {updateNotesTab()}
}

function loadNoteContent(id, caption, content, pinnedStatus, workspace) {
    const noteContainers = document.querySelectorAll('.note-content')
    const workspaceContainers = document.querySelectorAll('workspace')
    if (noteContainers.length === 0 && workspaceContainers.length === 0) {
        loadNote(id, caption, content, pinnedStatus, workspace);
    } else {
        noteContainers.forEach((element) => {
            element.style.animationName = "contentRemove"
            element.addEventListener('animationend', () => {
                element.remove()
            })
        })
    
        workspaceContainers.forEach((element) => {
            element.remove()
        })
        loadNote(id, caption, content, pinnedStatus, workspace)
    }
}

function removeNoteLocalStorage(id) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key == id) {
            localStorage.removeItem(id)
        }
    }

    noteIDCount = 0
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('note-')) {
            noteIDCount+=1
        }
    }

    const menuOpened = document.querySelector('aside')
    if (menuOpened) {
        updateNotesTab()
    }
    openHomePage()
}

function noteSetWorkspace(id, workspace) {
    const noteData = JSON.parse(localStorage.getItem(id))
    const noteNewData = {
        'id': id,
        'caption': noteData.caption,
        'content': noteData.content,
        'lastChange': noteData.lastChange,
        'pinned': noteData.pinned,
        'workspace': workspace
    }
    localStorage.setItem(id, JSON.stringify(noteNewData))
}

function hashClear() {
    noteIDCount = 0
    workspacesID = 0
    localStorage.clear()
    notice(
        'Система',
        'Данные удалены.'
    )
    document.title = 'Pocket Notes'
    getSettings()
    updateNotesTab()
    updateWorkspacesTab()
    openHomePage()
    const containers = document.querySelectorAll('.note-content');
    if (containers.length > 0) {
        containers.forEach((element) => {
            element.style.animationName = "contentRemove"
            element.addEventListener('animationend', () => {
                element.remove()
            })
        })
    }
}