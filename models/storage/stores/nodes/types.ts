interface File {
    name: string,
    cloudId: string | null,
    path: string,
    parentFolderPath: string,
    modified: string,
    size: number,
    extension: string,
}
 interface Folder {
    name: string,
    cloudId: string | null,
    path: string,
    modified: string,
    parentFolderPath: string,
}

export type INode = Folder | File


export {Folder,File}