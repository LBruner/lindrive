export enum ServerEvents {
    authStart = 'auth:start',
    setupStart = 'user:setup-start',
    setupFinished = 'user:setup-finished',
    sendAddTrackingFolders = 'add:trackingFolders',
    sendTrackingFolders = 'send:TrackingFolders',
    sendDeletedTrackingFolder = 'del:TrackingFolder',
    sendNodeChange = 'node:changed',
    getLogs = 'get:logs',
    sendLogs = 'logs:send',
    finishedLoading = 'finished:loading'
}