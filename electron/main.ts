import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import {MainWindow} from "./MainWindow";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
let mainWindow: MainWindow;

app.on('ready', async () => {
    mainWindow = new MainWindow(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);

    const devTools = new BrowserWindow();
    mainWindow.webContents.setDevToolsWebContents(devTools.webContents);
    mainWindow.webContents.openDevTools({mode: 'detach'});

    await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    await mainWindow.checkUserLogin();
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

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})