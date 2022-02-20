import { observable, action, makeObservable } from "mobx";
import { GlobalType } from "../GlobalType";

class FriendMessageStore {
    constructor() {
        makeObservable(this);
    }

    @observable values: GlobalType.FriendMessageHistoryType = {
        current: 0,
        pages: 0,
        records: [],
        size: 0,
        total: 0,
        userId: "",
    };

    @action setFriendMessage(data: GlobalType.FriendMessageHistoryType) {
        /**
         * this.values.data = data;
        if (this.values.data.records.length !== 0) {
            this.values.data.records.reverse();
        }
         */
        if (data.records.length !== 0) {
            data.records.reverse();
            this.values.userId = data.records[0].messageReceiverId;
        }
        this.values = data;
    }

    @action updateFriendMessage(data: GlobalType.FriendMessageHistoryType) {
        if (this.values.current !== data.current) {
            const newRecords = data.records.reverse();
            this.values.records.concat(newRecords);
        }
    }

    @action pushOneFriendMessage(data: GlobalType.FriendMessageType) {
        console.log("更新单条消息 ------", data);
        this.values.records.push(data);
    }

    @action resetFriendMessage() {
        this.values = { current: 0, pages: 0, records: [], size: 0, total: 0, userId: "" };
    }
}

export default new FriendMessageStore();
