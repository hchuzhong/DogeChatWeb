import React, { useEffect } from "react";
import { API } from "../../api/api";
import { clientDecrypt, getHistoryMessages, websocket } from "../../api/websocket";
import { GlobalType } from "../../GlobalType";
import { useStores } from "../../store";
import { observer } from "mobx-react";

const OtherMessageItem = ({ message }: { message: GlobalType.FriendMessageType }) => {
    return (
        <div className='w-full flex justify-start'>
            <div
                className='bg-gray-100 rounded px-5 py-2 my-2 text-gray-700 relative'
                style={{ maxWidth: "300px" }}>
                <span className='block'>{clientDecrypt(message.messageContent)}</span>
                <span className='block text-xs text-right'>10:30pm</span>
            </div>
        </div>
    );
};

const SelfMessageItem = () => {
    return (
        <div className='w-full flex justify-end'>
            <div
                className='bg-gray-100 rounded px-5 py-2 my-2 text-gray-700 relative'
                style={{ maxWidth: "300px" }}>
                <span className='block'>Hello</span>
                <span className='block text-xs text-left'>10:32pm</span>
            </div>
        </div>
    );
};

const FriendChat = observer(({ chooseItemId }: { chooseItemId: string }) => {
    const { FriendStore, FriendMessageStore } = useStores();

    const chooseItem = chooseItemId !== "";
    const friendList = FriendStore.values.friendList;
    let curChooseFriendInfo = null;
    let imageSrc = "";
    if (chooseItem) {
        curChooseFriendInfo = friendList.find(
            (friendInfo) => friendInfo.userId === chooseItemId
        ) as GlobalType.FriendInfoType;
        FriendMessageStore.values.data.records.length === 0 &&
            getHistoryMessages(curChooseFriendInfo.userId, 1);
        imageSrc = API.getPictureUrl(curChooseFriendInfo.avatarUrl);
    }
    console.log("FriendChat +-+-+-+-+------------");
    console.log(friendList);
    console.log(curChooseFriendInfo);
    console.log("FriendMessageStore -+-=-=-=-=-=-=-==-=-");
    console.log(FriendMessageStore.values.data.records);

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
            <div id='chat' className='w-full overflow-y-auto p-10 relative'>
                <ul>
                    <li className='clearfix2'>
                        {FriendMessageStore.values.data.records.map((message) => (
                            <OtherMessageItem key={message.uuid} message={message} />
                        ))}
                        {/* <div className='w-full flex justify-end'>
                            <div
                                className='bg-gray-100 rounded px-5 py-2 my-2 text-gray-700 relative'
                                style={{ maxWidth: "300px" }}>
                                <span className='block'>how are you?</span>
                                <span className='block text-xs text-left'>10:32pm</span>
                            </div>
                        </div>
                        <div className='w-full flex justify-start'>
                            <div
                                className='bg-gray-100 rounded px-5 py-2 my-2 text-gray-700 relative'
                                style={{ maxWidth: "300px" }}>
                                <span className='block'>I am fine</span>
                                <span className='block text-xs text-right'>10:42pm</span>
                            </div>
                        </div> */}
                    </li>
                </ul>
            </div>

            <div className='w-full py-3 px-3 flex items-center justify-between border-t border-gray-300'>
                <button className='outline-none focus:outline-none'>
                    <svg
                        className='text-gray-400 h-6 w-6'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                    </svg>
                </button>
                <button className='outline-none focus:outline-none ml-1'>
                    <svg
                        className='text-gray-400 h-6 w-6'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
                        />
                    </svg>
                </button>

                <input
                    aria-placeholder='Escribe un mensaje aquí'
                    placeholder='Escribe un mensaje aquí'
                    className='py-2 mx-3 pl-5 block w-full rounded-full bg-gray-100 outline-none focus:text-gray-700'
                    type='text'
                    name='message'
                    required
                />

                <button className='outline-none focus:outline-none' type='submit'>
                    <svg
                        className='text-gray-400 h-7 w-7 origin-center transform rotate-90'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'>
                        <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
                    </svg>
                </button>
            </div>
        </div>
    ) : null;
});

export default FriendChat;
