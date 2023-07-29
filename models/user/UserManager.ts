import {getSetUser, setupDatabase} from "../../db/sequelize";
import {oauth2Client} from "../googleDrive/googleAuth";
import UserData from "./UserData";
import open from 'open';
// import {NodeTracker} from "../watcher/NodeTracker";
import {createDriveFolder} from "../googleDrive/googleDriveAPI";
import {UserStorage} from './UserStorage';
import {ipcMain} from "electron";
import {UserTokens} from "./UserTokens";

export class UserManager {
    private static instance: UserManager;
    userStorage: UserStorage;
    private trackingPaths: string[] = []

    private constructor() {
        this.userStorage = new UserStorage()
        this.userStorage.clearStorage();
    }

    static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    attemptToAuthenticate = async (): Promise<void> => {
        const userTokens = await this.userStorage.getUserTokens();

        if (!userTokens) {
            throw new Error(`User tokens were not found!`);
        }

        const {access_token, refresh_token} = userTokens;

        oauth2Client.setCredentials({access_token, refresh_token})

        if (this.isTokenExpired()) {
            console.log(`Token is expired.`)
            await oauth2Client.refreshAccessToken();
        }
    }

    addTrackingPath = (trackingPath: string) => {
        this.trackingPaths.push(trackingPath);
    }

    initUser = async () => {
        try {
            await setupDatabase()
            await this.attemptToAuthenticate()
        }
        catch (e: any) {
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

    saveUserTokens = (userTokens: UserTokens) =>{
        this.userStorage.setUserTokens(userTokens);
    }

    setUserCredentials = async (authCode: any) => {
        const {tokens} = await oauth2Client.getToken(authCode);

        await this.userStorage.storeTokens(tokens);
        await oauth2Client.setCredentials(tokens);

        const isUserSet = await this.getIsAuthenticated();

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