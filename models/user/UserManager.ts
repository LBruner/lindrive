import {oauth2Client} from "../googleDrive/googleAuth"
import UserData from "./UserData";
import {createDriveFolder} from "../googleDrive/googleDriveAPI";
import {UserTokens} from "./UserTokens";
import {NodesManager} from "../nodes/NodesManager";
import {UserStore} from "../storage/stores";

export class UserManager {
    private static instance: UserManager;
    userStore: UserStore;

    private constructor() {
        this.userStore = new UserStore();
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

        oauth2Client.setCredentials(userTokens);
        console.log(`User Authenticated.`);

        if (this.isTokenExpired()) {
            console.log(`Token is expired.`)
            await oauth2Client.refreshAccessToken();
        }
    }

    setupUser = async (selectedFolders: string[], rootFolderName: string) => {
        try {
            await this.attemptToAuthenticate();
            const rootFolderId = await createDriveFolder(rootFolderName, null)

            selectedFolders.forEach(folder => this.userStore.addTrackingFolder(folder))

            this.userStore.setRootFolder({name: rootFolderName, id: rootFolderId!});
        } catch (e) {
            console.log(e)
        }
    }

    initUser = async () => {
        try {
            await this.attemptToAuthenticate();
            const foldersToTrack = this.userStore.getTrackingFolders();
            new NodesManager(foldersToTrack);
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