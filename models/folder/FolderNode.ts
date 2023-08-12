import {INode} from "../nodes/ItemNodes";
import fs from "fs";
import path from "path";
import {createDriveFolder} from "../googleDrive/googleDriveAPI";
import {getModifiedDate} from "../../db/sequelize";
import {NodeStore, UserStore} from "../storage/stores";
import {IFolder} from "../storage/stores/NodeStore";

export class FolderNode implements INode {
    name: string;
    cloudId: string | null;
    modifiedLocal: string;
    parentFolderPath: string;
    nodeStore: NodeStore;

    constructor(public path: string) {
        this.nodeStore = new NodeStore();
        const {name, parentFolderPath, modifiedDateLocal} = this.getItemDetails();
        this.name = name;
        this.parentFolderPath = parentFolderPath;
        this.modifiedLocal = modifiedDateLocal;
        this.cloudId = null;
    }

    async uploadToDrive(): Promise<string | null> {
        const parentFolder = await this.nodeStore.getParentFolder(this.parentFolderPath);

        if (!parentFolder?.cloudId) {
            const userStorage = new UserStore();
            const rootFolder = await userStorage.getRootFolder();

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
        const {name, path, cloudId, modifiedLocal, parentFolderPath} = this;

        if (!cloudId) {
            throw new Error("Item not found in database");
        }

        await this.nodeStore.createFolder({name, path, cloudId, parentFolderPath, modifiedLocal});
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
        return this.nodeStore.getFolderCloudId(this.path);
    }

    async isItemDirty(): Promise<boolean> {
        const results = await getModifiedDate(this.path, 'FOLDER');

        const storeModifiedDate = await this.nodeStore.getModifiedDate(this.path);

        if (!storeModifiedDate) {
            throw new Error("Item not found in database. isItemDirty error!");
        }

        const dbModifiedDate = new Date(storeModifiedDate).toISOString().slice(0, 19);
        const localModifiedDate = new Date(this.modifiedLocal).toISOString().slice(0, 19);

        return localModifiedDate > dbModifiedDate;
    }

    async updateItem(): Promise<void> {
        const {name, path, modifiedLocal, parentFolderPath, cloudId} = this;
        const updatingFolder: IFolder = {name, path, cloudId, parentFolderPath, modifiedLocal}
        await this.nodeStore.updateFolder(updatingFolder);
    }

}