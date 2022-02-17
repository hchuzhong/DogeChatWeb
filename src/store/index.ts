import { createContext, useContext } from 'react';
import AuthStore from './auth';
import FriendStore from './friend';
import FriendMessageStore from './friendMessage';

const context = createContext({
    AuthStore,
    FriendStore,
    FriendMessageStore
});


export const useStores = () => useContext(context);