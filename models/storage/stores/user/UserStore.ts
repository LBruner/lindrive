import {IUser, RootFolder} from "./types";
import {DataStore} from "../DataStore";
import Store from "electron-store";
import {UserTokens} from "./UserTokens";

export class UserStore implements DataStore {
    store: Store<IUser>;

    constructor() {
        this.store = new Store<IUser>({
            defaults: {
                refresh_token: '',
                access_token: '',
                rootFolder: {
                    id: '',
                    name: 'lindrive'
                },
                userTheme: 'LIGHT',
                trackHiddenNodes: false,
                trackingFolders: []
            }
        });
    }

    clearStore(): void {
        //TODO Clear user store
    }

    setStore(storeData: any): void {
        this.store.set(storeData);
    }

    getUserCredentials = (): UserTokens | null => {
        const access_token = this.store.get('access_token');
        const refresh_token = this.store.get('refresh_token');

        if (!access_token || !refresh_token) {
            return null;
        }

        return {
            access_token,
            refresh_token
        }
    }

    getTrackingFolders = () => {
        return this.store.get('trackingFolders');
    }

    deleteTrackingFolder = (deletingTrackingFolder: string) => {
        const allTrackingFolders = this.store.get('trackingFolders');
        const newTrackingFolders = allTrackingFolders.filter(folder => folder !== deletingTrackingFolder)
        this.store.set('trackingFolders', newTrackingFolders);
    }

    setUserCredentials = (userCredentials: UserTokens): void => {
        const {access_token, refresh_token} = userCredentials;
        this.store.set('access_token', access_token);
        this.store.set('refresh_token', refresh_token);
    }

    addTrackingFolder = (newTrackingFolder: string) => {
        const allTrackingFolders = this.store.get('trackingFolders');

        if (allTrackingFolders.includes(newTrackingFolder))
            return;

        allTrackingFolders.push(newTrackingFolder);
        this.store.set('trackingFolders', allTrackingFolders);
    }

    getRootFolder = (): RootFolder => {
        return this.store.get('rootFolder');
    }

    setRootFolder = (rootFolder: RootFolder) => {
        this.store.set('rootFolder', rootFolder);
    };

    eraseAllData = () =>{
        this.store.clear();
    }

    getTrackingHiddenNode = () =>{
        return this.store.get('trackHiddenNodes');
    }
    setTrackHiddenNode = (newValue: boolean) =>{
        this.store.set('trackHiddenNodes', newValue);
    }
}