"use strict";

const deb = console.log.bind(window.console);

var lastNoteId = 0;
const content = document.getElementById("content");
const sidebar = document.querySelector(".sidebar");
const editorDIV = document.querySelector("#editor");
// sendButton.addEventListener('click', newEntry);


//
// SIDEBAR
//
document.addEventListener('DOMContentLoaded', loadSidebar)

function loadSidebar() {
    fetch("./php/api.php?list", {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                Message.success('got codes')
                data = data.data;
                // deb(data);
                var innerHTML = /*HTML*/ `
                <h2>Notes</h2>`;
                data.forEach(el => {
                    // deb(el)
                    innerHTML += /*HTML*/ `<li data-id="${el.id}">${el.title}</li>`;
                });
                sidebar.innerHTML = innerHTML;
            }
        })
        .then(() => {
            sidebarHandler();
        })
};

//
// init EDITOR
//
InlineEditor.create(editorDIV)
    .then(editor => {
        window.editor = editor;
        detectFocusOut(editor);
    })

//
// save EDITOR CONTENT
//
function detectFocusOut(editor) {
    editor.ui.focusTracker.on('change:isFocused', (evt, name, isFocused) => {
        if (!isFocused) {
            let formData = new FormData();
            formData.append('id', lastNoteId)
            formData.append('content', editor.getData())
            fetch("./php/api.php?save", {
                    method: "POST",
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        loadSidebar();
                        // data = data.data;
                        deb(data);
                        Message.success('saved')
                    }
                });
            // console.log(editor.getData());
        }
    });
}





// function newEntry(el) {
//     event.preventDefault;
//     let formData = new FormData();
//     formData.append('content', content.value)
//     fetch("./php/api.php", {
//             method: "POST",
//             body: formData,
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.code === 200) {
//                 data = data.data;
//                 deb(data);
//                 Message.success('saved')
//             }
//         });
// }



/**
 * 
 * The function loads the sidebar and sets up the event listener for each link
 * 
 */

function sidebarHandler() {
    document.querySelectorAll('li').forEach(link => {
        link.addEventListener('click', (el) => {
            // deb(el.target.dataset.id)
            let formData = new FormData();
            formData.append('id', el.target.dataset.id)
            fetch("./php/api.php?id", {
                    method: "POST",
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        data = data.data;
                        lastNoteId = data.id;
                        editor.setData('<h2>' + data.title + '</h2>' + data.content)
                        Message.success(data.title)
                    }
                });
        })
    });
}