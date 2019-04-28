"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./css/main.css");
var signalR = require("@aspnet/signalr");
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.divMessages = document.querySelector("#divMessages");
        this.tbMessage = document.querySelector("#tbMessage");
        this.btnSend = document.querySelector("#btnSend");
        this.tbRoom = document.querySelector("#tbRoom");
        this.btnJoin = document.querySelector("#btnJoin");
        this.btnLeave = document.querySelector("#btnLeave");
        this.lastId = '0-0';
        this.roomName = '';
        this.send = function () {
            _this.connection.send("newMessage", _this.roomName, '', _this.tbMessage.value)
                .then(function () { return _this.tbMessage.value = ""; });
        };
        this.joinRoom = function () {
            _this.roomName = _this.tbRoom.value;
            _this.divMessages.innerHTML = '';
            _this.connection.send("joinRoom", _this.roomName);
            _this.tbRoom.value = '';
        };
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:8000/hub")
            .build();
        this.connection.start().catch(function (err) { return document.write(err); });
        this.connection.on("messageReceived", function (id, username, message) {
            var m = document.createElement("div");
            m.innerHTML =
                "<div class=\"message-author\">" + id + "</div><div>" + message + "</div>";
            _this.divMessages.appendChild(m);
            _this.divMessages.scrollTop = _this.divMessages.scrollHeight;
            _this.lastId = _this.maxSequenceNumber(_this.lastId, id);
        });
        this.tbMessage.addEventListener("keyup", function (e) {
            if (e.keyCode === 13) {
                _this.send();
            }
        });
        this.btnSend.addEventListener("click", this.send);
        this.btnJoin.addEventListener("click", this.joinRoom);
        this.btnLeave.addEventListener("click", function () { return _this.connection.send("leaveRoom", _this.roomName); });
    }
    Main.prototype.maxSequenceNumber = function (first, second) {
        var firstMilli = parseInt(first.split('-')[0]);
        var secondMilli = parseInt(second.split('-')[0]);
        if (firstMilli == secondMilli) {
            var firstSequence = parseInt(first.split('-')[1]);
            var secondSequence = parseInt(second.split('-')[1]);
            return firstSequence > secondSequence ? first : second;
        }
        return firstMilli > secondMilli ? first : second;
    };
    return Main;
}());
var m = new Main();
//# sourceMappingURL=index.js.map