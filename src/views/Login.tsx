import axios from "axios";
import React, { useState } from "react";

const initialState = {
    username: "",
    password: "",
    confirmPassword: "",
};

const Login = () => {
    const [form, setForm] = useState(initialState);
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        console.log(form);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit");
        console.log(form);
    };

    const fn = () => {
        console.log("username");
        const data = JSON.stringify({
            username: "靓仔三号",
            password: 123456,
        });
        axios({
            method: "post",
            url: "https://121.5.152.193/auth/login",
            headers: { "Content-Type": "application/json" },
            data,
        }).then((data) => {
            console.log("axios return data");
            console.log(data);
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
                </div>
            </div>
        </div>
    );
};

export default Login;
