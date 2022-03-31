"use strict";

const deb = console.log.bind(window.console);

let sendButton = document.getElementById("send");
let content = document.getElementById("content");
sendButton.addEventListener('click', newEntry);


function newEntry(el) {
    event.preventDefault;
    let formData = new FormData();
    formData.append('content', content.value)
    fetch("api.php", {
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

    // .then((res) => {
    //     // res = res.json();
    //     deb(res.json());
    //     if (res.code === 200) {
    //         deb('OK');
    //     }
    // });
}