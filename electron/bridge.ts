import {contextBridge, dialog, ipcRenderer, remote} from 'electron'
export const api = {
    send: (event: string, args?: any) => {
        ipcRenderer.send(event, args);
    },

    on: (channel: string, callback: Function) => {
        ipcRenderer.on(channel, (_, data) => callback(data))
    },

    removeAllListeners: (listener: string) => {
        ipcRenderer.removeAllListeners('selectedFolders');
    }
}

contextBridge.exposeInMainWorld('Main', api);
