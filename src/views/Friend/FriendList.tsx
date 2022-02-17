import React, { useState } from "react";
import FriendChat from "./FriendChat";
import FrirendItem from "./FrirendItem";
import { GlobalType } from "../../GlobalType";
import { useStores } from "../../store";

const FriendList = () => {
    const { FriendStore } = useStores();
    
    const friendList = FriendStore.values.friendList;
    console.log("FriendList -----------------");
    console.log(friendList);
    const [chooseItemId, setChooseItemId] = useState("");

    const clickFn = (chooseItemId: string) => {
        console.log("点击了列表项 ==========");
        console.log(chooseItemId);
        setChooseItemId(chooseItemId);
        console.log("点击了列表项 end ==========");
    };

    return (
        // <div>
        //     {/* <!-- This is an example component --> */}
        //     <div className='container mx-auto shadow-lg rounded-lg'>
        //         {/* <!-- Chatting --> */}
        //         <div className='flex flex-row justify-between bg-white'>
        //             {/* <!-- chat list --> */}
        //             <div className='flex flex-col w-2/5 border-r-2 overflow-y-auto'>
        //                 {/* <!-- search compt --> */}
        //                 <div className='border-b-2 py-4 px-2'>
        //                     <input
        //                         type='text'
        //                         placeholder='search chatting'
        //                         className='py-2 px-2 border-2 border-gray-200 rounded-2xl w-full'
        //                     />
        //                 </div>

        //                 <ol>
        //                     {friendList.map((item) => (
        //                         <div onClick={clickFn.bind(this, item.userId)}>
        //                             <FrirendItem
        //                                 key={item.userId}
        //                                 chooseItemId={chooseItemId}
        //                                 friendItemInfo={item}
        //                             />
        //                         </div>
        //                     ))}
        //                 </ol>
        //             </div>
        //             <FriendChat chooseItemId={chooseItemId} />
        //         </div>
        //     </div>
        // </div>

        <div className='w-screen h-screen'>
            <div
                className='grid grid-cols-3 min-w-full border rounded'
                style={{ minHeight: "80vh", maxHeight: "100vh" }}>
                <div className='col-span-1 bg-white border-r border-gray-300'>
                    {/* 搜索框 */}
                    <div className='my-3 mx-3 '>
                        <div className='relative text-gray-600 focus-within:text-gray-400'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
                                <svg
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    viewBox='0 0 24 24'
                                    className='w-6 h-6 text-gray-500'>
                                    <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                                </svg>
                            </span>
                            <input
                                aria-placeholder='目前还不能搜索'
                                placeholder='目前还不能搜索'
                                className='py-2 pl-10 block w-full rounded bg-gray-100 outline-none focus:text-gray-700'
                                type='search'
                                name='search'
                                required
                                autoComplete='search'
                            />
                        </div>
                    </div>

                    {/* 好友列表 */}
                    <ul className='overflow-auto'>
                        {friendList.map((item) => (
                            <div key={item.userId} onClick={clickFn.bind(this, item.userId)}>
                                <FrirendItem
                                    key={item.userId}
                                    chooseItemId={chooseItemId}
                                    friendItemInfo={item}
                                />
                            </div>
                        ))}
                    </ul>
                </div>
                {/* 聊天界面 */}
                <div className='h-screen col-span-2 bg-white'>
                    <FriendChat chooseItemId={chooseItemId} />
                </div>
            </div>
        </div>
    );
};

export default FriendList;
