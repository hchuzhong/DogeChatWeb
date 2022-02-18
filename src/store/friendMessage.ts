import { observable, action, makeObservable } from "mobx";
import { GlobalType } from "../GlobalType";

class FriendMessageStore {
    constructor() {
        makeObservable(this);
    }

    @observable values: { data: GlobalType.FriendMessageHistoryType } = {
        data: { current: 0, pages: 0, records: [], size: 0, total: 0 },
    };

    @action setFriendMessage(data: GlobalType.FriendMessageHistoryType) {
        this.values.data = data;
    }

    @action updateFriendMessage(data: GlobalType.FriendMessageHistoryType) {
        if (this.values.data.current !== data.current) {
            this.values.data.records.concat(data.records);
        }
    }

    @action resetFriendMessage() {
        this.values.data = { current: 0, pages: 0, records: [], size: 0, total: 0 };
    }
}

export default new FriendMessageStore();
