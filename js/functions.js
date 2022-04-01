"use strict";

const deb = console.log.bind(window.console);

let content = document.getElementById("content");
let notes = document.getElementById("notes");
// sendButton.addEventListener('click', newEntry);

document.addEventListener('DOMContentLoaded', (event) => {
    fetch("./php/api.php?all", {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                Message.success('got codes')
                data = data.data;
                // deb(data);
                var innerHTML = '';
                data.forEach(el => {
                    innerHTML += /*HTML*/ `
                            <div class=note>${el.content}</div>
                    `;
                });
                // notes.innerHTML = innerHTML;

            }
        });
});



function newEntry(el) {
    event.preventDefault;
    let formData = new FormData();
    formData.append('content', content.value)
    fetch("./php/api.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                data = data.data;
                deb(data);
                Message.success('saved')
            }
        });
}