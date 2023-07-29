import {BrowserWindow, ipcMain} from "electron";
import {authUrl, oauth2Client} from "../googleDrive/googleAuth";
import {UserManager} from "./UserManager";

export class OauthLogin {
    window: BrowserWindow;

    constructor() {
        this.window = new BrowserWindow({
            title: 'Login',
            width: 800,
            height: 800
        })
        this.window.loadURL(authUrl).then(this.handleLogin);
    }

    handleLogin = () => {
        this.window.webContents.on('will-redirect', async (event, url) => {
            const code = new URL(url).searchParams.get('code');
            if (code) {
                await UserManager.getInstance().setUserCredentials(code)
                this.window.close();
            }
        })
        this.window.webContents.send('userAuthenticated')
    }
}