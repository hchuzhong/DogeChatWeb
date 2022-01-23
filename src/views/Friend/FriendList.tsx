import React from "react";
import FriendChat from "./FriendChat";
import FrirendItem from "./FrirendItem";

const FriendList = () => {
    const fakeData = [1, 2, 3, 4, 5, 6, 7];

    return (
        <div>
            {/* <!-- This is an example component --> */}
            <div className='container mx-auto shadow-lg rounded-lg'>
                {/* <!-- Chatting --> */}
                <div className='flex flex-row justify-between bg-white'>
                    {/* <!-- chat list --> */}
                    <div className='flex flex-col w-2/5 border-r-2 overflow-y-auto'>
                        {/* <!-- search compt --> */}
                        <div className='border-b-2 py-4 px-2'>
                            <input
                                type='text'
                                placeholder='search chatting'
                                className='py-2 px-2 border-2 border-gray-200 rounded-2xl w-full'
                            />
                        </div>

                        <ol>
                            {fakeData.map((value) => (
                                <FrirendItem />
                            ))}
                        </ol>
                    </div>
                    <FriendChat />
                </div>
            </div>
        </div>
    );
};

export default FriendList;
