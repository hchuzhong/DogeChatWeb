import React from "react";
import { API } from "../../api/api";
import { GlobalType } from "../../GlobalType"

const FrirendItem = ({friendItemInfo}: {friendItemInfo: GlobalType.FriendInfoType}) => {
    const isChoose = false;
    console.log(" ========================== ");
    console.log(friendItemInfo);
    console.log(friendItemInfo.username);
    console.log(API.getPictureUrl(friendItemInfo.avatarUrl));
    const imageSrc = API.getPictureUrl(friendItemInfo.avatarUrl).replaceAll("+", "%2B");
    let messageContent = "";
    if (friendItemInfo?.message?.messageContent) {
        messageContent = friendItemInfo.message.type === GlobalType.messageType.text ? friendItemInfo.message.messageContent : GlobalType.messageTypeToChinese[friendItemInfo.message.type];
    }
    console.log(`check src: ${imageSrc}`);

    const chooseItem = (
        <div className='flex flex-row py-4 px-2 items-center border-b-2 border-l-4 border-blue-400'>
            <div className='w-1/4'>
                <img
                    src={imageSrc}
                    className='object-cover h-12 w-12 rounded-full'
                    alt=''
                />
            </div>
            <div className='w-full'>
                <div className='text-lg font-semibold'>{friendItemInfo.username}</div>
                <span className='text-gray-500'>{messageContent}</span>
            </div>
        </div>
    );

    const normalItem = (
        <div className='flex flex-row py-4 px-2 justify-center items-center border-b-2'>
            <div className='w-1/4'>
                <img
                    src={imageSrc}
                    className='object-cover h-12 w-12 rounded-full'
                    alt=''
                />
            </div>
            <div className='w-full'>
                <div className='text-lg font-semibold'>{friendItemInfo.username}</div>
                <span className='text-gray-500'>{messageContent}</span>
            </div>
        </div>
    );

    return (
        <div>
            <li>{isChoose ? chooseItem : normalItem}</li>
        </div>
    );
};

export default FrirendItem;
