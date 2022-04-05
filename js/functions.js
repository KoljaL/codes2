"use strict";


/**
 * 
 * const & vars
 * 
 */
const deb = console.log.bind(window.console);
const pageTitle = 'Cotes';
const URL = "http://localhost/codes2";
// const URL = '';  
const content = document.querySelector("#content");
const cotesList = document.querySelector("#cotesList");
const editCote = document.querySelector("#editCote");
const newCote = document.querySelector("#newCote");
const deleteCote = document.querySelector("#deleteCote");
const editorDIV = document.querySelector("#editor");
const hamburger = document.querySelector(".hamburger");
const sidebar = document.querySelector(".sidebar");

var lastCoteId, saved = 0;
document.title = pageTitle;





/**
 * 
 * eventListener
 * 
 */
newCote.addEventListener('click', createCote)
editCote.addEventListener('click', makeEditor)
deleteCote.addEventListener('click', removeCote)
hamburger.addEventListener('click', toggleSidebar)
document.addEventListener('DOMContentLoaded', loadSidebar)
window.addEventListener('DOMContentLoaded', readURL);
window.addEventListener('hashchange', readURL);



/**
 * 
 * Toggle the sidebar's class attribute to add or remove the "overlay" class
 * 
 */
function toggleSidebar() {
    hamburger.classList.toggle("checked");
    sidebar.classList.toggle("overlay");
}



/**
 * 
 * It reads the URL hash and it fetches the cote from the database and sets the editor's content to the cote's content
 * 
 */
function readURL() {
    let id = location.hash.slice(1).toLowerCase() || '';
    id = id.split('-').at(-1);
    if (id) {
        let formData = new FormData();
        formData.append('id', id)
        fetch(URL + "/php/api.php?id", { method: "POST", body: formData, })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    data = data.data;
                    lastCoteId = data.id;
                    document.title = pageTitle + ' - ' + data.title;
                    editorDIV.innerHTML = '<h2>' + data.title + '</h2>' + data.content;
                }
            });
    }
}



/**
 * 
 * Fetch the list of cotes from the API and display them in the sidebar
 * 
 */
function loadSidebar() {
    fetch(URL + "/php/api.php?list", { method: "GET", mode: 'cors' })
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
 * Create a list of cotes from the data array
 * 
 */
function createSidebarList(data) {
    var innerHTML = '';
    data.forEach(el => {
        // deb(el)
        innerHTML += /*HTML*/ `<li data-id="${el.id}">${el.title}</li>`;
    });
    cotesList.innerHTML = innerHTML;
}



/**
 * 
 * Create an CKEditor instance and return it
 * 
 */
function makeEditor() {
    hamburger.classList.remove("checked");
    sidebar.classList.remove("overlay");
    InlineEditor.create(editorDIV, {
            toolbar: {
                items: [
                    'heading', 'mode', 'document', 'doctools', '|',
                    'alignment', '|',
                    'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
                    'link', '|',
                    'bulletedList', 'numberedList', 'todoList',
                    'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor', '|',
                    'code', 'codeBlock', '|',
                    'insertTable', '|',
                    'outdent', 'indent', '|',
                    'uploadImage', 'blockQuote', '|',
                    'undo', 'redo'
                ],
                shouldNotGroupWhenFull: true
            }
        })
        .then(editor => {
            window.editor = editor;
            deb(InlineEditor)
            detectFocusOut();
            // detectChangeContent();
        })
}



/**
 * 
 * When the editor loses focus, save the cote
 * 
 */
function detectFocusOut() {
    editor.ui.focusTracker.on('change:isFocused', (evt, name, isFocused) => {
        if (!isFocused) {
            saveCote();
            editor.destroy();
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
        // deb(evt)
        if (data.isUndoable) {
            autoSave();
            // deb(data)
        }
    });
}



/**
 * 
 * This function will save the cote every second if the saved variable is set to 1
 * 
 */
function autoSave() {
    if (!saved) {
        saved = 1;
        setTimeout(() => {
            saveCote();
        }, 1000);
    }
}



/**
 * 
 * It saves the cote to the database.
 * 
 */
function saveCote() {
    let formData = new FormData();
    formData.append('id', lastCoteId)
    formData.append('content', editor.getData())
    fetch(URL + "/php/api.php?save", { method: "POST", body: formData, })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                createSidebarList(data.data.list);
                sidebarHandler();
                saved = 0;

                lastCoteId = data.data.id;
                Message.success(data.data.title + ' saved')
            }
        });
}



/**
 * 
 * Create the cote in the editor
 * 
 */
function createCote() {
    hamburger.classList.remove("checked");
    sidebar.classList.remove("overlay");
    editorDIV.innerHTML = '<h2>New Cote</h2>';
    lastCoteId = 0;
    makeEditor();
    // editor.setData('add new cote');
}



/**
 * 
 * The function loads the sidebar and sets up the event listener for each link
 * 
 */

function sidebarHandler() {
    document.querySelectorAll('li').forEach(link => {
        link.addEventListener('click', (el) => {
            deb(el.target)
            let id = el.target.dataset.id;
            let title = el.target.innerHTML.replaceAll(' ', '');
            window.location.hash = title + '-' + id;
            toggleSidebar()
        })
    });
}



/**
 * 
 * This function removes a cote from the database
 * 
 */
function removeCote() {
    hamburger.classList.remove("checked");
    sidebar.classList.remove("overlay");
    let formData = new FormData();
    formData.append('id', lastCoteId)
    fetch(URL + "/php/api.php?remove", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            window.location.hash = '';
            Message.success('Cote deleted')
            loadSidebar();
            createCote();
        })
}





// InlineEditor.editorConfig = function(config) {
//     config.toolbarGroups = [
//         { name: 'document', groups: ['mode', 'document', 'doctools'] },
//         { name: 'clipboard', groups: ['clipboard', 'undo'] },
//         { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
//         { name: 'forms', groups: ['forms'] },
//         '/',
//         { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
//         { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
//         { name: 'links', groups: ['links'] },
//         { name: 'insert', groups: ['insert'] },
//         '/',
//         { name: 'styles', groups: ['styles'] },
//         { name: 'colors', groups: ['colors'] },
//         { name: 'tools', groups: ['tools'] },
//         { name: 'others', groups: ['others'] },
//         { name: 'about', groups: ['about'] }
//     ];

//     config.removeButtons = 'Save,NewPage,Preview,Print,PasteText,PasteFromWord,Copy,Cut,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,Outdent,Indent,JustifyCenter,JustifyRight,BidiLtr,BidiRtl,Language,Anchor,PageBreak,Iframe,Font,FontSize,Maximize,ShowBlocks,About';
// };