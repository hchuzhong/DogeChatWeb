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
        if (this.values.data.records.length !== 0) {
            this.values.data.records.reverse();
        }
    }

    @action updateFriendMessage(data: GlobalType.FriendMessageHistoryType) {
        if (this.values.data.current !== data.current) {
            const newRecords = data.records.reverse();
            this.values.data.records.concat(newRecords);
        }
    }

    @action pushOneFriendMessage(data: GlobalType.FriendMessageType) {
        console.log("更新单条消息 ------", data);
        this.values.data.records.push(data);
    }

    @action resetFriendMessage() {
        this.values.data = { current: 0, pages: 0, records: [], size: 0, total: 0 };
    }
}

export default new FriendMessageStore();
