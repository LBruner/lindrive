export interface RootFolder {
    id: string | null,
    name: string
}
export interface IUser {
    access_token: string | null,
    refresh_token: string | null,
    rootFolder: RootFolder,
    trackingFolders: string[]
}