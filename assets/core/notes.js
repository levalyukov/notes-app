let noteIDCount = 0
let deletedNoteIDs = []

function getNextNoteID() {
    if (deletedNoteIDs.length > 0) {
        return deletedNoteIDs.shift()
    }
    noteIDCount++
    return `note-${noteIDCount}`
}

function createNote(
    noteManipulationContent = {
        'functional': ['pinNote', 'moveWorkspace', 'removeNote'],
        'captions': ['Закрепить', 'Определить в папку', 'Удалить'],
        'icons': ['fa-thumbtack', 'fa-folder-open', 'fa-trash'],
    },
    toolbarContent = {
        'toolbar': ['fa-list','fa-list-ol', 'fa-heading', 'fa-text-slash'],
        'toolbarID': ['insertUnorderedList','insertOrderedList','header2', 'clear'],
        'toolbarFormat': ['fa-bold','fa-italic','fa-underline','fa-strikethrough'],
        'toolbarFormatID': ['bold','italic','underline','strikeThrough'],
    },
) {
    const id = getNextNoteID();
    const main = document.getElementById('note');
    const container = document.createElement('main');
    const caption = document.createElement('input');

    const toolbar = document.createElement('toolbar');
    const toolbarFormat = document.createElement('toolbar');
    toolbarFormat.setAttribute('id','format');

    const editor = document.createElement('div');
    const navContainer = document.createElement('nav');
    const pins = document.createElement('pins');
    const noteManipulationButton = document.createElement('button');
    const noteManipulationIcon = document.createElement('i');
    const noteManipulationIconContainer = document.createElement('span');

    navContainer.classList.add('note-manipulation');
    noteManipulationButton.setAttribute('id', 'noteManipulationButton');
    noteManipulationIcon.classList.add('fa-solid','fa-ellipsis');

    main.appendChild(container);
    container.classList.add('note-content');
    
    // note manipulation menu 
    container.appendChild(navContainer);
    navContainer.appendChild(pins);
    navContainer.appendChild(noteManipulationButton);
    noteManipulationButton.appendChild(noteManipulationIconContainer);
    noteManipulationIconContainer.appendChild(noteManipulationIcon);

    container.appendChild(caption);

    container.appendChild(toolbar);
    container.appendChild(toolbarFormat);

    if (toolbarContent != {}) {
        let toolbarIcons = [];
        let toolbarFormatIcons = [];
        let toolbarID = [];
        let toolbarFormatID = [];
        if ('toolbar' in toolbarContent) {
            toolbarIcons = toolbarContent['toolbar'];
        } if ('toolbarFormat' in toolbarContent) {
            toolbarFormatIcons = toolbarContent['toolbarFormat'];
        } if ('toolbarID' in toolbarContent) {
            toolbarID = toolbarContent['toolbarID'];
        } if ('toolbarFormatID' in toolbarContent) {
            toolbarFormatID = toolbarContent['toolbarFormatID'];
        }
        if (toolbarIcons.length > 0) {
            for (let i = 0; i < toolbarIcons.length; i++) {
                const button = document.createElement('button');
                const buttonIcon = document.createElement('i');
                const buttonIconContainer = document.createElement('span');
                toolbar.appendChild(button);
                button.appendChild(buttonIconContainer);
                buttonIconContainer.appendChild(buttonIcon);
                buttonIcon.classList.add('fa-solid', toolbarIcons[i]);
                if (toolbarID.length > 0) {
                    if (toolbarID[i] == 'insertUnorderedList' || toolbarID[i] == 'insertOrderedList') {
                        button.addEventListener('click', () => {
                            formatText(toolbarID[i]);
                            saveNoteLocalStorage(id);
                        });
                    } if (toolbarID[i] == 'checkBox') {
                        button.addEventListener('click', () => {
                            insertCheckbox();
                            saveNoteLocalStorage(id);
                        });
                    } if (toolbarID[i] == 'header2') {
                        button.addEventListener('click', () => {
                            formatHeading('h2');
                            saveNoteLocalStorage(id);
                        });
                    } if (toolbarID[i] == 'clear') {
                        button.addEventListener('click', () => {
                            formatText('formatBlock', 'div');
                            saveNoteLocalStorage(id);
                        });
                    }
                }
            }
        } 

        if (toolbarFormatIcons.length > 0) {
            for (let i = 0; i < toolbarFormatIcons.length; i++) {
                const button = document.createElement('button');
                const buttonIcon = document.createElement('i');
                const buttonIconContainer = document.createElement('span');
                toolbarFormat.appendChild(button);
                button.appendChild(buttonIconContainer);
                buttonIconContainer.appendChild(buttonIcon);
                buttonIcon.classList.add('fa-solid', toolbarFormatIcons[i]);
                if (toolbarFormatID.length > 0) {
                    button.addEventListener('click', () => {
                        formatText(toolbarFormatID[i]);
                    });
                }
            }
        } 
    }

    container.appendChild(editor)
    caption.classList.add('noteCaption')
    editor.setAttribute('id', 'editor')
    editor.contentEditable = true

    caption.setAttribute('placeholder', 'Заголовок');
    editor.setAttribute('placeholder', 'Начните излагать свои мысли');

    caption.value = "";
    editor.value = "";

    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const lastChange = `${hours}:${minutes}:${seconds}`;
    const noteData = {
        'id': id,
        'caption': caption.value,
        'content': editor.value,
        'lastChange': lastChange,
        'pinned': 'false',
        'workspace': ''
    };
    localStorage.setItem(id, JSON.stringify(noteData));
    document.title = 'Pocket Notes: ' + 'Новая заметка #' + id.substring(5);

    container.setAttribute('pinned', false);
    noteManipulationButton.addEventListener('click', () => {
        const droplists = document.querySelectorAll('div#droplist');
        if (droplists.length == 0) {
            if (noteManipulationContent != {}) {
                let functional = [];
                let captions = [];
                let icons = [];
                if ('functional' in noteManipulationContent) {
                    functional = noteManipulationContent['functional'];
                } if ('captions' in noteManipulationContent) {
                    captions = noteManipulationContent['captions'];
                } if ('icons' in noteManipulationContent) {
                    icons = noteManipulationContent['icons'];
                }
                
                if (functional != [] && captions!= [] && icons != []) {
                    const droplist = document.createElement('div');
                    navContainer.appendChild(droplist);
                    droplist.setAttribute('id', 'droplist');
                    for (let i = 0; i < captions.length; i++) {
                        const item = document.createElement('a');
                        if (icons[i] != undefined) {
                            const itemIcon = document.createElement('i');
                            const itemIconContainer = document.createElement('span');
                            item.appendChild(itemIconContainer);
                            itemIconContainer.appendChild(itemIcon);
                            if (icons[i] == 'fa-thumbtack' && container.getAttribute('pinned') == 'true') {
                                itemIcon.classList.add('fa-solid', 'fa-thumbtack-slash');
                            } else {
                                itemIcon.classList.add('fa-solid', icons[i]);
                            }
                            if (functional[i] != undefined) {
                                if (functional[i] == "pinNote") {
                                    if (container.getAttribute('pinned') == 'false') {
                                        item.addEventListener('click', () => {
                                            if (container.getAttribute('pinned') === "false") {
                                                container.setAttribute('pinned', 'true');
                                                const buttonPin = document.createElement('button');
                                                const buttonPinIcon = document.createElement('i');
                                                const buttonPinIconContainer = document.createElement('span');
                                                pins.appendChild(buttonPin);
                                                buttonPin.appendChild(buttonPinIconContainer);
                                                buttonPinIconContainer.appendChild(buttonPinIcon);
                                                buttonPinIcon.classList.add('fa-solid','fa-thumbtack');
                                                buttonPinIcon.setAttribute('id', 'pinIcon');
                                                buttonPin.setAttribute('id', 'pin');
                                                buttonPin.addEventListener('click', () => {
                                                    buttonPin.remove();
                                                    container.setAttribute('pinned', 'false');
                                                    const droplistMenu = document.querySelectorAll('div#droplist');
                                                    droplistMenu.forEach((e) => {
                                                        e.remove();
                                                    });
                                                    saveNoteLocalStorage(id);
                                                });
                                                buttonPin.addEventListener('mouseenter', () => {
                                                    const iconElement = document.getElementById('pinIcon');
                                                    if (!iconElement) {
                                                        iconElement.classList.add('fa-solid', 'fa-thumbtack-slash');
                                                    } else {
                                                        iconElement.classList.remove('fa-thumbtack');
                                                        iconElement.classList.add('fa-thumbtack-slash');
                                                    }
                                                });
                                                
                                                buttonPin.addEventListener('mouseleave', () => {
                                                    const iconElement = document.getElementById('pinIcon');
                                                    if (iconElement) {
                                                        iconElement.classList.remove('fa-thumbtack-slash');
                                                        iconElement.classList.add('fa-thumbtack');
                                                    }
                                                });                                            
                                            }
                                            saveNoteLocalStorage(id);
                                            droplist.remove();
                                        });
                                    } else {
                                        item.addEventListener('click', () => {
                                            const buttonPin = document.getElementById('pin');
                                            buttonPin.remove();
                                            container.setAttribute('pinned', 'false');
                                            saveNoteLocalStorage(id);
                                            droplist.remove();
                                        });
                                    }
                                }  if (functional[i] == "moveWorkspace") {
                                    item.addEventListener('click', () => {
                                        allWorkspacesModalOpen(id);
                                        droplist.remove();
                                        if (screen.width <= 750) {
                                            slideMenu();
                                        }
                                    });
                                } if (functional[i] == "removeNote") {
                                    item.addEventListener('click', (event) => {
                                        removeNoteLocalStorage(id);
                                        droplist.remove();
                                        if (screen.width <= 750) {
                                            slideMenu();
                                        }
                                    });
                                }
                            }
                        }

                        droplist.appendChild(item);
                        item.classList.add('item');
                        if (captions[i] == "Закрепить" && container.getAttribute('pinned') == 'true') {
                            item.innerHTML += ' Открепить';
                        } else {
                            item.innerHTML += ' ' + captions[i];
                        }
                    }
                }
            }
        } else {
            droplists.forEach((element) => {
                element.remove();
            });
        }
    });

    caption.addEventListener('input', () => saveNoteLocalStorage(id))
    editor.addEventListener('input', () => saveNoteLocalStorage(id))

    const workspaceWindow = document.querySelectorAll('workspace');
    if (workspaceWindow.length > 0) {
        workspaceWindow.forEach((e) => {
            e.remove();
        });
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
        'captions': ['Закрепить', 'Определить в папку', 'Удалить'],
        'icons': ['fa-thumbtack', 'fa-folder-open', 'fa-trash'],
    },
    toolbarContent = {
        'toolbar': ['fa-list','fa-list-ol', 'fa-heading', 'fa-text-slash'],
        'toolbarID': ['insertUnorderedList','insertOrderedList','header2', 'clear'],
        'toolbarFormat': ['fa-bold','fa-italic','fa-underline','fa-strikethrough'],
        'toolbarFormatID': ['bold','italic','underline','strikeThrough'],
    },
    ) {
    const main = document.getElementById('note')
    const container = document.createElement('main')
    const caption = document.createElement('input')
    const editor = document.createElement('div')
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

    const toolbar = document.createElement('toolbar')
    const toolbarFormat = document.createElement('toolbar')
    toolbarFormat.setAttribute('id','format')
    editor.setAttribute('id', 'editor')
    editor.contentEditable = true

    container.appendChild(caption)
    caption.classList.add('noteCaption')
    caption.setAttribute('placeholder', 'Заголовок')
    container.appendChild(toolbar)
    container.appendChild(toolbarFormat)
    if (toolbarContent != {}) {
        let toolbarIcons = []
        let toolbarFormatIcons = []
        let toolbarID = []
        let toolbarFormatID = []
        if ('toolbar' in toolbarContent) {
            toolbarIcons = toolbarContent['toolbar']
        } if ('toolbarFormat' in toolbarContent) {
            toolbarFormatIcons = toolbarContent['toolbarFormat']
        } if ('toolbarID' in toolbarContent) {
            toolbarID = toolbarContent['toolbarID']
        } if ('toolbarFormatID' in toolbarContent) {
            toolbarFormatID = toolbarContent['toolbarFormatID']
        }
        if (toolbarIcons.length > 0) {
            for (let i = 0; i < toolbarIcons.length; i++) {
                const button = document.createElement('button')
                const buttonIcon = document.createElement('i')
                const buttonIconContainer = document.createElement('span')
                toolbar.appendChild(button)
                button.appendChild(buttonIconContainer)
                buttonIconContainer.appendChild(buttonIcon)
                buttonIcon.classList.add('fa-solid', toolbarIcons[i])
                if (toolbarID.length > 0) {
                    if (toolbarID[i] == 'insertUnorderedList' || toolbarID[i] == 'insertOrderedList') {
                        button.addEventListener('click', () => {
                            formatText(toolbarID[i])
                        })
                    } if (toolbarID[i] == 'checkBox') {
                        button.addEventListener('click', () => {
                            insertCheckbox()
                        })
                    } if (toolbarID[i] == 'header2') {
                        button.addEventListener('click', () => {
                            formatHeading('h2')
                            saveNoteLocalStorage(id)
                        })
                    } if (toolbarID[i] == 'clear') {
                        button.addEventListener('click', () => {
                            formatText('formatBlock', 'div')
                        })
                    }
                }
            }
        } 

        if (toolbarFormatIcons.length > 0) {
            for (let i = 0; i < toolbarFormatIcons.length; i++) {
                const button = document.createElement('button')
                const buttonIcon = document.createElement('i')
                const buttonIconContainer = document.createElement('span')
                toolbarFormat.appendChild(button)
                button.appendChild(buttonIconContainer)
                buttonIconContainer.appendChild(buttonIcon)
                buttonIcon.classList.add('fa-solid', toolbarFormatIcons[i])
                if (toolbarFormatID.length > 0) {
                    button.addEventListener('click', () => {
                        formatText(toolbarFormatID[i])
                    })
                }
            }
        } 
    }
    container.appendChild(editor)
    editor.setAttribute('placeholder', 'Начните излагать свои мысли')

    caption.value = header
    editor.innerHTML = description

    caption.addEventListener('input', () => saveNoteLocalStorage(id))
    editor.addEventListener('input', () => saveNoteLocalStorage(id))
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

    editor.addEventListener('paste', (event) => {
        event.preventDefault()
        const text = (event.clipboardData || window.clipboardData).getData('text/plain')
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.insertNode(document.createTextNode(text))
        }
    })
    editor.addEventListener('paste', (event) => {
        event.preventDefault()
        const html = (event.clipboardData || window.clipboardData).getData('text/html')
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html
        const elements = tempDiv.querySelectorAll('*')
        elements.forEach(element => {
            element.removeAttribute('style')
            element.removeAttribute('class')
            element.removeAttribute('font')
            element.removeAttribute('color')
            element.removeAttribute('size')
            const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li', 'p']
            if (!allowedTags.includes(element.tagName.toLowerCase())) {
                element.replaceWith(textNode)
            }
        })

        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.deleteContents()
            range.insertNode(tempDiv)
        }

        saveNoteLocalStorage(id)
    })
}

function saveNoteLocalStorage(id) {
    const noteCaption = document.querySelector('.noteCaption')
    const noteContent = document.querySelector('div#editor')
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
        'content': noteContent.innerHTML,
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
            element.remove()
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
            deletedNoteIDs.push(id)
        }
    }

    noteIDCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('note-')) {
            noteIDCount += 1;
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