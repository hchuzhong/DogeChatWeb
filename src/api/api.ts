import axios from "axios";
import { GlobalValue } from "../GlobalValue";

export namespace API {
    axios.defaults.withCredentials = true;
    // const trueBaseUrl = "https://121.5.152.193";
    const baseUrl = "/api";

    export function login(data: { username: string; password: string }) {
        return axios.post(`${baseUrl}/auth/login`, data, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    }

    export function getFriendList() {
        // /friendship/getAllFriends
        return axios.get(`${baseUrl}/friendship/getAllFriends`, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    }

    // /message/getPublicKey
    export async function postGetPublicKey(callback: Function) {
        return await GlobalValue.getRsaKeys((privateKey: string, publicKey: string) => {
            console.log("GlobalValue.getRsaKeys callback");
            console.log(privateKey);
            console.log(publicKey);
            callback(privateKey, publicKey);
        });
    }

    export function getPictureUrl(url: string) {
        return `/star/fileDownload/filename${url}`;
    }
}
