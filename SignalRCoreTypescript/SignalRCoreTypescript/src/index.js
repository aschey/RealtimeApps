"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./css/main.css");
var signalR = require("@aspnet/signalr");
var divMessages = document.querySelector("#divMessages");
var tbMessage = document.querySelector("#tbMessage");
var btnSend = document.querySelector("#btnSend");
var tbRoom = document.querySelector("#tbRoom");
var btnJoin = document.querySelector("#btnJoin");
var btnLeave = document.querySelector("#btnLeave");
var username = new Date().getTime();
var connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:8000/hub")
    .build();
connection.start().catch(function (err) { return document.write(err); });
connection.on("messageReceived", function (username, message) {
    var m = document.createElement("div");
    m.innerHTML =
        "<div class=\"message-author\">" + username + "</div><div>" + message + "</div>";
    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});
tbMessage.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
        send();
    }
});
btnSend.addEventListener("click", send);
btnJoin.addEventListener("click", function () { return connection.send("joinRoom", tbRoom.value); });
btnLeave.addEventListener("click", function () { return connection.send("leaveRoom", tbRoom.value); });
function send() {
    connection.send("newMessage", tbRoom.value, username, tbMessage.value)
        .then(function () { return tbMessage.value = ""; });
}
//# sourceMappingURL=index.js.map