import {ClientEvents, ServerEvents} from "../events";
import {NodeLog} from "../models/nodes/NodeLog";
import {app, ipcMain} from "electron";
import {UserManager} from "../models/user/UserManager";
import {MainWindow} from "./MainWindow";
import {Notification} from '../src/components/UI/Notification'

const userInstance = UserManager.getInstance();
const eventEmitter = userInstance.nodesManager.getNodesEmitter();

interface EventTrigger {
    eventName: string,
    fn: (...args: any) => any
}

export class MainEvents {

    constructor(private mainWindow: MainWindow) {
    }

    setAllEvents = () => {

        const clientEvents: EventTrigger[] = [
            {eventName: ClientEvents.getLogs, fn: this.onClientGetLogs},
            {eventName: ClientEvents.addTrackingFolders, fn: this.onClientAddFolder},
            {eventName: ClientEvents.getTrackingFolders, fn: this.onClientGetTrackingFolder},
            {eventName: ClientEvents.deleteTrackingFolder, fn: this.onClientDeleteTrackingFolder},
            {eventName: ClientEvents.logout, fn: this.onLogout},
        ];

        const backendEvents: EventTrigger[] = [
            {eventName: ServerEvents.sendNodeChange, fn: this.onSendNodeChange},
            {eventName: ServerEvents.sendLogs, fn: this.onServerSendLogs},
        ]

        clientEvents.forEach((event) => {
            ipcMain.on(event.eventName, event.fn);
        });

        backendEvents.forEach((event) => {
            eventEmitter.on(event.eventName, event.fn);
        })

        console.log(this.mainWindow.webContents.eventNames())
    }

    onSendNodeChange = (newLog: NodeLog) => {
        console.log('new', newLog)
        this.mainWindow.webContents.send(ServerEvents.sendNodeChange, newLog);
    }

    onClientGetLogs = () => {
        const emitter = userInstance.nodesManager.getNodesEmitter();
        emitter.emit(ServerEvents.getLogs);
    }

    onServerSendLogs = (dayLogs: NodeLog[]) => {
        console.log("SENDING LOGS")
        this.mainWindow.webContents.send(ServerEvents.sendLogs, dayLogs.reverse());
    }

    onClientAddFolder = async (_: string, paths: string[]) => {
        for (const path of paths) {
            await UserManager.getInstance().nodesManager.addTrackingFolder(path);
        }
        this.mainWindow.webContents.send(ServerEvents.sendAddTrackingFolders, paths);

        const notification: Notification = {
            details: {
                title: `Success!`,
                status: 'success',
                message: 'The folder was added',
            },
            timer: 3000
        }
        this.mainWindow.webContents.send(ServerEvents.finishedLoading, notification);

        console.log(paths)
    }

    onClientGetTrackingFolder = () => {
        const trackingFolders = UserManager.getInstance().nodesManager.getTrackingFolders();
        this.mainWindow.webContents.send(ServerEvents.sendTrackingFolders, trackingFolders);
    };

    onClientDeleteTrackingFolder = async (_: string, path: string) => {
        await UserManager.getInstance().nodesManager.deleteTrackingFolder(path);
        this.mainWindow.webContents.send(ServerEvents.sendTrackingFolders, UserManager.getInstance().nodesManager.getTrackingFolders());

        const notification: Notification = {
            details: {
                title: `Success!`,
                status: 'success',
                message: 'The folder was deleted'
            },
            timer: 3000
        }

        this.mainWindow.webContents.send(ServerEvents.finishedLoading, notification);
    };

    onLogout = async () => {
        await userInstance.logout();
        app.relaunch()
        app.exit()
    }
}


// eventEmitter.on(ServerEvents.sendNodeChange, (newLog: NodeLog) => {
//     console.log('new', newLog)
//     mainWindow.webContents.send(ServerEvents.sendNodeChange, newLog);
// });

// ipcMain.on(ClientEvents.getLogs, () => {
//     const emitter = userInstance.nodesManager.getNodesEmitter();
//     emitter.emit(ServerEvents.getLogs);
// });

//TODO this event is being triggered 3 times.
// eventEmitter.on(ServerEvents.sendLogs, (dayLogs: NodeLog[]) => {
//     console.log("SENDING LOGS")
//     mainWindow.webContents.send(ServerEvents.sendLogs, dayLogs.reverse());
// });

// ipcMain.on(ClientEvents.addTrackingFolders, async (_, paths: string[]) => {
//     for (const path of paths) {
//         await UserManager.getInstance().nodesManager.addTrackingFolder(path);
//     }
//     mainWindow.webContents.send(ServerEvents.sendAddTrackingFolders, paths);
//
//     const notification: Notification = {
//         details: {
//             title: `Success!`,
//             status: 'success',
//             message: 'The folder was added'
//         },
//         timer: 3000
//     }
//     mainWindow.webContents.send(ServerEvents.finishedLoading, notification);
// });

// ipcMain.on(ClientEvents.getTrackingFolders, () => {
//     const trackingFolders = UserManager.getInstance().nodesManager.getTrackingFolders();
//     mainWindow.webContents.send(ServerEvents.sendTrackingFolders, trackingFolders);
// });

// ipcMain.on(ClientEvents.deleteTrackingFolder, async (_, path: string) => {
//     await UserManager.getInstance().nodesManager.deleteTrackingFolder(path);
//     mainWindow.webContents.send(ServerEvents.sendTrackingFolders, UserManager.getInstance().nodesManager.getTrackingFolders());
//
//     const notification: Notification = {
//         details: {
//             title: `Success!`,
//             status: 'success',
//             message: 'The folder was deleted'
//         },
//         timer: 3000
//     }
//
//     mainWindow.webContents.send(ServerEvents.finishedLoading, notification);
// });

// ipcMain.on(ClientEvents.logout, async () => {
//     await userInstance.logout();
//     app.relaunch()
//     app.exit()
// });