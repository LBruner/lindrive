import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import {authUrl, oauth2Client} from "../models/googleDrive/googleAuth";
import {UserManager} from "../models/user/UserManager";
import {ClientEvents, ServerEvents} from '../events'
import {NodeLog} from "../models/nodes/NodeLog";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
let mainWindow: BrowserWindow;
const userInstance = UserManager.getInstance();

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        title: 'Lindrive',
        webPreferences: {
            nodeIntegration: true, preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        height: 600,
        width: 760,
        roundedCorners: true,
        center: true,
        resizable: false
    });

    await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    const devTools = new BrowserWindow();
    mainWindow.webContents.setDevToolsWebContents(devTools.webContents);
    mainWindow.webContents.openDevTools({mode: 'detach'});

    const eventEmitter = userInstance.nodesManager.getNodesEmitter();

    eventEmitter.on(ServerEvents.sendNodeChanged, (newLog:NodeLog) =>{
        console.log('new', newLog)
        mainWindow.webContents.send(ServerEvents.sendNodeChanged, newLog);
    });

    ipcMain.on(ClientEvents.getLogs, () =>{
        console.log("GIVE ME LOGS")
        const emitter = userInstance.nodesManager.getNodesEmitter();
        emitter.emit(ServerEvents.getLogs);
    });

    //TODO this event is being triggered 3 times.
    eventEmitter.on(ServerEvents.sendLogs, (dayLogs:NodeLog[]) =>{
        console.log("SENDING LOGS")
        mainWindow.webContents.send(ServerEvents.sendLogs, dayLogs.reverse());
    });

    try {
        ipcMain.on(ClientEvents.addTrackingFolders, async (_, paths: string[]) => {
            for (const path of paths) {
                await UserManager.getInstance().nodesManager.addTrackingFolder(path);
            }
            mainWindow.webContents.send(ServerEvents.sendAddTrackingFolders);
        });

        ipcMain.on(ClientEvents.getTrackingFolders, () => {
            const trackingFolders = UserManager.getInstance().nodesManager.getTrackingFolders();
            mainWindow.webContents.send(ServerEvents.sendTrackingFolders, trackingFolders);
        });

        ipcMain.on(ClientEvents.deleteTrackingFolder, async (_, path: string) => {
            await UserManager.getInstance().nodesManager.deleteTrackingFolder(path);
            mainWindow.webContents.send(ServerEvents.sendDeletedTrackingFolder, path);
        });

        await userInstance.initUser();
        console.log("User Returned!");
        mainWindow.webContents.send(ClientEvents.startApp);
        return;
    } catch (e) {
        mainWindow.webContents.send(ClientEvents.loadLoginPage);
        console.log('User first start')
        ipcMain.on(ServerEvents.authStart, async () => {
            const authWindow = new BrowserWindow({useContentSize: true});
            const code = await getOAuthCodeByInteraction(authWindow, authUrl);

            if (!code) {
                throw new Error('No authentication code was provided.')
            }

            const tokensResponse = (await oauth2Client.getToken(code)).tokens;
            const {access_token, refresh_token} = tokensResponse;

            if (!access_token || !refresh_token) {
                throw new Error('User tokens not available');
            }

            userInstance.saveUserTokens({access_token, refresh_token})

            console.log("User Logged in!");
            mainWindow.webContents.send(ClientEvents.initialSetup);
        });
    }


    ipcMain.on(ServerEvents.setupStart, async (_, args) => {
        const {selectedFolders, rootFolderName} = args;

        await userInstance.setupUser(selectedFolders, rootFolderName);
        await userInstance.initUser();
        mainWindow.webContents.send(ClientEvents.startApp);
    })


});

ipcMain.on('openFolderDialog', (event) => {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'multiSelections', 'showHiddenFiles'],
    }).then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
            const folderPaths = result.filePaths;
            console.log(folderPaths)
            event.reply('selectedFolders', folderPaths);
        }
    }).catch((err) => {
        console.error(err);
    });
});


const getOAuthCodeByInteraction = (interactionWindow: BrowserWindow, authPageURL: string): Promise<string | null> => {
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
};

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
