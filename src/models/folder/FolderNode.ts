import {INode} from "../nodes/ItemNodes";
import fs from "fs";
import path from "path";
import {createDriveFolder} from "../googleDrive/googleDriveAPI";
import Folder from "./Folder";
import {getItemCloudID, getModifiedDate} from "../../db/sequelize";

export class FolderNode implements INode {
    name: string;
    cloudID: string | null;
    modifiedDateLocal: string;
    parentFolderPath: string;

    constructor(public path: string, private rootFolderID: string) {
        const {name, parentFolderPath, modifiedDateLocal} = this.getItemDetails();
        this.name = name;
        this.parentFolderPath = parentFolderPath;
        this.modifiedDateLocal = modifiedDateLocal;
        this.cloudID = null;
    }

    async uploadToDrive(): Promise<string> {
        console.log(this.parentFolderPath)
        const dbResponse = await Folder.findOne({where: {path: this.parentFolderPath}, attributes:['cloudID']});
        console.log(dbResponse)
        const cloudID = dbResponse?.dataValues.cloudID;

        if (!cloudID) {
            return await createDriveFolder(this.name, this.rootFolderID)
        } else {
            console.log(cloudID)
            return await createDriveFolder(this.name, cloudID)
        }
    }

    async register(): Promise<void> {
        const {name, path, cloudID, modifiedDateLocal, parentFolderPath} = this;

        if(!cloudID){
            throw new Error("Item not found in database");
        }

        await Folder.create({name, path, cloudID, modifiedDateLocal, parentFolderPath});
    }

    getItemDetails(): { name: string; parentFolderPath: string; modifiedDateLocal: string } {
        const stat = fs.statSync(this.path);

        return {
            name: path.basename(this.path),
            parentFolderPath: path.dirname(this.path),
            modifiedDateLocal: new Date(stat.mtime).toISOString().slice(0, 19),
        };
    }

    async getRegisteredItem(): Promise<string | null> {
        return getItemCloudID(this.path, 'FOLDER');
    }

    async isItemDirty(): Promise<boolean> {
        const results = await getModifiedDate(this.path, 'FOLDER')

        if(!results){
            throw new Error("Item not found in database");
        }

        const dbModifiedDate = new Date(results).toISOString().slice(0, 19);
        const localModifiedDate = new Date(this.modifiedDateLocal).toISOString().slice(0, 19);

        return localModifiedDate > dbModifiedDate;
    }

    async updateItem(): Promise<void> {
        await Folder.update({modifiedDateLocal: new Date().toISOString().slice(0, 19)}, {where: {path: this.path}});
    }

}