import {oauth2Client} from "../googleDrive/googleAuth"
import {createDriveFolder} from "../googleDrive/googleDriveAPI";
import {UserTokens} from "./UserTokens";
import {NodesManager} from "../nodes/NodesManager";
import {UserStore} from "../storage/stores";

export class UserManager {
    private static instance: UserManager;
    userStore: UserStore;
    nodesManager: NodesManager;

    private constructor() {
        this.userStore = new UserStore();
        this.nodesManager = new NodesManager(this.userStore);
    }

    static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    attemptToAuthenticate = async (): Promise<void> => {
        const userTokens = this.userStore.getUserCredentials();

        if (!userTokens) {
            throw new Error(`User tokens were not found!`);
        }

        try {
            oauth2Client.setCredentials(userTokens);
            console.log(`User Authenticated.`);
        } catch (e) {
            if (this.isTokenExpired()) {
                console.log(`Token is expired.`)
                await oauth2Client.refreshAccessToken();
            }
        }
    }

    setupUser = async (rootFolderName: string) => {
        try {
            await this.attemptToAuthenticate();
            const rootFolderId = await createDriveFolder(rootFolderName, null)
            this.userStore.setRootFolder({name: rootFolderName, id: rootFolderId!});
        } catch (e) {
            console.log(e)
        }
    }

    initUser = async () => {
        try {
            await this.attemptToAuthenticate();
            const foldersToTrack = this.userStore.getTrackingFolders();
            this.nodesManager.setStoredTrackingFolders(foldersToTrack);
        } catch (e: any) {
            throw new Error(e);
        }
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
        this.userStore.setUserCredentials(userTokens);
    }
}