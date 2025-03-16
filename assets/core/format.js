function formatText(command, value = null) {
    const editor = document.getElementById('editor');
    if (!editor.contains(window.getSelection().anchorNode)) {
        return;
    }
    document.execCommand(command, false, value);
}

function formatHeading(headingType) {
    const editor = document.getElementById('editor');
    const selection = window.getSelection();
    if (!editor.contains(selection.anchorNode)) {
        return;
    }

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        const parentElement = range.commonAncestorContainer.parentElement;
        if (parentElement.tagName.toLowerCase() === headingType.toLowerCase()) {
            const textNode = document.createTextNode(parentElement.textContent);
            parentElement.replaceWith(textNode);
        } else {
            if (selectedText) {
                const heading = document.createElement(headingType);
                heading.textContent = selectedText;
                range.deleteContents();
                range.insertNode(heading);
            } else {
                const heading = document.createElement(headingType);
                heading.textContent = "Новый заголовок";
                editor.appendChild(heading);
                const newRange = document.createRange();
                newRange.selectNodeContents(heading);
                newRange.collapse(false);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    }
}

function insertCheckbox() {
    const editor = document.getElementById('editor');
    const selection = window.getSelection();
    if (!editor.contains(selection.anchorNode)) {
        return;
    }
    let ul = editor.querySelector('ul#checkbox');
    if (!ul) {
        ul = document.createElement('ul');
        editor.appendChild(ul);
        ul.setAttribute('id', 'checkbox');
    }
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    let li = startContainer;
    while (li && li.nodeName !== 'LI') {
        li = li.parentElement;
    }
    if (!li) {
        li = document.createElement('li');
        li.textContent = startContainer.textContent || '';
        ul.appendChild(li);
        if (startContainer.nodeType === Node.TEXT_NODE) {
            startContainer.remove();
        }
    }
    if (li.querySelector('input[type="checkbox"]')) {
        return;
    }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('editor-checkbox');
    li.insertBefore(checkbox, li.firstChild);
    const space = document.createTextNode(' ');
    li.insertBefore(space, checkbox.nextSibling);
    const newRange = document.createRange();
    newRange.setStartAfter(space);
    newRange.setEndAfter(space);
    selection.removeAllRanges();
    selection.addRange(newRange);
}

function positionToolbar() {
    const toolbar = document.querySelector('toolbar#format');
    const selection = window.getSelection();
    if (!toolbar || !selection.rangeCount || selection.isCollapsed) {
        if (toolbar) toolbar.style.display = 'none';
        return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    toolbar.style.display = 'block';
    toolbar.style.top = `${rect.top + window.scrollY - toolbar.offsetHeight - 10}px`;
    toolbar.style.left = `${rect.left + window.scrollX + rect.width / 2 - toolbar.offsetWidth / 2}px`;
}

document.addEventListener('selectionchange', () => {
    const editor = document.getElementById('editor');
    const selection = window.getSelection();
    const toolbar = document.querySelector('toolbar#format');

    if (!toolbar || !editor.contains(selection.anchorNode)) {
        if (toolbar) toolbar.style.display = 'none';
        return;
    }
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
        positionToolbar();
    } else {
        toolbar.style.display = 'none';
    }
});

document.addEventListener('click', (event) => {
    const editor = document.getElementById('editor');
    const toolbar = document.querySelector('toolbar#format');

    if (!editor || !toolbar) return;
    if (!editor.contains(event.target) && !toolbar.contains(event.target)) {
        toolbar.style.display = 'none';
    }
});