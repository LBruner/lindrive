import {INode} from "../nodes/ItemNodes";
import fs from "fs";
import path from "path";
import {updateCloudFile, uploadFile} from "../googleDrive/googleDriveAPI";
import {FileStore, FolderStore} from "../storage/stores";

interface FileDetails {
    extension: string,
    modifiedDateLocal: string,
    name: string,
    parentFolderPath: string,
    size: number,
}

export class FileNode implements INode {
    cloudId: string | null;
    extension: string;
    modified: string;
    name: string;
    parentFolderPath: string;
    size: number;

    constructor(public path: string, private fileStore: FileStore, private folderStore: FolderStore) {
        const {name, parentFolderPath, modifiedDateLocal, size, extension} = this.getItemDetails();
        this.extension = extension;
        this.modified = modifiedDateLocal;
        this.name = name;
        this.parentFolderPath = parentFolderPath;
        this.size = size;
        this.cloudId = null;
    }


    getItemDetails(): FileDetails {
        const stat = fs.statSync(this.path);

        return {
            name: path.basename(this.path),
            parentFolderPath: path.dirname(this.path),
            modifiedDateLocal: new Date(stat.mtime).toISOString().slice(0, 19),
            extension: path.extname(this.path),
            size: stat.size,
        };
    }

    getRegisteredItemId = async (): Promise<string | undefined> => {
        return this.fileStore.getCloudId(this.path);
    }

    async register(): Promise<void> {

        const {name, extension, path, parentFolderPath, modified, size, cloudId} = this;

        if (!cloudId) {
            throw new Error('CloudID is null.')
        }

        this.fileStore.createOne({
            cloudId,
            extension,
            modified,
            name,
            path,
            parentFolderPath,
            size,
        })
    }

    async uploadToDrive(): Promise<string | null> {
        const parentFolder = this.folderStore.getParentFolder(this.parentFolderPath);

        if (!parentFolder) {
            throw new Error(`No parent folder was found for the file: ${this.path}`);
        }

        return await uploadFile({
            filePath: this.path,
            fileExtension: this.extension,
            fileParentCloudID: parentFolder.cloudId!,
            fileName: this.name,
        })
    }

    async updateItem(): Promise<void> {
        const {name: fileName, extension: fileExtension, cloudId, path: filePath, modified, size, parentFolderPath} = this;

        if (!cloudId) {
            throw new Error('CloudID is null.')
        }

        await updateCloudFile({fileExtension, fileName, fileID: cloudId, filePath});
        this.fileStore.updateOne({path: filePath, name: fileName, extension: fileExtension, modified, size: size, cloudId, parentFolderPath})
    }

    async isItemDirty(): Promise<boolean> {
        const results = this.fileStore.getModifiedDate(this.path)

        if (!results) {
            throw new Error('Error getting modified date');
        }

        const dbModifiedDate = new Date(results).toISOString().slice(0, 19);
        const localModifiedDate = new Date(this.modified).toISOString().slice(0, 19);

        return localModifiedDate > dbModifiedDate
    }
}