import axios from "axios";
import React from "react";

const Login = () => {
    const fn = () => {
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
            Index
            <button onClick={fn}>Button</button>
        </div>
    );
};

export default Login;
