"use strict";

const deb = console.log.bind(window.console);

var lastNoteId = 0;
var saved = 0;

const content = document.querySelector("#content");
const sidebar = document.querySelector(".sidebar");
const deleteNote = document.querySelector("#deleteNote");
const editorDIV = document.querySelector("#editor");
document.addEventListener('DOMContentLoaded', loadSidebar)
deleteNote.addEventListener('click', removeNote)

/**
 * 
 * Fetch the list of notes from the API and display them in the sidebar
 * 
 */
function loadSidebar() {
    fetch("./php/api.php?list", { method: "GET", })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                createSidebarList(data.data)
            }
        })
        .then(() => {
            sidebarHandler();
        })
};

/**
 * 
 * Create a list of notes from the data array
 * 
 */
function createSidebarList(data) {
    var innerHTML = /*HTML*/ `
        <h2>Notes<span> +</span></h2>`;
    data.forEach(el => {
        // deb(el)
        innerHTML += /*HTML*/ `<li data-id="${el.id}">${el.title}</li>`;
    });
    sidebar.innerHTML = innerHTML;
}



/**
 * 
 * It creates an instance of the InlineEditor class 
 * 
 * */
InlineEditor.create(editorDIV)
    .then(editor => {
        window.editor = editor;
        detectFocusOut();
        detectChangeContent();
    })



/**
 * 
 * When the editor loses focus, save the note
 * 
 */
function detectFocusOut() {
    editor.ui.focusTracker.on('change:isFocused', (evt, name, isFocused) => {
        if (!isFocused) {
            saveNote();
        }
    });
}



/**
 * 
 * The function is called when the data in the document changes. 
 * 
 */
function detectChangeContent() {
    editor.model.document.on('change:data', (evt, data) => {
        autoSave();
    });
}


/**
 * 
 * This function will save the note every second if the saved variable is set to 1
 * 
 */
function autoSave() {
    if (!saved) {
        saved = 1;
        setTimeout(() => {
            saveNote();
        }, 1000);
    }
}





/**
 * 
 * It saves the note to the database.
 * 
 */
function saveNote() {
    let formData = new FormData();
    formData.append('id', lastNoteId)
    formData.append('content', editor.getData())
    fetch("./php/api.php?save", { method: "POST", body: formData, })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                createSidebarList(data.data.list);
                sidebarHandler();
                saved = 0;

                lastNoteId = data.data.id;
                Message.success(data.data.title + ' saved')
            }
        });
}

/**
 * 
 * Create the note in the editor
 * 
 */
function createNote() {
    lastNoteId = 0;
    editor.setData('add new note');
}

/**
 * 
 * The function loads the sidebar and sets up the event listener for each link
 * 
 */

function sidebarHandler() {
    // new note
    document.querySelector('h2 > span').addEventListener('click', (el) => {
        // Message.success('Add new note')
        createNote();
    })

    // links
    document.querySelectorAll('li').forEach(link => {
        link.addEventListener('click', (el) => {
            // deb(el.target.dataset.id)

            let formData = new FormData();
            formData.append('id', el.target.dataset.id)
            fetch("./php/api.php?id", { method: "POST", body: formData, })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        data = data.data;
                        lastNoteId = data.id;
                        editor.setData('<h2>' + data.title + '</h2>' + data.content)
                            // Message.success(data.title)
                            // autoSave(false);

                    }
                });
        })
    });
}



/**
 * 
 * This function removes a note from the database
 * 
 */
function removeNote() {
    let formData = new FormData();
    formData.append('id', lastNoteId)
    fetch("./php/api.php?remove", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            Message.success('Note deleted')
            loadSidebar();
            createNote();
        })
}