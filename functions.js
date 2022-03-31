"use strict";

const deb = console.log.bind(window.console);

document.addEventListener("DOMContentLoaded", () => {
    deb(document.getElementById("send"))
    document.getElementById("send").addEventListener('click', (el) => {
            event.preventDefault;
            console.log(el.target.form);

            const response = fetch("api.php", {
                method: "POST",
                body: JSON.stringify(el.target.form),
            });
        })
        .then(() => {
            console.log(response.json());
        });
});