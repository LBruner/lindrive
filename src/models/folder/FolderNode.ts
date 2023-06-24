import {ItemNode} from "./ItemNode";
import query from "../../services/mysql";
import fs from "fs";
import path from "path";
import {getRegisteredItem} from "../files/files.mysql";
import {TableIdentifier} from "../../services/types";
import {createDriveFolder} from "../googleDrive/googleDriveAPI";

export class FolderNode extends ItemNode {
    name: string;
    cloudID: string | undefined;
    modifiedDate: string;
    parentFolderPath: string;

    constructor(public itemPath: string, private rootFolderID: string) {
        super();
        const {name, parentFolderName, modifiedDate} = this.getItemDetails();
        this.name = name;
        this.parentFolderPath = parentFolderName;
        this.modifiedDate = modifiedDate;
    }

    async uploadToDrive(): Promise<string> {
        const cloudID = await getRegisteredItem(this.parentFolderPath, TableIdentifier.FOLDERS);
        if (!cloudID) {
            return await createDriveFolder(this.name, this.rootFolderID)
        } else {
            return await createDriveFolder(this.name, cloudID.cloudID!)
        }
    }

    async register(): Promise<void> {
        await query(`INSERT INTO lindrive.folders (name, path, cloudID, modifiedDate) VALUE ("${this.name}", "${this.itemPath}", "${this.cloudID}", "${this.modifiedDate}")`)
    }

    getItemDetails(): { name: string; parentFolderName: string; modifiedDate: string } {
        const stat = fs.statSync(this.itemPath);

        return {
            name: path.basename(this.itemPath),
            parentFolderName: path.dirname(this.itemPath),
            modifiedDate: new Date(stat.mtime).toISOString().slice(0, 19)
        };
    }


    async getRegisteredItem(): Promise<{ cloudID: string | undefined }> {
        return await getRegisteredItem(this.itemPath, TableIdentifier.FOLDERS);
    }


    async isItemDirty(): Promise<boolean> {
        const [results] = await query(`SELECT modifiedDate
                                       from folders
                                       WHERE path = "${this.itemPath}"`);
        const dbModifiedDate = new Date(results.modifiedDate).toISOString().slice(0, 19);
        const localModifiedDate = new Date(this.modifiedDate).toISOString().slice(0, 19);

        console.log(this.name, localModifiedDate, dbModifiedDate);
        return localModifiedDate > dbModifiedDate
    }

}