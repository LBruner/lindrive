export interface File {
    name: string;
    size: number;
    extension: string;
    path: string;
    modifiedDate: string;
    parentFolder?: string,
    cloudID?: string
}

export interface Folder {
    name: string;
    path: string;
    parentFolderName: string,
    modifiedDate: string,
    cloudID?: string,
    parentFolderID?: string
}

export interface Result {
    files: File[];
    folders: Folder[];
}