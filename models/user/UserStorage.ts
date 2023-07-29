import {UserTokens} from "./UserTokens";
import {StorageAPI} from "../storage/StorageAPI";

export class UserStorage {
    storage: StorageAPI;

    constructor() {
        this.setupDefaultSettings();
        this.storage = new StorageAPI();
    }

    setupDefaultSettings = async () => {
        //TODO: add storage default settings
    }

    getUserTokens = async (): Promise<UserTokens | null> => {
        const access_token = await this.storage.getItem('access_token');
        const refresh_token = await this.storage.getItem('refresh_token');

        if (!access_token || !refresh_token) {
            return null;
        }

        return {
            access_token,
            refresh_token
        }
    }

    setUserTokens = (tokens: UserTokens) =>{
        const {refresh_token,access_token} = tokens;
        this.storage.setItem('access_token', access_token);
        this.storage.setItem('refresh_token', refresh_token);
    }

    clearStorage = () => {
        this.storage.clearStorage();
    }
}

new UserStorage()
