import { GlobalValue } from "../GlobalValue";
import { API } from "./api";
// export let websocket = new WebSocket(GlobalValue.wssBaseUrl);
export let websocket: WebSocket;

export function initWebSocket() {
    websocket = new WebSocket(`${GlobalValue.wssBaseUrl}?deviceType=6`);
    console.log('websocket init');

    // Connection opened
    websocket.addEventListener('open', function (event) {
        websocket.send('ping');
        console.log("connect success")
        API.postGetPublicKey();
    });

    // Listen for messages
    websocket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    // Listen fo error
    websocket.addEventListener('error', function (event) {
        console.log('check websocket error', event);
    })
    
}