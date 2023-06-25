import chokidar from 'chokidar';
import {FolderNode} from "../folder/FolderNode";
import {FileNode} from "../files/FileNode";
import {INode, ItemsNode} from "../folder/ItemsNode";


export class Watcher {
    allNodes: ItemsNode = new ItemsNode()

    constructor(public directory: string, public rootCloudID: string) {
        this.watchDirectory();
    }

    async createInitialFolders() {
        const initialFolders: INode[] = []
        const promise = new Promise<void>((resolve, reject) => {
            chokidar.watch(this.directory).on("addDir", (eventName) => {
                const folderNode = new FolderNode(eventName, this.rootCloudID);
                initialFolders.push(folderNode);
            }).on("ready", async () => {
                console.log("OI", initialFolders)
                await this.allNodes.addMultipleNodes(initialFolders);
                resolve();
            });
        })
        //TODO REMOVE LISTENERS!!
        return promise;
    }

    async watchDirectory() {
        await this.createInitialFolders();
        console.log("FINSHED")
        await chokidar.watch(this.directory, {ignoreInitial: true}).on('addDir', async (eventName) => {
            const folderNode = new FolderNode(eventName, this.rootCloudID);
            await this.allNodes.addSingleNode(folderNode);
        });
        //
        chokidar.watch(this.directory).on('add', async (eventName: string) => {
            const fileNode = new FileNode(eventName);
            await this.allNodes.addSingleNode(fileNode);
        });
        console.log("FINSHED")


        chokidar.watch(this.directory,{awaitWriteFinish: {pollInterval: 100, stabilityThreshold: 50}}).on('change', async (eventName: string) => {
            await this.allNodes.updateNode(eventName);
            console.log("CHANGED", eventName);
        })
    }
}