import React, { useEffect, useState } from "react";
import { API } from "../../api/api";
import { clientDecrypt, getHistoryMessages } from "../../api/websocket";
import { GlobalType } from "../../GlobalType";
import { useStores } from "../../store";
import { observer } from "mobx-react";
import FriendChatInput from "./FriendChatInput";

const OtherMessageItem = ({
    message,
}: {
    message: GlobalType.FriendMessageType;
}) => {
    return (
        <div className="w-full flex justify-start">
            <div
                className="bg-gray-100 rounded px-5 py-2 my-2 text-gray-700 relative"
                style={{ maxWidth: "300px" }}
            >
                <span className="block">
                    {clientDecrypt(message.messageContent)}
                </span>
                <span className="block text-xs text-right">{message.messageTime}</span>
            </div>
        </div>
    );
};

const SelfMessageItem = ({
    message,
}: {
    message: GlobalType.FriendMessageType;
}) => {
    return (
        <div className="w-full flex justify-end">
            <div
                className="bg-gray-100 rounded px-5 py-2 my-2 text-gray-700 relative"
                style={{ maxWidth: "300px" }}
            >
                <span className="block">{clientDecrypt(message.messageContent)}</span>
                <span className="block text-xs text-left">{message.messageTime}</span>
            </div>
        </div>
    );
};

const FriendChat = observer(({ chooseItemId }: { chooseItemId: string }) => {
    const { AuthStore, FriendStore, FriendMessageStore } = useStores();

    const chooseItem = chooseItemId !== "";
    const friendList = FriendStore.values.friendList;
    const selfData = AuthStore.values.selfData;
    let curChooseFriendInfo: GlobalType.FriendInfoType | null = null;
    let imageSrc = "";
    if (chooseItem) {
        curChooseFriendInfo = friendList.find(
            (friendInfo) => friendInfo.userId === chooseItemId
        ) as GlobalType.FriendInfoType;
        FriendMessageStore.values.data.records.length === 0 &&
            getHistoryMessages(curChooseFriendInfo.userId, 1, 20);
        imageSrc = API.getPictureUrl(curChooseFriendInfo.avatarUrl);
    }

    console.log("FriendChat +-+-+-+-+------------");
    console.log(friendList);
    console.log(curChooseFriendInfo);
    console.log("FriendMessageStore -+-=-=-=-=-=-=-==-=-");
    console.log(FriendMessageStore.values.data.records);

    return chooseItem ? (
        <div className="w-full h-screen flex flex-col">
            <div className="flex items-center border-b border-gray-300 pl-3 py-3">
                <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={imageSrc}
                    alt="username"
                />
                <span className="block ml-2 font-bold text-base text-gray-600">
                    {curChooseFriendInfo?.username}
                </span>
            </div>
            <div id="chat" className="w-full overflow-y-auto p-10 relative">
                <ul>
                    <li className="clearfix2">
                        {FriendMessageStore.values.data.records.map((message) =>
                            message.messageSenderId === selfData.userId ? (
                                <SelfMessageItem
                                    key={message.uuid}
                                    message={message}
                                />
                            ) : (
                                <OtherMessageItem
                                    key={message.uuid}
                                    message={message}
                                />
                            )
                        )}
                    </li>
                </ul>
            </div>

            <div>
                <FriendChatInput chooseFriendInfo={curChooseFriendInfo} />
            </div>
        </div>
    ) : null;
});

export default FriendChat;
