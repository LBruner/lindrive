export enum ServerEvents{
    authStart = 'auth:start',
    setupStart = 'user:setup-start',
    setupFinish = 'user:setup-finish',
    sendAddTrackingFolders = 'add:trackingFolders',
    sendTrackingFolders = 'send:TrackingFolders',
    sendDeletedTrackingFolder = 'del:TrackingFolder',
    sendNodeChanged = 'node:changed',
}