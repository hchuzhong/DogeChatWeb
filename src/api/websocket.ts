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
        console.log("websocket message from server ");
        const json = JSON.parse(event.data);
        const method = json?.method;
        const data = json?.data;
        console.log(`${method} -------------`);
        console.log(json);

        if (method) {
            switch (method) {
                case "publicKey":
                    AuthStore.setServerPubliKey(data);
                    break;
                case "getPublicUnreadMessage":
                    FriendStore.setUnreadMessage(data);
                    break;
                case "getHistory":
                    const hadRecords = data?.records?.length > 0;
                    if (!hadRecords) {
                        console.log("当前用户无聊天信息");
                    } else {
                        const recrods = data?.records;
                        if (FriendMessageStore.values.records.length === 0) {
                            FriendMessageStore.setFriendMessage(data);
                        } else {
                            if (FriendMessageStore.values.userId !== recrods[0].messageReceiverId) {
                                FriendMessageStore.resetFriendMessage();
                                FriendMessageStore.setFriendMessage(data);
                            } else {
                                FriendMessageStore.updateFriendMessage(data);
                            }
                            FriendStore.setFriendMessageHistory(
                                recrods[0].messageReceiverId,
                                FriendMessageStore.values
                            );
                        }
                    }
                    break;
                case "PublicNewMessage":
                    // TODO
                    break;
                case "readMessage":
                    console.log("处理已读消息 ========");
                    break;
                case "sendPersonalMessageSuccess":
                    console.log("处理自己发的单条私聊消息");
                    console.log(FriendMessageStore);
                    FriendMessageStore.pushOneFriendMessage(data);
                    break;
                case "sendToAllSuccess":
                    console.log("处理自己发的单条群聊消息");
                    console.log(FriendMessageStore);
                    FriendMessageStore.pushOneFriendMessage(data);
                    break;
                case "PersonalNewMessage":
                    console.log("处理其他人发的单条私聊消息");
                    FriendMessageStore.pushOneFriendMessage(data[0]);
            }
        }
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
    console.log("check getHistoryMessages params ==================");
    console.log(paras);
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
    return decodeURIComponent(a as string);
}
