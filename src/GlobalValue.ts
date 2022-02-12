export namespace GlobalValue {
    export const httpBaseUrl = "https://121.5.152.193";
    export const wssBaseUrl = "ws://localhost/webSocket";

    // export let publicKey = "";
    // export let privateKey = "";

    export function getRsaKeys(callback: Function) {
        return window.crypto.subtle
            .generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 1024, //can be 1024, 2048, or 4096
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: { name: "SHA-512" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
                },
                true, //whether the key is extractable (i.e. can be used in exportKey)
                ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
            )
            .then(function (key) {
                console.log("window.crypto.subtle.exportKey =====1", key);
                //@ts-ignore
                window.crypto.subtle
                    .exportKey("pkcs8", key.privateKey)
                    .then(function (keydata1) {
                        console.log("window.crypto.subtle.exportKey =====2", keydata1);
                        //@ts-ignore
                        window.crypto.subtle
                            .exportKey("spki", key.publicKey)
                            .then(function (keydata2) {
                                console.log("window.crypto.subtle.exportKey =====3", keydata2);
                                var privateKey = RSA2text(keydata1);
                                var publicKey = RSA2text(keydata2);
                                console.log(privateKey);
                                console.log(publicKey);
                                callback(privateKey, publicKey);
                            })
                            .catch(function (err) {
                                console.error(err);
                            });
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    export function RSA2text(buffer: any) {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        var base64 = window.btoa(binary);
        return base64.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{64}\x01?/g, "$&\n");
    }
}
