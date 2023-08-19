export enum ServerEvents{
    authStart = 'auth:start',
    setupStart = 'user:setup-start',
    setupFinish = 'user:setup-finish',
    sendTrackingFolders = 'send:TrackingFolders',
    sendDeletedTrackingFolder = 'del:TrackingFolder'
}