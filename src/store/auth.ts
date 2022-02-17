import { observable, action, makeObservable } from 'mobx';
import { API } from '../api/api';
import { GlobalType } from '../GlobalType';

class AuthStore {
    constructor() {
        makeObservable(this);
    }

    @observable values = {
        username: '',
        password: '',
        clientPrivateKey: '',
        clientPubliKey: '',
        serverPubliKey: '',
        selfData: {
            avatarUrl: "",
            createdTime: "",
            data: "",
            email: "",
            online: false,
            track: "",
            userId: "",
            username: "",
        }
    };

    @action setUsername(username: string) {
        this.values.username = username;
    }

    @action setPassword(password: string) {
        this.values.password = password;
    }

    @action setClientKey(privateKey: string, publicKey: string) {
        this.values.clientPrivateKey = privateKey;
        this.values.clientPubliKey = publicKey;
    }

    @action setServerPubliKey(publicKey: string) {
        this.values.serverPubliKey = publicKey;
    }

    @action setSelfData(data: GlobalType.SelfDataType) {
        this.values.selfData = data;
    }

    @action login() {
        return new Promise((resolve, reject) => {
            API.login({ username: this.values.username, password: this.values.password }).then((data) => {
                console.log("axios return data");
                console.log(data);
                this.setSelfData(data?.data?.userInfo);
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }

    @action register() {
        // return new Promise((resolve, reject) => {
        //   Auth.register(this.values.username, this.values.password)
        //     .then(user => {
        //       UserStore.pullUser()
        //       resolve(user)
        //     }).catch(error => {
        //     UserStore.resetUser()
        //     message.error('注册失败')
        //     reject(error)
        //   })
        // })
    }

    @action logout() {
        // Auth.logout()
        // UserStore.resetUser()
        // HistoryStore.reset()
        // ImageStore.reset()
    }
}

export default new AuthStore();