import {ApiWatcher} from "./ApiWatcher";
import {ItemNodes} from "../nodes/ItemNodes";
import {FileNode} from "../files/FileNode";
import {FolderNode} from "../folder/FolderNode";
import {OfflineTracker} from "./OfflineTracker";
import {getAllNodesPath} from "../../db/sequelize";
import fs from "fs";

const watcherConfig = {
    awaitWriteFinish: {stabilityThreshold: 2000, pollInterval: 100},
    persistent: true,
    ignored: /(^|[/\\])\..obsidian/,
    ignoreInitial: true
}

export class NodeTracker {
    itemNodes: ItemNodes = new ItemNodes();
    watcher: ApiWatcher;

    constructor(private path: string) {
        const pathIsValid = this.isFolderPathValid(path);
        if (pathIsValid) {
            this.watcher = new ApiWatcher(path, watcherConfig);
            this.watchDirectory();
        } else {
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
        await this.handleInitialNodes();
        this.watcher.onAddFolder(this.addFolderHandler);
        this.watcher.onFolderDelete(this.deleteFolderHandler);
        this.watcher.onAddFile(this.addFileHandler);
        this.watcher.onFileUpdate(this.updateFileHandler);
        this.watcher.onFileDelete(this.deleteFileHandler);
    };

    watchDirectory = async () => {
        await this.handleNodesEvents();
    }

    //TODO Remove duplicated code
    private addFolderHandler = (nodePath: string) => {
        const folderNode = new FolderNode(nodePath);
        this.itemNodes.addNode(folderNode);
    }

    private addFileHandler = (nodePath: string) => {
        const fileNode = new FileNode(nodePath);
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
        const offlineTrack = new OfflineTracker(this.path);
        const initialNodes = await offlineTrack.getInitialNodes();
        await this.itemNodes.addMultipleNodes(initialNodes);

        const deleteErasedNotes = async () => {
            const allFoldersPath = await getAllNodesPath('FOLDER');
            const allFilesPath = await getAllNodesPath('FILE');

            const initialNodesPath = initialNodes.map((item) => item.path)

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