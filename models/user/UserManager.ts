// import {getSetUser, setupDatabase} from "../../db/sequelize";
import {oauth2Client} from "../googleDrive/googleAuth"
import UserData from "./UserData";
import open from 'open';
// import {NodeTracker} from "../watcher/NodeTracker";
import {createDriveFolder} from "../googleDrive/googleDriveAPI";
import {UserStorage} from './UserStorage';
import {ipcMain} from "electron";
import {UserTokens} from "./UserTokens";
import {NodesManager} from "../nodes/NodesManager";
import {NodeStorage} from "../storage/NodeStorage";
import {NodeStore, UserStore} from "../storage/stores";
import {IFolder} from "../storage/stores/NodeStore";
import path from "path";

export class UserManager {
    private static instance: UserManager;
    userStore: UserStore;
    nodeStore: NodeStore;

    private constructor() {
        this.userStore = new UserStore();
        this.nodeStore = new NodeStore();
        // this.userStorage.clearStorage();
    }

    static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    attemptToAuthenticate = async (): Promise<void> => {
        const userTokens = await this.userStore.getUserTokens();

        if (!userTokens) {
            throw new Error(`User tokens were not found!`);
        }

        const {access_token, refresh_token} = userTokens;

        oauth2Client.setCredentials({access_token, refresh_token})

        console.log("Authenticated")
        if (this.isTokenExpired()) {
            console.log(`Token is expired.`)
            await oauth2Client.refreshAccessToken();
        }
    }

    setupUser = async (selectedFolders: string[], rootFolderName: string) => {
        try {
            await this.attemptToAuthenticate();
            const rootFolderId = await createDriveFolder(rootFolderName, null)

            this.userStore.addTrackingFolders(selectedFolders);

            this.userStore.setRootFolder({name: rootFolderName, id: rootFolderId!});
        } catch (e) {
            console.log(e)
        }
    }

    initUser = async () => {
        try {
            await this.attemptToAuthenticate();
            new NodesManager();
        } catch (e: any) {
            throw new Error(e);
        }

        // for (const path of this.trackingPaths) {
        //     // new NodeTracker(path)
        // }
        // }
    }

    isTokenExpired = () => {
        const tokenExpiration = oauth2Client.credentials.expiry_date;
        const currentTime = Date.now();

        if (tokenExpiration) {
            return tokenExpiration < currentTime;
        }

        return false;
    };

    saveUserTokens = (userTokens: UserTokens) => {
        this.userStore.setUserTokens(userTokens);
    }

    setUserCredentials = async (authCode: any) => {
        const {tokens} = await oauth2Client.getToken(authCode);

        // if (!isUserSet) {
        //     const folderId = await createDriveFolder('Lindrive', null);

        // await UserData.create({
        //     access_token: encryptedTokens.access_token,
        //     refresh_token: encryptedTokens.refresh_token,
        //     rootFolderName: 'Lindrive',
        //     rootFolderId: folderId
        // })
        // }
    }

    isAuthenticated = async () => {
        return await UserData.findOne()
    }
}