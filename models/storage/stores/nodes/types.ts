interface File {
    name: string,
    cloudId: string | null,
    path: string,
    parentFolderPath: string,
    modifiedLocal: string,
    modifiedCloud: string,
    size: number,
    extension: string,
}
 interface Folder {
    name: string,
    cloudId: string | null,
    path: string,
    modifiedLocal: string,
    parentFolderPath: string,
}

export type INode = Folder | File


export {Folder,File}