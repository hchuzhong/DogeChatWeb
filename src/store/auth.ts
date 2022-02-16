import { action, observable } from "mobx";

class AuthStore {
    @observable isLogin = false;
    @observable isLoading = false;
    @observable value = {
        username: "",
        password: "",
    };

    @action setIsLoading(isLogin: boolean) {}
}
