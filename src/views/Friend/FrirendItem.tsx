import React from "react";
import { API } from "../../api/api";

const FrirendItem = (data: any) => {
    const isChoose = false;
    console.log(" ========================== ");
    console.log(data);
    console.log(data.username);
    console.log(API.getPictureUrl(data.data.avatarUrl));
    const chooseItem = (
        <div className='flex flex-row py-4 px-2 items-center border-b-2 border-l-4 border-blue-400'>
            <div className='w-1/4'>
                <img
                    src={API.getPictureUrl(data.data.avatarUrl)}
                    className='object-cover h-12 w-12 rounded-full'
                    alt=''
                />
            </div>
            <div className='w-full'>
                <div className='text-lg font-semibold'>{data.username}</div>
                <span className='text-gray-500'>Lusi : Thanks Everyone</span>
            </div>
        </div>
    );

    const normalItem = (
        <div className='flex flex-row py-4 px-2 justify-center items-center border-b-2'>
            <div className='w-1/4'>
                <img
                    src={API.getPictureUrl(data.data.avatarUrl)}
                    className='object-cover h-12 w-12 rounded-full'
                    alt=''
                />
            </div>
            <div className='w-full'>
                <div className='text-lg font-semibold'>{data.data.username}</div>
                <span className='text-gray-500'>Pick me at 9:00 Am</span>
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
