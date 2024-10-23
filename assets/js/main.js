let objectCounter = 0;

function updateObjectCounter() {
    const notes = document.querySelectorAll(".note");
    objectCounter = notes.length > 0 ? Math.max(...Array.from(notes).map(note => parseInt(note.getAttribute('data-id').split('-')[1]))) : 0;
}

function createNoteElement() {
    objectCounter++;
    
    const main = document.getElementById("container");
    const note = document.createElement("article");
    const noteCaption = document.createElement("input");
    const noteHr = document.createElement("hr");
    const noteTextArea = document.createElement("textarea");
    const noteNav = document.createElement("nav");
    const noteRemoveButton = document.createElement("button");
    const noteTrashIcon = document.createElement("i");
    const uniqueId = 'note-' + objectCounter;

    note.appendChild(noteCaption);
    note.appendChild(noteHr);
    note.appendChild(noteTextArea);
    note.appendChild(noteNav)
    noteNav.appendChild(noteRemoveButton);
    noteRemoveButton.appendChild(noteTrashIcon);
    main.appendChild(note);

    note.classList.add("note");
    noteCaption.classList.add("caption");
    noteTextArea.classList.add("content");
    noteRemoveButton.classList.add("remove");
    noteTrashIcon.classList.add("fa-solid", "fa-trash");

    note.setAttribute('data-id', uniqueId);
    noteCaption.setAttribute("placeholder", "Title");
    noteTextArea.setAttribute("placeholder", "Content...");
    noteRemoveButton.setAttribute("id", "remove");
    
    noteRemoveButton.addEventListener('click', function() {removeNoteElement(uniqueId);});
    noteCaption.addEventListener('input', () => saveNoteData(uniqueId));
    noteTextArea.addEventListener('input', () => saveNoteData(uniqueId));
    
    saveObjectsToLocalStorage();
}

function loadNoteElement(noteID, captionValue, textareaValue) {
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
    noteCaption.setAttribute("placeholder", "Title");
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
                loadNoteElement(noteData.id, noteData.caption, noteData.content);
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
    document.getElementById("create").addEventListener('click', createNoteElement);
}
