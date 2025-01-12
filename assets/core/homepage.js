function openHomePage(maxNotes = 6) {
    document.title = 'Pocket Notes'
    const homepageContainer = document.querySelectorAll('homepage')
    if (homepageContainer.length > 0) {
        closeHomePage()
        openHomePage()
    } else {
        const date = new Date
        const noteContainer = document.querySelectorAll('.note-content')
    
        const main = document.getElementById('note')
        const homepage = document.createElement('homepage')
        const header = document.createElement('h1')
        const subtitle = document.createElement('h2')
    
        if (noteContainer.length > 0) {
            noteContainer.forEach((elemet) => {
                elemet.remove()
            })
        }
        main.appendChild(homepage)
        homepage.appendChild(header)
        homepage.appendChild(subtitle)

        if (header) {
            const currentHour = date.getHours()
            if (currentHour > 16 && currentHour < 24) {
                header.innerHTML = 'Добрый вечер'
            } else if (currentHour > -1 && currentHour <= 5) {
                header.innerHTML = 'Доброй ночи'
            } else if (currentHour > 5 && currentHour <= 11) {
                header.innerHTML = 'Доброе утро'
            } else {
                header.innerHTML = 'Добрый день'
            }
        }
        if (localStorage.length > 0) {
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
            if (notes.length > 0) {
                subtitle.innerHTML = "Последние изменения:"
                const articleContainer = document.createElement('container')
                homepage.appendChild(articleContainer)
                notes.sort((a, b) => {
                    if (a.pinned === "true" && b.pinned !== "true") return -1;
                    if (a.pinned !== "true" && b.pinned === "true") return 1;
                    return b.lastChange.localeCompare(a.lastChange);
                })
                notes.forEach((noteData) => {
                    const articles = document.querySelectorAll('article')
                    if (articles.length < maxNotes) {
                        const article = document.createElement('article')
                        articleContainer.appendChild(article)
                        const caption = document.createElement('h3')
                        const content = document.createElement('p')
                        const footer = document.createElement('footer')
                        const datetime = document.createElement('datetime')
                        const pins = document.createElement('pins')
                        article.appendChild(caption)
                        article.appendChild(content)
                        article.appendChild(footer)
                        footer.appendChild(pins)
                        footer.appendChild(datetime)
                        if (noteData.caption == '') {
                            caption.innerHTML = 'Новая заметка #' + noteData.id.substring(5)
                        } else {
                            if (noteData.caption.length > 22) {
                                caption.innerHTML = noteData.caption.substring(0, 22) + "..."
                            } else {
                                caption.innerHTML = noteData.caption
                            }
                        } if (noteData.content == '') {
                            content.innerHTML = 'Заметка пустая'
                        } else {
                            if (noteData.content.length > 125) {
                                content.innerHTML = noteData.content.substring(0, 100) + "..."
                            } else {
                                content.innerHTML = noteData.content
                            }
                        } if (noteData.lastChange != undefined) {
                            datetime.innerHTML = noteData.lastChange.substring(0,5)
                        } if (noteData.pinned != undefined) {
                            if (noteData.pinned == 'true') {
                                const noteIcon = document.createElement('i')
                                const noteIconContainer = document.createElement('span')
                                pins.appendChild(noteIconContainer)
                                noteIconContainer.appendChild(noteIcon)
                                noteIcon.classList.add('fa-solid','fa-thumbtack')
                            }
                        }
        
                        article.addEventListener('click', () => {
                            loadNoteContent(noteData.id, noteData.caption, noteData.content, noteData.pinned)
                            closeHomePage()
                        })
                    }
                })
            } else {
                subtitle.innerHTML = "Пока заметок нет, но их легко создать в меню."
            }
        }
    }
}

function closeHomePage() {
    const homepageContainer = document.querySelectorAll('homepage')
    if (homepageContainer.length > 0) {
        homepageContainer.forEach((element) => {
            element.remove()
        })
    }
}