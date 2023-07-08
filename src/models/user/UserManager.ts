import {getSetUser} from "../../db/sequelize";
import {oauth2Client} from "../googleDrive/googleAuth";
import UserData from "./UserData";
import open from 'open';
import {NodeTracker} from "../watcher/NodeTracker";
import {createDriveFolder} from "../googleDrive/googleDriveAPI";

type userToken = {
    access_token: string,
    refresh_token: string
}

export class UserManager {
    private static instance: UserManager;
    private tokens: userToken | undefined;

    private constructor() {
        this.initUser();
    }

    static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    private initUser = async () => {
        const userData = await getSetUser();

        if (!userData) {
            await open('http://localhost:8080/auth/google');
        } else {
            console.log("logged in")
            await this.setUserCredentials({
                access_token: userData.access_token,
                refresh_token: userData.refresh_token
            });
        }
    }

    setUserCredentials = async (authCode: any) => {
        const {tokens} = await oauth2Client.getToken(authCode);

        //TODO hash tokens

        this.tokens = {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        };

        await oauth2Client.setCredentials(this.tokens);

        const isUserSet = await getSetUser();

        if (!isUserSet) {
            const folderId = await createDriveFolder('Lindrive', null);
            console.log("OI",folderId)

            await UserData.create({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                rootFolderName: 'Lindrive',
                rootFolderId: folderId
            })
        }

        new NodeTracker('/home/lbruner/Documents/Cursos')
    }

    isAuthenticated = async () => {
        return await UserData.findOne()
    }
}