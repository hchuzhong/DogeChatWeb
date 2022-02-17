import JSEncrypt from "jsencrypt";
import { GlobalValue } from "../GlobalValue";
import { API } from "./api";

export let websocket: WebSocket;
export let clientEncryptor: JSEncrypt;

export function initWebSocket(AuthStore: any, FriendStore: any, FriendMessageStore: any) {
    clientEncryptor = new JSEncrypt(); // 新建JSEncrypt对象
    websocket = new WebSocket(`${GlobalValue.wssBaseUrl}?deviceType=6`);
    console.log("websocket init");
    // Connection opened
    websocket.addEventListener("open", function (event) {
        // websocket.send("ping");
        console.log("connect success");
        API.postGetPublicKey((privateKey: string, publicKey: string) => {
            // 自己的公钥和私钥也要存起来
            AuthStore.setClientKey(privateKey, publicKey);

            send({ method: "publicKey", key: publicKey });
            send({ method: "getPublicUnreadMessage", id: 0 });
            clientEncryptor.setPublicKey(publicKey); // 设置公钥
            clientEncryptor.setPrivateKey(privateKey);
        });
    });

    // Listen for messages
    websocket.addEventListener("message", function (event) {
        console.log("Message from server ", event.data);
        const data = JSON.parse(event.data);
        if (data?.method === "publicKey") {
            return AuthStore.setServerPubliKey(data?.data);
        }
        if (data?.method === "getPublicUnreadMessage") {
            return FriendStore.setUnreadMessage(data?.data);
        }
        if (data?.method === "getHistory") {
            const hadRecords = data?.data?.records?.length > 0;
            if (!hadRecords) {
                console.log("当前用户无聊天信息");
            } else {
                console.log("getHistory ===========");
                console.log(data);
                const recrods = data?.data?.records;
                FriendMessageStore.setFriendMessage(data?.data);
                FriendStore.setFriendMessageHistory(recrods[0].messageReceiverId, data?.data);
            }
            return;
        }
        console.log(data);
        console.log("揭秘数据");
        console.log(data?.data[0]?.messageContent);
        if (!data?.data) return;

        const cfg = ["messageContent"];
        const cfgData: string[] = [];
        cfg.forEach((str) => {
            let a = clientEncryptor.decrypt(data?.data[0][str]);
            console.log(`str: ${str} ==================`);
            console.log(data?.data[0][str]);
            console.log(a);
            console.log(decodeURIComponent(a as string));
            cfgData.push(decodeURIComponent(a as string));
        });
        console.log(cfgData);
        // 将收到的数据存起来
    });

    // Listen fo error
    websocket.addEventListener("error", function (event) {
        console.log("check websocket error", event);
    });
}

export function getHistoryMessages(
    friendUserId: string,
    pageNum: number,
    pageSize?: number,
    uuid?: string,
    type?: string,
    beginDate?: string,
    keyWord?: string
) {
    const paras: any = { method: "getHistory", friend: friendUserId, pageNum: pageNum };
    if (pageSize) {
        paras["pageSize"] = pageSize;
    }
    if (uuid) {
        paras["uuid"] = uuid;
    }
    if (type) {
        paras["type"] = type;
    }
    if (beginDate) {
        paras["beginDate"] = beginDate;
    }
    if (keyWord) {
        paras["keyWord"] = keyWord;
    }
    send(paras);
}

function send(data: any) {
    if (!websocket) {
        // 目前先返回登陆页面，后面再看看要不要自动登录
        return console.error("请先登陆");
    }
    websocket.send(JSON.stringify(data));
}

export function clientDecrypt(data: string) {
    let a = clientEncryptor.decrypt(data);
    console.log(`str: ${data} ==================`);
    console.log(a);
    console.log(decodeURIComponent(a as string));
    return decodeURIComponent(a as string);
}
