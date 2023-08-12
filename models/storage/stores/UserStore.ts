import Store from "electron-store";
import {UserTokens} from "../../user/UserTokens";
import {IFolder} from "./NodeStore";


export interface RootFolder {
    id: string | null,
    name: string
}

export interface IUserStore {
    access_token: string | null,
    refresh_token: string | null,
    rootFolder: RootFolder,
    trackingFolders: string[]
}

export class UserStore {
    store: Store<IUserStore>

    constructor() {
        this.store = new Store<IUserStore>({
            // encryptionKey: process.env.USERNAME,
            defaults: {
                access_token: null,
                refresh_token: null,
                rootFolder: {
                    id: null,
                    name: 'Lindrive',
                },
                trackingFolders: []
            }
        })
    }

    getUserTokens = async (): Promise<UserTokens | null> => {
        const access_token = await this.store.get('access_token') as string;
        const refresh_token = await this.store.get('refresh_token') as string;

        if (!access_token || !refresh_token) {
            return null;
        }

        return {
            access_token,
            refresh_token
        }
    }

    setUserTokens = (tokens: UserTokens) => {
        const {refresh_token, access_token} = tokens;
        this.store.set('access_token', access_token);
        this.store.set('refresh_token', refresh_token);
    }

    clearStorage = () => {
        this.store.clear();
    }

    getItem = async (itemKey: keyof IUserStore): Promise<string | RootFolder | null> => {
        return this.store.get(itemKey);
    }

    setItem = (itemKey: keyof IUserStore, value: string): void => {
        this.store.set(itemKey, value);
    }

    clearUserStorage = () => {
        this.store.clear();
    }

    getTrackingFolders = async (): Promise<IFolder[]> =>{
        return this.store.get('trackingFolders') as unknown as IFolder[];
    }

    addTrackingFolders = async (newTrackingFolders: string[]) => {
        const allTrackingFolders = await this.store.get('trackingFolders');
        allTrackingFolders!.push(...newTrackingFolders)
        this.store.set('trackingFolders', allTrackingFolders)
    }

    setRootFolder = (rootFolder: RootFolder) => {
        this.store.set('rootFolder', rootFolder)
    }

    getRootFolder = async (): Promise<RootFolder> => {
        return await this.store.get('rootFolder') as RootFolder;
    };
}