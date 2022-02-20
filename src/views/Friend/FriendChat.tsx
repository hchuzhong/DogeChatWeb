import { API } from "../../api/api";
import { clientDecrypt, getHistoryMessages } from "../../api/websocket";
import { GlobalType } from "../../GlobalType";
import { useStores } from "../../store";
import { observer } from "mobx-react";
import FriendChatInput from "./FriendChatInput";
import dayjs from "dayjs";

const PictureArr = [
    GlobalType.messageType.image,
    GlobalType.messageType.livePhoto,
    GlobalType.messageType.draw,
];

const MessageItem = ({
    message,
    isSelf,
}: {
    message: GlobalType.FriendMessageType;
    isSelf: boolean;
}) => {
    console.log("MessageItem -------------");
    console.log(message);
    console.log(message.type);
    const isText = message.type === GlobalType.messageType.text;
    const isPicture = PictureArr.includes(message.type);
    let imageSrc;
    if (isPicture) {
        switch (message.type) {
            case GlobalType.messageType.image:
                imageSrc = clientDecrypt(message.messageContent);
                break;
            case GlobalType.messageType.draw:
                imageSrc = message.drawImage;
                break;
        }
    }
    return (
        <div className={`w-full flex justify-${isSelf ? "end" : "start"}`}>
            <div
                className='bg-gray-100 rounded px-5 py-2 my-2 text-gray-700 relative'
                style={{ maxWidth: "300px" }}>
                {isText && <span className='block'>{clientDecrypt(message.messageContent)}</span>}
                {isPicture && (
                    <img className='object-cover' src={API.getPictureUrl(imageSrc)} alt='' />
                )}
                <span className='block text-xs text-right'>
                    {parseTimeStamp(message.timeStamp)}
                </span>
            </div>
        </div>
    );
};

function parseTimeStamp(timeStamp: number) {
    return dayjs(new Date(timeStamp)).format("YYYY-MM-DD HH:mm:ss");
}

let oldChooseItemId = "";

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
        chooseItemId !== oldChooseItemId && getHistoryMessages(curChooseFriendInfo.userId, 1, 10);
        imageSrc = API.getPictureUrl(curChooseFriendInfo.avatarUrl);
    }
    oldChooseItemId = chooseItemId;

    console.log("FriendChat +-+-+-+-+------------");
    console.log(friendList);
    console.log(curChooseFriendInfo);
    console.log("FriendMessageStore -+-=-=-=-=-=-=-==-=-");
    console.log(FriendMessageStore.values.records);

    return chooseItem ? (
        <div className='w-full h-screen flex flex-col'>
            <div className='flex items-center border-b border-gray-300 pl-3 py-3'>
                <img
                    className='h-10 w-10 rounded-full object-cover'
                    src={imageSrc}
                    alt='username'
                />
                <span className='block ml-2 font-bold text-base text-gray-600'>
                    {curChooseFriendInfo?.username}
                </span>
            </div>
            <div id='chat' className='w-full h-screen overflow-y-auto p-10 relative'>
                <ul>
                    <li className='clearfix2'>
                        {FriendMessageStore.values.records.map((message) => (
                            <MessageItem
                                key={message.uuid}
                                isSelf={message.messageSenderId === selfData.userId}
                                message={message}
                            />
                        ))}
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
