import React from "react";
import { API } from "../../api/api";
import { GlobalType } from "../../GlobalType";

const FrirendItem = ({
    friendItemInfo,
    chooseItemId,
}: {
    friendItemInfo: GlobalType.FriendInfoType;
    chooseItemId: string;
}) => {
    const isChoose = friendItemInfo.userId === chooseItemId;
    console.log(" ========================== ");
    console.log(friendItemInfo);
    const imageSrc = API.getPictureUrl(friendItemInfo.avatarUrl);
    let messageContent = "";
    if (friendItemInfo?.message?.messageContent) {
        messageContent =
            friendItemInfo.message.type === GlobalType.messageType.text
                ? friendItemInfo.message.messageContent
                : GlobalType.messageTypeToChinese[friendItemInfo.message.type];
    }

    const normalItem = (
        <div>
            <a className='hover:bg-gray-100 border-b border-gray-300 px-3 py-2 cursor-pointer flex items-center text-sm focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out'>
                <img
                    className='h-10 w-10 rounded-full object-cover'
                    src={imageSrc}
                    alt='username'
                />
                <div className='w-full pb-2'>
                    <span className='block ml-2 font-semibold text-base text-gray-600 '>
                        {friendItemInfo.username}
                    </span>
                    <span className='block ml-2 text-sm text-gray-600'>{messageContent}</span>
                </div>
            </a>
        </div>
    );

    const chooseItem = (
        <div>
            <a className='bg-gray-100 border-b border-gray-300 px-3 py-2 cursor-pointer flex items-center text-sm focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out'>
                <img
                    className='h-10 w-10 rounded-full object-cover'
                    src={imageSrc}
                    alt='username'
                />
                <div className='w-full pb-2'>
                    <span className='block ml-2 font-semibold text-base text-gray-600 '>
                        {friendItemInfo.username}
                    </span>
                    <span className='block ml-2 text-sm text-gray-600'>{messageContent}</span>
                </div>
            </a>
        </div>
    );

    return (
        <div>
            <li>{isChoose ? chooseItem : normalItem}</li>
        </div>
    );
};

export default FrirendItem;
