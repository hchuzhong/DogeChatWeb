import axios from "axios";
import { GlobalValue } from "../GlobalValue";

export namespace API {
    axios.defaults.withCredentials = true;
    // const trueBaseUrl = "https://121.5.152.193";
    const baseUrl = "/api";

    export function login(data: { username: string; password: string }) {
        return axios.post(`${baseUrl}/auth/login`, data, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    }

    export function getFriendList() {
        // /friendship/getAllFriends
        return axios.get(`${baseUrl}/friendship/getAllFriends`, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    }

    // /message/getPublicKey
    export async function postGetPublicKey(callback: Function) {
        return await GlobalValue.getRsaKeys((privateKey: string, publicKey: string) => {
            console.log("GlobalValue.getRsaKeys callback");
            console.log(privateKey);
            console.log(publicKey);
            callback(privateKey, publicKey);
        });
    }

    export function getPictureUrl(url?: string) {
        if (!url) return "";
        const strArr = url.split("/");
        return `/api/star/fileDownload/${strArr[strArr.length - 1]}`.replaceAll("+", "%2B");
    }
}

/**
 *  public class DogeChatWebSocket {
    
    weak var socket: DCWebSocketProtocol!
    public let messageManager = MessageManager()
    public static var url_pre: String {
        UserDefaults.standard.value(forKey: "host") as? String ?? "https://\(dogeChatIP)/"
    }
    public var myName: String {
        messageManager.myName
    }
    private var newFriendNotiCount = 0
    public var cookie: String {
        messageManager.cookie
    }
    public var tapFromSystemPhoneInfo: (name: String, uuid: String)?
    public var canSend = false {
        didSet {
            if canSend {
                for message in messageManager.notSendContent {
                    sendWrappedMessage(message)
                }
                NotificationCenter.default.post(name: .canSend, object: myName)
            }
        }
    }
    public static var socketUrl = UserDefaults.standard.value(forKey: "socketUrl") as? String ?? "wss://\(dogeChatIP)/webSocket?deviceType="
    private var _pingTimer: Timer?
    public var connectTime: TimeInterval = 0
    public var connected = false {
        didSet {
            if !connected {
                canSend = false
            }
        }
    }
    public var quickReplyUUID = ""
    private var retryCount = 0
    public var latestResponseTime = Date().timeIntervalSince1970
    public var latestConnectTime = Date().timeIntervalSince1970
    @objc public weak var dataDelegate: WebSocketDataDelegate?
    public var needInsertWhenWrap = true
    public let httpRequestsManager = HttpRequestsManager()
    public var shouldInterceptRealTimeDraw = false
    public var nowCallUUID: UUID! {
        didSet {
            print("nowCallUUID set")
        }
    }
    
    public required init(socketProtocol: DCWebSocketProtocol) {
        self.socket = socketProtocol
        httpRequestsManager.messageManager = self.messageManager
        self.messageManager.httpRequestsManager = self.httpRequestsManager
    }
    

    deinit {
        httpRequestsManager.sessionForWatch.finishTasksAndInvalidate()
        print("WebsocketDeinit")
    }

    // MARK: 连接
    public func connect() {
        if let cookies = HTTPCookieStorage.shared.cookies(for: URL(string: Self.url_pre)!) {
            for cookie in cookies {
                HTTPCookieStorage.shared.deleteCookie(cookie)
            }
        }
        if let cookie = httpRequestsManager.accountInfo.cookieInfo, !cookie.isValid {
            DispatchQueue.main.async {
                NotificationCenter.default.post(name: .cookieExpire, object: self.myName)
            }
            return
        }
        socket?.connect()
    }

    public func loginAndConnect(username: String? = nil, password: String? = nil, force: Bool = false, needContact: Bool = true, completion: ((Bool) -> Void)? = nil) {
        if retryCount >= 10 {
            retryCount = 0
            print("over 10 times retry, return")
            completion?(false)
            return
        }
        var username = username
        var password = password
        if username == nil {
            username = myName
            password = messageManager.getPassword()
        }
        guard let username = username, !username.isEmpty else {
            return
        }
        retryCount += 1
        let connectBlock = {
            self.connectWithResult { [weak self] success in
                if !success {
                    print("连接失败,尝试\(self?.retryCount ?? 0)次")
                    self?.loginAndConnect(username: username, password: password, completion: completion)
                } else {
                    completion?(true)
                    self?.retryCount = 0
                }
            }
        }
        httpRequestsManager.login(username: username, password: password, forceLogin: force) { [weak self] success, _ in
            guard let self = self else { return }
            if success {
                if needContact {
                    self.httpRequestsManager.getContacts { userinfos, error in
                        if error == nil {
                            connectBlock()
                        }
                    }
                } else {
                    connectBlock()
                }
            } else {
                print("登录失败,尝试\(self.retryCount)次")
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in
                    self?.loginAndConnect(username: username, password: password, completion: completion)
                }
            }
        }
    }
    
    public func disconnect() {
        print("disconnect")
        connected = false
        guard socket != nil else {
            return
        }
        socket.disconnect()
        invalidatePingTimer()
    }
    
    public func connectWithResult(_ handler: @escaping( (Bool) -> Void )) {
        syncOnMain {
            let latestRequestTime = Date().timeIntervalSince1970
            var success = false
            connect()
            let timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] timer in
                print("connectTimer执行")
                if let self = self {
                    if self.latestConnectTime > latestRequestTime {
                        timer.invalidate()
                        if !success {
                            handler(true)
                            success = true
                        }
                    }
                }
            }
            timer.tolerance = 0.2
            var delay: Double = 5
            #if os(watchOS)
            delay = 10
            #endif
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                timer.invalidate()
                if !success {
                    handler(false)
                }
            }
        }
    }

    // MARK: ping相关
    public func startPingTimer() {
        invalidatePingTimer()
        pingTimer()?.fire()
    }
    
    public func pingTimer() -> Timer? {
        if self._pingTimer == nil {
            _pingTimer = Timer.scheduledTimer(withTimeInterval: 10, repeats: true, block: { [weak self] (_) in
                guard let self = self else { return }
                if self.socket != nil && self.connected  {
                    self.socket.sendText("ping")
                    print("发送ping")
                    let pingTime = Date().timeIntervalSince1970
                    DispatchQueue.global(qos: .utility).asyncAfter(deadline: .now() + 5) {
                        if self.latestResponseTime < pingTime {
                            print("超过5秒还没收到，重连")
                            self.connect()
                        } else {
                            print("还活着")
                        }
                    }
                }
            })
            _pingTimer?.tolerance = 1
        }
        return self._pingTimer
    }

    public func invalidatePingTimer() {
        if _pingTimer == nil { return }
        _pingTimer?.invalidate()
        _pingTimer = nil
    }

    public func pingWithResult(_ handler: @escaping( (Bool) -> Void )) {
        syncOnMain {
            if !connected {
                handler(false)
                return
            }
            let pingTime = Date().timeIntervalSince1970
            var success = false
            socket.sendText("ping")
            let timer = Timer.scheduledTimer(withTimeInterval: 0.2, repeats: true) { [weak self] timer in
                print("pingTimer执行")
                if let self = self {
                    if self.latestResponseTime > pingTime {
                        timer.invalidate()
                        if !success {
                            handler(true)
                            success = true
                        }
                    }
                }
            }
            timer.tolerance = 0.2
            var delay = 2
            #if os(watchOS)
            delay = 6
            #endif
            DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(delay)) {
                timer.invalidate()
                if !success {
                    print("超过2秒没收到pong， fail")
                    handler(false)
                }
            }
        }
    }

    // MARK: socket发送
    public func send(_ message: Any!) {
        if socket != nil, connected {
            if let message = message as? Data {
                socket.sendData(message)
            } else if let message = message as? String {
                socket.sendText(message)
            }
            print("发送\(message ?? "")")
        } else {
            print("socket未连接 \(message ?? "")")
            if (message is Data || message is NSData) {
                return
            }
        }
    }

    private func sendMessage(_ message: Message) {
        guard socket != nil, connected else {
            return
        }
        let paras = messageManager.getParamsForMessage(message: message)
        send(makeJsonString(for: paras))
    }

    // MARK: 加密
    public func prepareEncrypt() {
        if let paras = messageManager.getEncryptParams() {
            send(makeJsonString(for: paras))
        }
    }

    // MARK: Token
    public func sendToken(_ token: String?) {
        guard let token = token, token.count > 0 else {
            return
        }
        let params = ["method": "token", "token": token]
        send(makeJsonString(for: params))
    }
    
    public func sendVoipToken(_ token: String?) {
        guard let token = token, token.count > 0 else {
            return
        }
        let params = ["method": "voipToken", "voipToken": token]
        send(makeJsonString(for: params))
        print("发送voip token" + token)
    }

    // MARK: 通话
    public func endCall(uuid: String, with receiver: String) {
        let params = ["method": "endVoiceChat", "sender": messageManager.myName, "receiver": receiver, "uuid": uuid]
        send(makeJsonString(for: params))
    }
    
    public func sendCallRequst(to receiver: String, uuid: String) {
        let params = ["method": "voiceChat", "sender": messageManager.myName, "receiver": receiver, "uuid": uuid]
        send(makeJsonString(for: params))
        nowCallUUID = UUID(uuidString: uuid)
    }

    public func sortMessages() {
        for friend in messageManager.friends {
            friend.messages.sort(by: { $0.id < $1.id })
        }
    }

    public func responseVoiceChat(to sender: String, uuid: String, response: String) {
        let params = ["method": "receiveVoiceChat", "response": response, "sender": messageManager.myName, "receiver": sender, "uuid": uuid]
        send(makeJsonString(for: params))
        print("发送了response：\(response)")
    }


    //MARK: 快速操作
    public func doNotDisturb(for name: String, hour: Int, completion: @escaping(()->Void)) {
        httpRequestsManager.session.get(Self.url_pre + "user/doNotDisturb?hours=\(hour)", parameters: nil, headers: ["Cookie": "SESSION="+cookie], progress: nil) { task, data in
            let json = JSON(data as Any)
            print(json)
            completion()
        } failure: { task, error in
            print(error.localizedDescription)
            completion()
        }

    }

    //MARK: 表情包
    public func getEmojis(completion: @escaping ([[Emoji]]) -> Void) {
        httpRequestsManager.getEmoji(completion: completion)
    }
    
    public func deleteEmoji(id: String, completion: @escaping ((Bool) -> Void)) {
        httpRequestsManager.session.post(Self.url_pre + "star/delStar?starId=\(id)", parameters: nil, headers: ["Cookie": "SESSION="+cookie], progress: nil) { (task, response) in
            guard let response = response else { return }
            completion(JSON(response)["status"].stringValue == "success")
        } failure: { (task, error) in
        }
    }
    
    public func starAndUploadEmoji(emoji: Emoji, completion: ((Bool) -> Void)? = nil) {
        var emojis = httpRequestsManager.emojis
        if let type = Emoji.AddEmojiType(rawValue: emoji.type) {
            if type == .common {
                if let first = emojis.first, first.contains(emoji) {
                    return
                }
            } else if type == .favorite {
                emojis.removeFirst()
                if emojis.reduce([], +).contains(where: { $0.path == emoji.path }) {
                    return
                }
            }
        }
        let paras = ["content": messageManager.encrypt.encryptMessage(emoji.path), "starType": "file", "type": emoji.type]
        httpRequestsManager.session.post(Self.url_pre+"star/saveStar", parameters: paras, headers: ["Cookie": "SESSION="+messageManager.cookie], progress: nil) { (task, data) in
            completion?(JSON(data as Any)["status"] == "success")
            self.getEmojis { _ in
                
            }
        } failure: { (task, error) in
            
        }
    }
        
    public func sendEmojiInfos(_ messages: [Message]) {
        for message in messages {
            guard let friend = message.friend else { continue }
            var infos = [[String: String]]()
            for emojiInfo in message.emojisInfo {
                let singleEmoji = [
                    "path": emojiInfo.imageLink,
                    "locationX": "\(emojiInfo.x)",
                    "locationY": "\(emojiInfo.y)",
                    "scale": "\(emojiInfo.scale)",
                    "rotate": "\(emojiInfo.rotation)",
                    "lastModifiedBy": "\(emojiInfo.lastModifiedBy)",
                    "lastModifiedUserId": "\(emojiInfo.lastModifiedUserId)"
                ]
                infos.append(singleEmoji)
            }
            let dict = ["method": "emoji",
                        "message": ["receiverId": message.receiverUserID,
                                    "senderId": message.senderUserID,
                                    "uuid": message.uuid,
                                    "emojis": infos,
                                    "isGroup": friend.isGroup]
            ] as [String : Any]
            send(makeJsonString(for: dict))
        }
    }
    
    //MARK: 历史消息
    public func getPublicUnreadMessage() {
        let paras: [String: Any] = ["method": "getPublicUnreadMessage", "id": messageManager.maxId]
        send(makeJsonString(for: paras))
    }
    
    public func historyMessages(for friend: Friend, pageNum: Int, pageSize: Int? = nil, uuid: String? = nil, type: String? = nil, beginDate: String? = nil, keyWord: String? = nil)  {
        var paras: [String: Any] = ["method": "getHistory", "friend": friend.userID, "pageNum": pageNum]
        if let pageSize = pageSize {
            paras["pageSize"] = pageSize
        }
        if let uuid = uuid {
            paras["uuid"] = uuid
        }
        if let type = type {
            paras["type"] = type
        }
        if let beginDate = beginDate {
            paras["beginDate"] = beginDate
        }
        if let keyWord = keyWord {
            paras["keyWord"] = keyWord
        }
        send(makeJsonString(for: paras))
    }
    //MARK: 撤回消息
    public func revokeMessage(_ message: Message) {
        let paras: [String: Any] = ["method": "revokeMessage", "id": message.id, "senderId": message.senderUserID, "receiverId": message.receiverUserID]
        send(makeJsonString(for: paras))
    }

    // MARK: 解析收到的消息
    public func parseReceivedMessage(_ jsonString: String) {
        let json = JSON(parseJSON: jsonString)
        let method = json["method"].stringValue
        switch method {
        case "publicKey":
            let key = json["data"].stringValue
            messageManager.encrypt.key = key
            canSend = true
            getPublicUnreadMessage()
            DispatchQueue.main.async {
                self.connectTime = Date().timeIntervalSince1970
                NotificationCenter.default.post(name: .connected, object: self.myName)
            }
            print("已经交换密钥")
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                print("开始ping")
                self.startPingTimer()
                NotificationCenter.default.post(name: .sendToken, object: self.messageManager.myName)
                NotificationCenter.default.post(name: .preloadEmojiPaths, object: self.messageManager.myName)
            }
        case "sendToAllSuccess":
            let data = json["data"]
            processSendSuccess(data, toAll: true)
        case "sendPersonalMessageSuccess":
            let data = json["data"]
            processSendSuccess(data, toAll: false)
        case "join":
            let user = json["user"].stringValue
            let number = json["total"].intValue
            messageManager.messageDelegate?.updateOnlineNumber(to: number)
            let username = user.components(separatedBy: " ")[0]
            guard username != self.messageManager.myName else {
                return
            }
        case "PublicNewMessage":  // 收到群聊消息
            wrapNewMessageWithJson(json, isGroup: true, publicRealTime: true)
        case "getPublicUnreadMessage": // 群聊未读消息,socket连接上后会获取
            wrapNewMessageWithJson(json, isGroup: true)
        case "PersonalNewMessage": // 收到私人消息
            wrapNewMessageWithJson(json, isGroup: false)
        case "getHistory":  // 获取群聊、个人历史记录
            let pages = json["data"]["pages"].intValue
            let current = json["data"]["current"].intValue
            let messages = json["data"]["records"].arrayValue
            var result = [Message]()
            for message in messages {
                if let newMessage = messageManager.wrapMessage(messageJSON: message, insertPosition: .top, needInsert: needInsertWhenWrap) {
                    result.append(newMessage)
                }
            }
            DispatchQueue.main.async {
                NotificationCenter.default.post(name: .receiveHistoryMessages, object: self.myName, userInfo: ["messages": result, "pages": pages, "current": current])
            }
        case "revokeMessageSuccess":
            if json["status"].intValue == 200 {
                let id = json["id"].intValue
                let senderID = json["messageSenderId"].stringValue
                let receiverID = json["messageReceiverId"].stringValue
                messageManager.processRevoke(id: id, senderID: senderID, receiverID: receiverID, isGroup: true, uuid: nil)
                messageManager.messageDelegate?.revokeSuccess(id: id, senderID: senderID, receiverID: receiverID)
            }
        case "revokeMessage":
            let messageId = json["id"].intValue
            let senderID = json["senderId"].stringValue
            let receiverID = json["receiverId"].stringValue
            let isGroup: Bool
            if let _isGroup = json["isGroup"].bool {
                isGroup = _isGroup
            } else {
                isGroup = messageManager.friends.filter({ $0.isGroup }).contains(where: { $0.userID == receiverID })
            }
            messageManager.processRevoke(id: messageId, senderID: senderID, receiverID: receiverID, isGroup: isGroup, uuid: nil)
        case "NewFriend":
            messageManager.messageDelegate?.newFriend()
        case "NewFriendRequest":
            messageManager.messageDelegate?.newFriendRequest()
        case "voiceChat":
            let sender = json["sender"].string
            let uuid = json["uuid"].string
            NotificationCenter.default.post(name: .receiveVoiceChatRequest, object: myName, userInfo: ["sender": sender as Any, "uuid": uuid as Any])
        case "responseVoiceChat":
            let response = json["response"].stringValue
            let _ = json["uuid"].stringValue
            let _ = json["sender"].stringValue
            if response == "accept" {
                NotificationCenter.default.post(name: .playSound, object: myName, userInfo: ["mute": true])
                NotificationCenter.default.post(name: .voiceChatAccept, object: myName)
            }
        case "endVoiceChat":
            let _ = json["sender"].stringValue
            let uuid = json["uuid"].stringValue
            NotificationCenter.default.post(name: .endVoiceChat, object: myName, userInfo: ["uuid": uuid])
        case "emoji":
            messageManager.processEmojiInfoChanges(json: json)
        case "draw":
            if !shouldInterceptRealTimeDraw {
                DispatchQueue.main.async {
                    NotificationCenter.default.post(name: .receiveRealTimeDrawData, object: self.myName, userInfo: ["json": json])
                }
            }
        case "FriendChangeAvatar":
            let data = json["data"]
            let userID = data["userId"].stringValue
            let newAvatarURL = data["avatarUrl"].stringValue
            if let friend = httpRequestsManager.friends.first(where: { $0.userID == userID} ) {
                friend.avatarURL = newAvatarURL
                for message in friend.messages where message.senderUserID == userID {
                    message.avatarUrl = newAvatarURL
                }
                NotificationCenter.default.post(name: .friendChangeAvatar, object: myName, userInfo: ["friend": friend])
            }
        case "groupInfoUpdate":
            processGroupInfoChange(json: json["data"])
        case "readMessage":
            let friendID = json["userId"].stringValue
            let id = json["readId"].intValue
            messageManager.messageDelegate?.readMessageUpdate(friendID: friendID, messageID: id)
        default:
            return
        }
    }
    
    func wrapNewMessageWithJson(_ json: JSON, isGroup: Bool, publicRealTime: Bool = false) {
        let data = json["data"].arrayValue
        var messages = [Message]()
        var hasNewFriend = false
        for msg in data {
            if let newMessage = messageManager.wrapMessage(messageJSON: msg) {
                if newMessage.messageSender == .ourself {
                    newMessage.isRead = true
                }
                messages.append(newMessage)
                if publicRealTime && newMessage.messageSender == .someoneElse {
                    NotificationCenter.default.post(name: .playSound, object: myName)
                }
                if let friend = newMessage.friend {
                    messageManager.readMessageDict[friend.userID] = newMessage.id
                }
            } else {
                hasNewFriend = true
            }
        }
        DispatchQueue.main.async { [self] in
            messageManager.messageDelegate?.updateLatestMessages(messages)
        }
        messageManager.messageDelegate?.receiveNewMessages(messages, isGroup: isGroup)
        if hasNewFriend {
            newFriendNotiCount += 1
            if newFriendNotiCount < 20 {
                NotificationCenter.default.post(name: .hasUnknownFriend, object: myName, userInfo: nil)
            }
        }
    }
    
    // MARK: 群聊信息改变
    func processGroupInfoChange(json: JSON) {
        let groupID = json["groupId"].stringValue
        let groupSize = json["groupSize"].intValue
        let groupName = json["groupName"].stringValue
        let avatarURL = json["avatarUrl"].stringValue
        if let group = httpRequestsManager.friendDict[groupID] as? Group {
            group.memberSize = groupSize
            group.avatarURL = avatarURL
            group.username = groupName
            NotificationCenter.default.post(name: .groupInfoChange, object: myName, userInfo: ["group": group])
        }
    }
    
    // MARK: 发送成功的入口
    public func processSendSuccess(_ data: JSON, toAll: Bool) {
        let uuid = messageManager.processSendSuccess(data, toAll: toAll)
        if uuid == quickReplyUUID && !quickReplyUUID.isEmpty {
            quickReplyUUID = ""
            NotificationCenter.default.post(name: .quickReplyDone, object: nil)
        }
    }
        
    // MARK: 发送消息的总入口
    public func sendWrappedMessage(_ message: Message) {
        messageManager.saveSendMessage(message)
        sendMessage(message)
    }

    
    // MARK: 工具
    public func stringToCGFloat(_ str: String) -> CGFloat {
        if let number = NumberFormatter().number(from: str) {
            return CGFloat(truncating: number)
        } else {
            return 0
        }
    }
    
}
 */

// 历史记录
/**
 *public func historyMessages(for friend: Friend, pageNum: Int, pageSize: Int? = nil, uuid: String? = nil, type: String? = nil, beginDate: String? = nil, keyWord: String? = nil)  {
        var paras: [String: Any] = ["method": "getHistory", "friend": friend.userID, "pageNum": pageNum]
        if let pageSize = pageSize {
            paras["pageSize"] = pageSize
        }
        if let uuid = uuid {
            paras["uuid"] = uuid
        }
        if let type = type {
            paras["type"] = type
        }
        if let beginDate = beginDate {
            paras["beginDate"] = beginDate
        }
        if let keyWord = keyWord {
            paras["keyWord"] = keyWord
        }
        send(makeJsonString(for: paras))
    }
 */
