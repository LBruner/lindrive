import {ApiWatcher} from "./ApiWatcher";
import {ItemNodes} from "../nodes/ItemNodes";
import {FileNode} from "../files/FileNode";
import {FolderNode} from "../folder/FolderNode";
import {OfflineTracker} from "./OfflineTracker";
import fs from "fs";
import {FileStore, FolderStore} from "../storage/stores";

const watcherConfig = {
    awaitWriteFinish: {stabilityThreshold: 2000, pollInterval: 100},
    persistent: true,
    ignored: /(^|[/\\])\..obsidian/,
    ignoreInitial: true
}

export class NodeTracker {
    itemNodes: ItemNodes;
    watcher: ApiWatcher;
    fileStore: FileStore;
    folderStore: FolderStore = new FolderStore();

    constructor(public path: string) {
        this.fileStore = new FileStore();
        this.folderStore = new FolderStore();

        this.itemNodes = new ItemNodes(this.fileStore, this.folderStore);

        const pathIsValid = this.isFolderPathValid(path);
        if (pathIsValid) {
            this.watcher = new ApiWatcher(path, watcherConfig);
            this.watchDirectory();
        } else {
            console.log(path)
            throw new Error(`Path: ${path} is invalid!`);
        }

    };

    isFolderPathValid(folderPath: string) {
        try {
            const stats = fs.statSync(folderPath);
            return stats.isDirectory();
        } catch (error) {
            return false;
        }
    }

    handleNodesEvents = async () => {
        this.watcher.onAddFolder(this.addFolderHandler);
        this.watcher.onFolderDelete(this.deleteFolderHandler);
        this.watcher.onAddFile(this.addFileHandler);
        this.watcher.onFileUpdate(this.updateFileHandler);
        this.watcher.onFileDelete(this.deleteFileHandler);
    };

    watchDirectory = async () => {
        await this.handleNodesEvents();
    }

    unWatchDirectory = async () =>{
        await this.itemNodes.deleteNode(this.path, 'FOLDER');
        this.watcher.removeAllEvents();
    }

    //TODO Remove duplicated code
    private addFolderHandler = (nodePath: string) => {
        const folderNode = new FolderNode(nodePath, this.folderStore);
        this.itemNodes.addNode(folderNode);
    }

    private addFileHandler = (nodePath: string) => {
        const fileNode = new FileNode(nodePath, this.fileStore, this.folderStore);
        this.itemNodes.addNode(fileNode);
    }

    private updateFileHandler = async (nodePath: string) => {
        await this.itemNodes.updateNode(nodePath);
    };

    private deleteFileHandler = async (nodePath: string) => {
        await this.itemNodes.deleteNode(nodePath, "FILE");
    }

    private deleteFolderHandler = async (nodePath: string) => {
        await this.itemNodes.deleteNode(nodePath, "FOLDER");
    }

    handleInitialNodes = async () => {
        const offlineTrack = new OfflineTracker(this.path, this.folderStore, this.fileStore);
        const initialNodes = await offlineTrack.getInitialNodes();


        await this.itemNodes.addMultipleNodes(initialNodes);

        const deleteErasedNotes = async () => {

            const allFoldersPath = this.folderStore.getAllNodesPath(this.path);
            const allFilesPath = this.fileStore.getAllNodesPath(this.path);

            const initialNodesPath = initialNodes.map((item) => item.path);
            const toDeleteFolders = allFoldersPath.filter((item: string) => !initialNodesPath.includes(item));
            const toDeleteFiles = allFilesPath.filter((item: string) => !initialNodesPath.includes(item));

            for (let node of toDeleteFolders) {
                await this.itemNodes.deleteNode(node, "FOLDER");
            }

            for (let node of toDeleteFiles) {
                await this.itemNodes.deleteNode(node, "FILE");
            }
        }

        await deleteErasedNotes();
    }

}