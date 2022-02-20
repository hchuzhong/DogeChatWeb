export namespace GlobalType {
    export enum messageType {
        text = "text",
        join = "join",
        image = "image",
        video = "video",
        livePhoto = "livePhoto",
        draw = "draw",
        track = "track",
        voice = "voice",
        location = "location",
    }

    export const messageTypeToChinese = {
        [messageType.text]: "文本",
        [messageType.join]: "撤回",
        [messageType.image]: "图片",
        [messageType.video]: "视频",
        [messageType.livePhoto]: "图片",
        [messageType.draw]: "Draw",
        [messageType.track]: "Tracks",
        [messageType.voice]: "语音",
        [messageType.location]: "位置",
    };

    export type FriendMessageHistoryType = {
        current: number;
        pages: number;
        records: FriendMessageType[];
        size: number;
        total: number;
        userId: string;
    };

    export type FriendEmojisInfoType = {
        id: number;
        path: string;
        rotate: number;
        scale: number;
        locationX: number;
        locationY: number;
        lastModifiedBy: string;
        lastModifiedUserId: string;
    };

    export type FriendMessageType = {
        messageId: number;
        messageContent: string;
        // 0/1 表示是否已读
        messageStatus: number;
        messageSender: string;
        messageReceiver: string;
        messageSenderId: string;
        messageReceiverId: string;
        isGroup: string;
        messageTime: string;
        timeStamp: number;
        type: messageType;
        // 唯一 id, 考虑自己生成
        uuid: string;
        referMessageUuid: string;
        avatarUrl: string;
        emojis: FriendEmojisInfoType[];
        fontSize: number;
        referMessage?: string;
        notifiedParty: string;
        drawImage?: string;
    };

    export type FriendInfoType = {
        userId: string;
        username: string;
        avatarUrl: string;
        online: boolean;
        // 1 为 true, 0 为 false
        isGroup: string;
        nickName: string;
        isMuted: string;
        message: FriendMessageType;
        messageHistory: FriendMessageType[];

        password?: string;
        email?: string;
        createdTime?: null;
        roles?: null;
        authorities?: null;
    };

    export type SelfDataType = {
        avatarUrl: string;
        createdTime: string;
        data: string;
        email: string;
        online: boolean;
        track: string;
        userId: string;
        username: string;
    };
}
