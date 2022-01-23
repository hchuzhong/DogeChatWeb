import React, { useState } from "react";
import { API } from "../api/api";
import { initWebSocket, websocket } from "../api/websocket";

const initialState = {
    username: "",
    password: "",
    confirmPassword: "",
};

const Register = () => {
    const [form, setForm] = useState(initialState);
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // console.log(form);
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
            // 请求好友列表，然后跳转到好友列表界面
            API.getFriendList().then((data) => {
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
                            Formregister
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
                                htmlFor='email'>
                                Email
                            </label>
                            <input
                                className='w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none'
                                type='text'
                                name='email'
                                id='email'
                                placeholder='@email'
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
                        <div>
                            <label
                                className='text-gray-800 font-semibold block my-3 text-md'
                                htmlFor='confirm'>
                                Confirm password
                            </label>
                            <input
                                className='w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none'
                                type='password'
                                name='confirm'
                                id='confirm'
                                placeholder='confirm password'
                            />
                        </div>
                        <button
                            type='submit'
                            className='w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans'>
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
