"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        this.autoSend = function () { return __awaiter(_this, void 0, void 0, function () {
            var num;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.send("joinRoom", "room1")];
                    case 1:
                        _a.sent();
                        num = 0;
                        this.roomName = "room1";
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 4];
                        this.connection.send("newMessage", this.roomName, '', 'test' + num);
                        num++;
                        return [4 /*yield*/, this.delay(1000)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.joinRoom = function () {
            _this.roomName = _this.tbRoom.value;
            _this.divMessages.innerHTML = '';
            _this.connection.send("joinRoom", _this.roomName);
            _this.tbRoom.value = '';
        };
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:8000/hub")
            .build();
        this.connection.start().then(function () { return _this.autoSend(); }).catch(function (err) { return document.write(err); });
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
    Main.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
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