import { createContext, useContext } from "react";
import AuthStore from "./auth";
import FriendStore from "./friendStore";
import FriendMessageStore from "./friendMessageStore";

const context = createContext({
    AuthStore,
    FriendStore,
    FriendMessageStore,
});

export const useStores = () => useContext(context);
