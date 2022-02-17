import { observable, action } from 'mobx';
import { GlobalType } from '../GlobalType';

class FriendMessageStore {
    @observable values = {
        friendMessage: [],
    };

    @action setFriendMessage(friendMessage: GlobalType.FriendMessageType[]) {
        (this.values.friendMessage as GlobalType.FriendMessageType[]) = friendMessage;
    }

    @action resetFriendMessage() {
        this.values.friendMessage = [];
    }
}

export default new FriendMessageStore();