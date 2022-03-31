"use strict";

const deb = console.log.bind(window.console);

let sendButton = document.getElementById("send");
let content = document.getElementById("content");
sendButton.addEventListener('click', newEntry);



function newEntry(el) {
    event.preventDefault;
    deb(el)
    let formData = new FormData();
    formData.append('content', content.value)



    fetch("api.php", {
            method: "POST",
            body: formData,
        })
        .then((res) => {
            deb(res.json());
        });
}