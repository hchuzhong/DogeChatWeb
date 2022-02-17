import { observable, action, makeObservable } from "mobx";
import { GlobalType } from "../GlobalType";

type FriendStoreType = {
    friendList: GlobalType.FriendInfoType[];
    unreadMessage: GlobalType.FriendMessageType[];
};

class FriendStore {
    constructor() {
        makeObservable(this);
    }

    @observable values: FriendStoreType = {
        friendList: [],
        unreadMessage: [],
    };

    @action setFriendList(friendList: GlobalType.FriendInfoType[]) {
        // 考虑在这里遍历一下然后把 content 给解密
        this.values.friendList = friendList;
    }

    @action setUnreadMessage(unreadMessage: GlobalType.FriendMessageType[]) {
        this.values.unreadMessage = unreadMessage;
    }

    // 切换好友和最开始获取好友消息的时候使用这个逻辑，后面如果再点击这个好友的时候就检查有无数据同时数据的长度大于 1
    // 有的话就不需要重复请求了
    @action setFriendMessageHistory(friendId: string, messageHistory: any) {
        for (const friendInfo of this.values.friendList) {
            if (friendInfo.userId === friendId) {
                friendInfo.messageHistory = messageHistory;
                break;
            }
        }
    }

    @action resetFriendList() {
        this.values.friendList = [];
    }

    @action resetUnreadMessage() {
        this.values.unreadMessage = [];
    }

    @action reset() {
        this.values.friendList = [];
        this.values.unreadMessage = [];
    }
}

export default new FriendStore();
