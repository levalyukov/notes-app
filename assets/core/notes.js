let noteIDCount = 0

function createNote() {
    noteIDCount++
    const main = document.getElementById('note')
    const container = document.createElement('main')
    const caption = document.createElement('input')
    const content = document.createElement('textarea')
    let id = "note-"+noteIDCount

    main.appendChild(container)
    container.classList.add('note-content')
    container.appendChild(caption)
    container.appendChild(content)
    caption.classList.add('noteCaption')
    content.classList.add('noteContent')

    caption.setAttribute('placeholder', 'Заголовок')
    content.setAttribute('placeholder', 'Начните излагать свои мысли здесь')

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
    }
    localStorage.setItem(id, JSON.stringify(noteData))
    document.title = 'Pocket Notes: ' + 'Новая заметка #' + noteIDCount
}

function loadNote(index, header, description) {
    const main = document.getElementById('note')
    const container = document.createElement('main')
    const caption = document.createElement('input')
    const content = document.createElement('textarea')
    let id = index

    main.appendChild(container)
    container.classList.add('note-content')
    container.appendChild(caption)
    container.appendChild(content)
    caption.classList.add('noteCaption')
    content.classList.add('noteContent')

    caption.setAttribute('placeholder', 'Заголовок')
    content.setAttribute('placeholder', 'Начните излагать свои мысли здесь')

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
}

function saveNoteLocalStorage(id) {
    const noteCaption = document.querySelector('.noteCaption')
    const noteContent = document.querySelector('.noteContent')
    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const lastChange = `${hours}:${minutes}:${seconds}`
    const noteData = {
        'id': id,
        'caption': noteCaption.value,
        'content': noteContent.value,
        'lastChange': lastChange,
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

function loadNoteContent(id, caption, content) {
    const containers = document.querySelectorAll('.note-content');
    if (containers.length === 0) {
        loadNote(id, caption, content);
    } else {
        containers.forEach((element) => {
            element.style.animationName = "contentRemove"
            element.addEventListener('animationend', () => {
                element.remove()
            })
        })
        loadNote(id, caption, content)
    }
}

function removeNoteLocalStorage(id) {
    const notes = document.querySelectorAll('.note-tab')
    notes.forEach((elements) => {
        if (elements.getAttribute('data-id') === id) {
            localStorage.removeItem(id)
        }
    })
    noteIDCount = 0
    for (let i = 0; i < localStorage.length; i++) {
        noteIDCount+=1
    }
    updateNotesTab()
}

function hashClear() {
    noteIDCount = 0
    localStorage.clear()
    notice(
        'Успешно!',
        'Кэш был удален.',
        {
            'color-light': '#7bed9f',
            'color-dark': '#2ed573',
            'icon': 'fa-check-double',
        }
    )
    document.title = 'Pocket Notes'
    updateNotesTab()
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