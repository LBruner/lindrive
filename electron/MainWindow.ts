import {BrowserWindow, ipcMain} from "electron";
import {ClientEvents, ServerEvents} from "../events";
import {authUrl, oauth2Client} from "../models/googleDrive/googleAuth";
import {UserManager} from "../models/user/UserManager";
import {MainEvents} from "./MainEvents";

export class MainWindow extends BrowserWindow {
    userInstance = UserManager.getInstance();
    mainEvents: MainEvents = new MainEvents(this);

    constructor(fileToLoad: string) {
        super({
            title: 'Lindrive',
            webPreferences: {
                nodeIntegration: true, preload: fileToLoad,
            },
            height: 600,
            width: 760,
            roundedCorners: true,
            center: true,
            resizable: false
        });

        this.mainEvents.setAllEvents();
    }

    checkUserLogin = async () => {
        try {
            if (!this.userInstance.isUserSetup()) {
                this.webContents.send(ClientEvents.initialSetup);

                ipcMain.on(ServerEvents.setupStart, async (_, args) => {
                    const {rootFolderName, trackHiddenNodes} = args;
                    await this.userInstance.setupUser(rootFolderName, trackHiddenNodes);
                    console.log("TRACK FILES", trackHiddenNodes);
                    this.webContents.send(ServerEvents.setupFinished);
                    await this.userInstance.initUser();
                    this.webContents.send(ClientEvents.startApp);
                })
            }

            await this.userInstance.initUser();
            console.log("User Returned!");
            this.webContents.send(ClientEvents.startApp);

        } catch (e) {
            this.webContents.send(ClientEvents.loadLoginPage);
            console.log('User first start')
            ipcMain.on(ServerEvents.authStart, async () => {
                const authWindow = new BrowserWindow({useContentSize: true});
                const code = await this.getOAuthCodeByInteraction(authWindow, authUrl);

                if (!code) {
                    throw new Error('No authentication code was provided.')
                }

                const tokensResponse = (await oauth2Client.getToken(code)).tokens;
                const {access_token, refresh_token} = tokensResponse;

                if (!access_token || !refresh_token) {
                    throw new Error('User tokens not available');
                }

                this.userInstance.saveUserTokens({access_token, refresh_token})

                console.log("User Logged in!");
                this.webContents.send(ClientEvents.initialSetup);
            });
        }
    }
    getOAuthCodeByInteraction = (interactionWindow: BrowserWindow, authPageURL: string): Promise<string | null> => {
        interactionWindow.loadURL(authPageURL);
        return new Promise((resolve, reject) => {
            const onClosed = () => {
                interactionWindow.close();
                reject('Interaction ended intentionally');
            };

            interactionWindow.on('closed', onClosed);

            interactionWindow.webContents.on('did-fail-load', (_, __, ___, validatedURL) => {
                const url = new URL(validatedURL)
                const authorizationCode = url.searchParams.get('code');

                interactionWindow.removeListener('closed', onClosed);
                if (!authorizationCode) {
                    reject('Login failed.');
                }

                interactionWindow.close();
                return resolve(authorizationCode);
            })
        });
    }
}