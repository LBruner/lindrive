import {INode} from "../nodes/ItemNodes";
import fs from "fs";
import path from "path";
import {createDriveFolder} from "../googleDrive/googleDriveAPI";
import {FolderStore, UserStore} from "../storage/stores";
import {Folder} from "../storage/stores/nodes/types";

export class FolderNode implements INode {
    name: string;
    cloudId: string | null;
    modified: string;
    parentFolderPath: string;

    constructor(public path: string, private folderStore: FolderStore) {
        const {name, parentFolderPath, modifiedDateLocal} = this.getItemDetails();
        this.name = name;
        this.parentFolderPath = parentFolderPath;
        this.modified = modifiedDateLocal;
        this.cloudId = null;
    }

    async uploadToDrive(): Promise<string | null> {
        const parentFolder = this.folderStore.getParentFolder(this.parentFolderPath);


        console.log("PARENT FOLDER", parentFolder)
        if (!parentFolder?.cloudId) {
            const userStore = new UserStore();
            const rootFolder = userStore.getRootFolder();

            if (!rootFolder) {
                throw new Error('Root user was not created!');
            }

            return await createDriveFolder(this.name, rootFolder.id)
        } else {
            console.log(parentFolder.path)
            return await createDriveFolder(this.name, parentFolder.cloudId)
        }
    }

    async register(): Promise<void> {
        const {name, path, cloudId, modified, parentFolderPath} = this;

        if (!cloudId) {
            throw new Error("Item not found in database");
        }

        this.folderStore.createOne({name, path, cloudId, parentFolderPath, modified});
    }

    getItemDetails(): { name: string; parentFolderPath: string; modifiedDateLocal: string } {
        const stat = fs.statSync(this.path);

        return {
            name: path.basename(this.path),
            parentFolderPath: path.dirname(this.path),
            modifiedDateLocal: new Date(stat.mtime).toISOString().slice(0, 19),
        };
    }

    async getRegisteredItemId(): Promise<string | undefined> {
        return this.folderStore.getCloudId(this.path);
    }

    async isItemDirty(): Promise<boolean> {
        const storeModifiedDate = this.folderStore.getModifiedDate(this.path);

        if (!storeModifiedDate) {
            throw new Error("Item not found in database. isItemDirty error!");
        }

        const dbModifiedDate = new Date(storeModifiedDate).toISOString().slice(0, 19);
        const localModifiedDate = new Date(this.modified).toISOString().slice(0, 19);

        return localModifiedDate > dbModifiedDate;
    }

    async updateItem(): Promise<void> {
        const {name, path, modified, parentFolderPath, cloudId} = this;
        const updatingFolder: Folder = {name, path, cloudId, parentFolderPath, modified}
        this.folderStore.updateOne(updatingFolder);
    }

}