import {INode} from "../nodes/ItemNodes";
import fs from "fs";
import path from "path";
import {updateCloudFile, uploadFile} from "../googleDrive/googleDriveAPI";
import File from "./File";
import {getItemCloudID, getModifiedDate, updateModifiedDate} from "../../db/sequelize";

interface FileDetails {
    extension: string,
    modifiedDateLocal: string,
    name: string,
    parentFolderPath: string,
    size: number,
}

export class FileNode implements INode {
    cloudID: string | null;
    extension: string;
    modifiedDateLocal: string;
    name: string;
    parentFolderPath: string;
    size: number;

    constructor(public path: string) {
        const {name, parentFolderPath, modifiedDateLocal, size, extension} = this.getItemDetails();
        this.extension = extension;
        this.modifiedDateLocal = modifiedDateLocal;
        this.name = name;
        this.parentFolderPath = parentFolderPath;
        this.size = size;
        this.cloudID = null;
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

    async getRegisteredItem(): Promise<string | null> {
        return getItemCloudID(this.path, 'FILE');
    }

    async register(): Promise<void> {

        const {name, extension, path, parentFolderPath, modifiedDateLocal, size, cloudID} = this;

        if (!cloudID) {
            throw new Error('CloudID is null.')
        }

        await File.create({
            name,
            extension,
            path,
            parentFolderPath,
            modifiedDateLocal,
            size,
            cloudID,
            modifiedDateCloud: modifiedDateLocal,
        })
    }

    async uploadToDrive(): Promise<string> {
        const cloudID = await getItemCloudID(this.parentFolderPath, 'FOLDER');
        return await uploadFile({
            filePath: this.path,
            fileExtension: this.extension,
            fileParentCloudID: cloudID!,
            fileName: this.name,
        })
    }

    async updateItem(): Promise<void> {
        const {name: fileName, extension: fileExtension, cloudID, path: filePath,} = this;

        if (!cloudID) {
            throw new Error('CloudID is null.')
        }

        await updateCloudFile({fileExtension, fileName, fileID: cloudID, filePath});
        await updateModifiedDate(filePath, "FILE");
    }

    async isItemDirty(): Promise<boolean> {
        const results = await getModifiedDate(this.path, 'FILE');

        if (!results) {
            throw new Error('Error getting modified date');
        }

        const dbModifiedDate = new Date(results).toISOString().slice(0, 19);
        const localModifiedDate = new Date(this.modifiedDateLocal).toISOString().slice(0, 19);

        return localModifiedDate > dbModifiedDate
    }
}