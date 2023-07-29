export type FileUploadData = {
    filePath: string,
    fileExtension: string,
    fileParentCloudID: string,
    fileName: string,
}

export type FileUpdateData = {
    fileExtension: string,
    fileID: string | undefined,
    fileName: string,
    filePath: string,
}
