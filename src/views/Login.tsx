import axios from "axios";
import JSEncrypt from "jsencrypt";
import React, { useState } from "react";
import { API } from "../api/api";
import { initWebSocket, websocket } from "../api/websocket";

const initialState = {
    username: "",
    password: "",
    confirmPassword: "",
};

const Login = () => {
    const [form, setForm] = useState(initialState);
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // console.log(form);
    };

    const sendMessageTestFn = () => {
        // Public/PersonalNewMessage
        console.log("click send message button");
        const selfData = JSON.parse(localStorage.getItem("selfData") || "");
        const messageReceiverId = JSON.parse(localStorage.getItem("FriendList") || "").find(
            (item: any) => item.username === "DogeChat Web版"
        )?.userId;

        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(localStorage.getItem("clientPublicKey") || "");
        encryptor.setPrivateKey(localStorage.getItem("clientPrivareKey") || "");
        const msg = encryptor.encrypt("test from doge chat web");

        const fakeData = {
            method: "PublicNewMessage",
            message: {
                type: "text",
                messageSenderId: selfData.userId,
                // 只有 messageContent 需要加密
                messageContent: msg,
                messageSender: "靓仔三号",
                notifiedParty: [],
                messageReceiver: "DogeChat Web版",
                isGroup: true,
                messageReceiverId,
            },
        };
        console.log("fakeData");
        console.log(fakeData);
        websocket.send(JSON.stringify(fakeData));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit");
        console.log(form);
        if (form.username === "") {
            return alert("请输入用户名");
        }
        if (form.password === "") {
            return alert("请输入密码");
        }
        API.login(form).then((data) => {
            console.log("axios return data");
            console.log(data);
            localStorage.setItem("selfData", JSON.stringify(data?.data?.userInfo));
            // 请求好友列表，然后跳转到好友列表界面
            API.getFriendList().then((data) => {
                // 初始化好友列表，并将 friendList 存到 context 中
                localStorage.setItem("FriendList", JSON.stringify(data?.data?.friends));
                console.log("getFriendList result");
                console.log(data);
                console.log("check websocket state");
                if (!websocket) {
                    initWebSocket();
                }
            });
        });
    };

    return (
        <div>
            <div className='h-screen bg-indigo-100 flex justify-center items-center'>
                <div className='lg:w-2/5 md:w-1/2 w-2/3'>
                    <form
                        className='bg-white p-10 rounded-lg shadow-lg min-w-full'
                        onSubmit={handleSubmit}>
                        <h1 className='text-center text-2xl mb-6 text-gray-600 font-bold font-sans'>
                            登录
                        </h1>
                        <div>
                            <label
                                className='text-gray-800 font-semibold block my-3 text-md'
                                htmlFor='username'>
                                Username
                            </label>
                            <input
                                className='w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none'
                                type='text'
                                name='username'
                                id='username'
                                placeholder='username'
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label
                                className='text-gray-800 font-semibold block my-3 text-md'
                                htmlFor='password'>
                                Password
                            </label>
                            <input
                                className='w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none'
                                type='password'
                                name='password'
                                id='password'
                                placeholder='password'
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type='submit'
                            className='w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans'>
                            登录
                        </button>
                        <span
                            onClick={() => {
                                console.log("忘记密码");
                            }}
                            className='text-sm ml-2 hover:text-blue-500 cursor-pointer'>
                            Forgot Password ?
                        </span>
                        <div className='text-center mt-12'>
                            <span>Don't have an account?</span>
                            <a
                                href='#'
                                className='font-light text-md text-indigo-600 underline font-semibold hover:text-indigo-800'>
                                Create One
                            </a>
                        </div>
                    </form>
                    <button
                        type='submit'
                        onClick={sendMessageTestFn}
                        className='w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans'>
                        发送消息
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
