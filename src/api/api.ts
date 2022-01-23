import axios from "axios";
import { GlobalValue } from "../GlobalValue";

export namespace API {
    axios.defaults.withCredentials = true;
    // const baseUrl = "https://121.5.152.193";
    const baseUrl = "";

    export function login(data: {username: string, password: string}) {
        return axios.post(
            `${baseUrl}/auth/login`,
            data,
            {
                headers: { 
                "Content-Type": "application/json",
            },
            withCredentials: true
        },
        )
    }

    export function getFriendList() {
        // /friendship/getAllFriends
        return axios.get(
            `${baseUrl}/friendship/getAllFriends`,
                {
                    headers: { 
                    "Content-Type": "application/json",
                },
                withCredentials: true
            },
        )
    }

    // /message/getPublicKey
    export async function postGetPublicKey() {
        let rsaKeys = window.crypto.subtle.exportKey;
        await GlobalValue.getRsaKeys().then(data => {
            console.log("promise of getRsaKey data");
            console.log(data);
            // rsaKeys = data;
        });
        console.log("rsaKeys =======")
        console.log(rsaKeys);
        return axios.post(
            `${baseUrl}/auth/login`,
            {key: window.crypto.subtle.exportKey},
            {
                headers: { 
                "Content-Type": "application/json",
            },
            withCredentials: true}
        )
    }
}