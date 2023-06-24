import chokidar, {WatchOptions} from 'chokidar';
import {FolderNode} from "../folder/FolderNode";

export interface IWatchable {
    itemPath: string,
    getItemDetails: () => { name: string; parentFolderName: string; modifiedDate: string }
    isItemDirty: () => Promise<boolean>
    syncToCloud: () => void
}


export class Watcher {

    constructor(public directory: string, public rootCloudID: string) {
        this.watchDirectory()
    }

    async createInitialFolders() {
        const initialFolders: FolderNode[] = [];
        chokidar.watch(this.directory).on("addDir", (eventName) => {
            const folderNode = new FolderNode(eventName, this.rootCloudID);
            initialFolders.push(folderNode)
        }).on("ready", async () => {
            for (let folder of initialFolders) {
                await folder.processAddItem()
            }
            console.log("FINISHED INITIAL FOLDERS ");
        })
    }

    async watchDirectory() {
        await this.createInitialFolders();

        await chokidar.watch(this.directory, {ignoreInitial: true}).on('addDir', async (eventName) => {
            const itemNode = new FolderNode(eventName, this.rootCloudID);
            await itemNode.processAddItem()
        });
    }
}