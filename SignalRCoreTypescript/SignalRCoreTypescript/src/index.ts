import "./css/main.css";
import * as signalR from "@aspnet/signalr";

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");

const tbRoom: HTMLInputElement = document.querySelector("#tbRoom");
const btnJoin: HTMLButtonElement = document.querySelector("#btnJoin");
const btnLeave: HTMLButtonElement = document.querySelector("#btnLeave");
const username = new Date().getTime();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:8000/hub")
    .build();

connection.start().catch(err => document.write(err));

connection.on("messageReceived", (username: string, message: string) => {
    let m = document.createElement("div");

    m.innerHTML =
        `<div class="message-author">${username}</div><div>${message}</div>`;

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});

tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
        send();
    }
});

btnSend.addEventListener("click", send);
btnJoin.addEventListener("click", () => connection.send("joinRoom", tbRoom.value));
btnLeave.addEventListener("click", () => connection.send("leaveRoom", tbRoom.value));

function send() {
    connection.send("newMessage", tbRoom.value, username, tbMessage.value)
        .then(() => tbMessage.value = "");
}