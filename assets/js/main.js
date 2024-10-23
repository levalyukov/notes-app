let objectCounter = 0;

function updateObjectCounter() {
    const notes = document.querySelectorAll(".note");
    objectCounter = notes.length > 0 ? Math.max(...Array.from(notes).map(note => parseInt(note.getAttribute('data-id').split('-')[1]))) : 0;
}

function noteCreate() {
    objectCounter++;
    
    const main = document.getElementById("container");
    const note = document.createElement("article");
    const note_caption = document.createElement("input");
    const note_hr = document.createElement("hr");
    const note_textarea = document.createElement("textarea");
    const note_nav = document.createElement("nav");
    const note_remove_button = document.createElement("button");
    const note_trash_icon = document.createElement("i");
    const uniqueId = 'note-' + objectCounter;

    note.classList.add("note");
    note.setAttribute('data-id', uniqueId);

    note_caption.classList.add("caption");
    note_caption.setAttribute("placeholder", "Caption...");
    note.appendChild(note_caption);

    note.appendChild(note_hr);

    note_textarea.classList.add("content");
    note_textarea.setAttribute("placeholder", "Content...");
    note.appendChild(note_textarea);

    note.appendChild(note_nav)
    note_nav.appendChild(note_remove_button);
    note_remove_button.setAttribute("id", "remove");
    note_remove_button.classList.add("remove");
    note_remove_button.appendChild(note_trash_icon);
    note_remove_button.addEventListener('click', function() {
        removeNoteElement(uniqueId);
    });
    note_trash_icon.classList.add("fa-solid", "fa-trash");
    note_caption.addEventListener('input', () => saveNoteData(uniqueId));
    note_textarea.addEventListener('input', () => saveNoteData(uniqueId));
    main.appendChild(note);
    saveObjectsToLocalStorage();
}

function createNoteElement(noteID, captionValue, textareaValue) {
    const main = document.getElementById("container");
    const note = document.createElement("article");
    const noteCaption = document.createElement("input");
    const noteHr = document.createElement("hr");
    const noteTextArea = document.createElement("textarea");
    const noteNav = document.createElement("nav");
    const noteRemoveButton = document.createElement("button");
    const noteTrashIcon = document.createElement("i");

    note.classList.add('note');
    note.setAttribute('data-id', noteID);

    noteCaption.classList.add('caption');
    noteCaption.setAttribute("placeholder", "Caption...");
    noteCaption.value = captionValue;

    noteTextArea.classList.add('content');
    noteTextArea.setAttribute("placeholder", "Content...");
    noteTextArea.value = textareaValue;

    noteRemoveButton.setAttribute("id", "remove");
    noteRemoveButton.classList.add("remove");
    noteRemoveButton.appendChild(noteTrashIcon);
    noteRemoveButton.addEventListener('click', function() {
        removeNoteElement(noteID);
    });

    noteTrashIcon.classList.add("fa-solid", "fa-trash");

    noteCaption.addEventListener('input', () => saveNoteData(noteID));
    noteTextArea.addEventListener('input', () => saveNoteData(noteID));

    note.appendChild(noteCaption);
    note.appendChild(noteHr);
    note.appendChild(noteTextArea);
    note.appendChild(noteNav);
    noteNav.appendChild(noteRemoveButton);
    main.appendChild(note);
}

function removeNoteElement(id) {
    const note = document.querySelector(`.note[data-id='${id}']`);
    if (note) {
        note.remove();
    }
    localStorage.removeItem(id);
    updateObjectCounter();
}

function saveObjectsToLocalStorage() {
    const notes = document.querySelectorAll(".note");
    notes.forEach(note => {
        const captionInput = note.querySelector('.caption');
        const captionTextArea = note.querySelector('textarea');
        const noteData = {
            id: note.getAttribute('data-id'),
            caption: captionInput ? captionInput.value : '',
            content: captionTextArea ? captionTextArea.value : '',
        };
        localStorage.setItem(noteData.id, JSON.stringify(noteData));
    });
}

function loadObjectsFromLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('note-')) {
            const noteData = JSON.parse(localStorage.getItem(key));
            if (noteData && noteData.id) {
                createNoteElement(noteData.id, noteData.caption, noteData.content);
            }
        }
    }
    updateObjectCounter();
}

function saveNoteData(id) {
    const note = document.querySelector(`.note[data-id='${id}']`);
    if (note) {
        const captionInput = note.querySelector('.caption');
        const captionTextArea = note.querySelector('textarea');

        const noteData = {
            id: note.getAttribute('data-id'),
            caption: captionInput.value,
            content: captionTextArea.value,
        };

        localStorage.setItem(noteData.id, JSON.stringify(noteData)); // Сохраняем по ID
    }
}

window.onload = function() {
    loadObjectsFromLocalStorage();
    document.getElementById("create").addEventListener('click', noteCreate);
}
