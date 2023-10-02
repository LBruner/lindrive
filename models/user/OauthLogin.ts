import {BrowserWindow} from "electron";
import {authUrl} from "../googleDrive/googleAuth";

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
                this.window.close();
            }
        })
        this.window.webContents.send('userAuthenticated')
    }
}