import {INode} from "../nodes/ItemNodes";
import fs from "fs";
import path from "path";
import {TableIdentifier} from "../../services/types";
import {getRegisteredItem} from "./files.mysql";
import {updateCloudFile, uploadFile} from "../googleDrive/googleDriveAPI";
import query from "../../services/mysql";

interface FileDetails {
    extension: string,
    modifiedDate: string,
    name: string,
    parentFolderName: string,
    size: number,
}

export class FileNode implements INode {
    cloudID: string | undefined;
    extension: string;
    modifiedDate: string;
    name: string;
    parentFolderPath: string;
    size: number;

    constructor(public itemPath: string) {
        const {name, parentFolderName, modifiedDate, size, extension} = this.getItemDetails();
        this.extension = extension;
        this.modifiedDate = modifiedDate;
        this.name = name;
        this.parentFolderPath = parentFolderName;
        this.size = size;
    }



    getItemDetails(): FileDetails {
        const stat = fs.statSync(this.itemPath);

        return {
            name: path.basename(this.itemPath),
            parentFolderName: path.dirname(this.itemPath),
            modifiedDate: new Date(stat.mtime).toISOString().slice(0, 19),
            extension: path.extname(this.itemPath),
            size: stat.size,
        };
    }

    async getRegisteredItem(): Promise<{ cloudID: string | undefined }> {
        return await getRegisteredItem(this.itemPath, TableIdentifier.FILES);
    }

    async register(): Promise<void> {
        await query(`INSERT INTO lindrive.files (name, extension, path, parentFolderPath, cloudID, lastModifiedLocal,
                                                 lastModifiedCloud,
                                                 size) VALUE ("${this.name}", "${this.extension}", "${this.itemPath}",
                                                              "${this.parentFolderPath}", "${this.cloudID}",
                                                              "${this.modifiedDate}", "${this.modifiedDate}",
                                                              "${this.size}")`);
    }

    async uploadToDrive(): Promise<string> {
        const {cloudID} = await getRegisteredItem(this.parentFolderPath, TableIdentifier.FOLDERS);
        return await uploadFile({
            filePath: this.itemPath,
            fileExtension: this.extension,
            fileParentCloudID: cloudID!,
            fileName: this.name,
        })
    }

    async updateItem(): Promise<void> {
        const {name: fileName, extension: fileExtension, cloudID: fileID, itemPath: filePath,} = this;
        await updateCloudFile({fileExtension, fileName, fileID, filePath});
        await query(`UPDATE lindrive.files
                     SET lastModifiedCloud = "${new Date().toISOString().slice(0, 19)}",
                         lastModifiedLocal = "${new Date().toISOString().slice(0, 19)}"
                     WHERE path = "${filePath}"`);
    }

    async isItemDirty(): Promise<boolean> {
        const [results] = await query(`SELECT lastModifiedLocal
                                       from lindrive.files
                                       WHERE path = "${this.itemPath}"`);
        const dbModifiedDate = new Date(results.lastModifiedLocal).toISOString().slice(0, 19);
        const localModifiedDate = new Date(this.modifiedDate).toISOString().slice(0, 19);

        return localModifiedDate > dbModifiedDate
    }
}