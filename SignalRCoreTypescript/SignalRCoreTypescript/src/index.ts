import "./css/main.css";
import * as signalR from "@aspnet/signalr";

class Main {
    readonly divMessages: HTMLDivElement = document.querySelector("#divMessages");
    readonly tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
    readonly btnSend: HTMLButtonElement = document.querySelector("#btnSend");

    readonly tbRoom: HTMLInputElement = document.querySelector("#tbRoom");
    readonly btnJoin: HTMLButtonElement = document.querySelector("#btnJoin");
    readonly btnLeave: HTMLButtonElement = document.querySelector("#btnLeave");

    readonly connection: signalR.HubConnection

    private lastId: string = '0-0'
    private roomName: string = ''

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:8000/hub")
            .build();

        this.connection.start().then(() => this.autoSend()).catch(err => document.write(err));

        this.connection.on("messageReceived", (id: string, username: string, message: string) => {
            let m = document.createElement("div");

            m.innerHTML =
                `<div class="message-author">${id}</div><div>${message}</div>`;

            this.divMessages.appendChild(m);
            this.divMessages.scrollTop = this.divMessages.scrollHeight;
            this.lastId = this.maxSequenceNumber(this.lastId, id);
        });

        this.tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
            if (e.keyCode === 13) {
                this.send();
            }
        });

        this.btnSend.addEventListener("click", this.send);
        this.btnJoin.addEventListener("click", this.joinRoom);
        this.btnLeave.addEventListener("click", () => this.connection.send("leaveRoom", this.roomName));
    }

    send = () => {
        this.connection.send("newMessage", this.roomName, '', this.tbMessage.value)
            .then(() => this.tbMessage.value = "");
    }

    autoSend = async () => {
        await this.connection.send("joinRoom", "room1")
        let num = 0;
        this.roomName = "room1";
        while (true) {
            this.connection.send("newMessage", this.roomName, '', 'test' + num);
            num++;
            await this.delay(1000);
        }
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

    joinRoom = () => {
        this.roomName = this.tbRoom.value;
        this.divMessages.innerHTML = '';
        this.connection.send("joinRoom", this.roomName);
        this.tbRoom.value = '';
    }

    maxSequenceNumber(first: string, second: string): string {
        let firstMilli = parseInt(first.split('-')[0]);
        let secondMilli = parseInt(second.split('-')[0]);
        if (firstMilli == secondMilli) {
            let firstSequence = parseInt(first.split('-')[1]);
            let secondSequence = parseInt(second.split('-')[1]);
            return firstSequence > secondSequence ? first : second;
        }
        return firstMilli > secondMilli ? first : second;
    }
}

let m = new Main();







