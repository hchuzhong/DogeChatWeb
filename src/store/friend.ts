import { observable, action } from 'mobx';
import { GlobalType } from '../GlobalType';

type FriendStoreType = {
    friendList: GlobalType.FriendInfoType[],
    unreadMessage: GlobalType.FriendMessageType[],
};

class FriendStore {
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