import JSEncrypt from "jsencrypt";
import { GlobalValue } from "../GlobalValue";
import { API } from "./api";
// export let websocket = new WebSocket(GlobalValue.wssBaseUrl);
export let websocket: WebSocket;

export function initWebSocket() {
    const encryptor = new JSEncrypt(); // 新建JSEncrypt对象
    websocket = new WebSocket(`${GlobalValue.wssBaseUrl}?deviceType=6`);
    console.log("websocket init");

    // Connection opened
    websocket.addEventListener("open", function (event) {
        websocket.send("ping");
        console.log("connect success");
        API.postGetPublicKey((privateKey: string, publicKey: string) => {
            console.log("websocket websocket");
            // console.log(data);
            websocket.send(JSON.stringify({ method: "publicKey", key: publicKey }));
            websocket.send(JSON.stringify({ method: "getPublicUnreadMessage", id: 0 }));
            encryptor.setPublicKey(publicKey); // 设置公钥
            encryptor.setPrivateKey(privateKey);
        });
    });

    // Listen for messages
    websocket.addEventListener("message", function (event) {
        console.log("Message from server ", event.data);
        const data = JSON.parse(event.data);
        console.log(data);
        console.log("揭秘数据");
        console.log(data?.data[0]?.messageContent);
        const a = encryptor.decrypt(data?.data[0]?.messageContent);
        console.log(a);
        console.log(decodeURIComponent(a as string));
    });

    // Listen fo error
    websocket.addEventListener("error", function (event) {
        console.log("check websocket error", event);
    });
}
