export enum ServerEvents{
    authStart = 'auth:start',
    setupStart = 'user:setup-start',
    sendAddTrackingFolders = 'add:trackingFolders',
    sendTrackingFolders = 'send:TrackingFolders',
    sendDeletedTrackingFolder = 'del:TrackingFolder',
    sendNodeChanged = 'node:changed',
    getLogs = 'get:logs',
    sendLogs = 'logs:send',
    finishedLoading = 'finished:loading'
}