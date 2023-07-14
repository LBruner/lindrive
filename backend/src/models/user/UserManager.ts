import {getSetUser} from "../../db/sequelize";
import {oauth2Client} from "../googleDrive/googleAuth";
import UserData from "./UserData";
import open from 'open';
import {NodeTracker} from "../watcher/NodeTracker";
import {createDriveFolder} from "../googleDrive/googleDriveAPI";
import {UserStorage} from './UserStorage';

export class UserManager {
    private static instance: UserManager;
    userStorage: UserStorage;
    private trackingPaths: string[] = []

    private constructor() {
        this.userStorage = new UserStorage()
        this.initUser();
    }

    static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    addTrackingPath = (trackingPath: string) => {
        this.trackingPaths.push(trackingPath);
    }

    private initUser = async () => {
        const userData = await getSetUser();

        if (!userData) {
            await open('http://localhost:3000/home');
        } else {
            const {access_token, refresh_token} = userData

            const decryptedTokens = await this.userStorage.decryptStoredTokens({access_token, refresh_token});

            try{
                await oauth2Client.setCredentials({
                    access_token: decryptedTokens.access_token,
                    refresh_token: decryptedTokens.refresh_token
                });


                if(this.isTokenExpired()){
                    console.log(`Token is expired.`)
                    await oauth2Client.refreshAccessToken()
                }
            }
            catch (e) {
                await open('http://localhost:3000/home');
                console.log('error',e);
                return;
            }

            for (const path of this.trackingPaths) {
                // new NodeTracker(path)
            }
        }
    }

    isTokenExpired = () => {
        const tokenExpiration = oauth2Client.credentials.expiry_date;
        const currentTime = Date.now();

        return tokenExpiration < currentTime;
    };

    setUserCredentials = async (authCode: any) => {
        const {tokens} = await oauth2Client.getToken(authCode);

        const encryptedTokens = await this.userStorage.storeTokens(tokens);

        await oauth2Client.setCredentials(tokens);

        const isUserSet = await getSetUser();

        if (!isUserSet) {
            const folderId = await createDriveFolder('Lindrive', null);

            await UserData.create({
                access_token: encryptedTokens.access_token,
                refresh_token: encryptedTokens.refresh_token,
                rootFolderName: 'Lindrive',
                rootFolderId: folderId
            })
        }

        for (const path of this.trackingPaths) {
            console.log(path)
            new NodeTracker(path)
        }
    }

    isAuthenticated = async () => {
        return await UserData.findOne()
    }
}