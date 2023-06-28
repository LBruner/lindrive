import {ApiWatcher} from "./ApiWatcher";
import {ItemNodes} from "../nodes/ItemNodes";
import {FileNode} from "../files/FileNode";
import {FolderNode} from "../folder/FolderNode";
import {OfflineTracker} from "./OfflineTracker";
import query from "../../services/mysql";

export class NodeTracker {
    itemNodes: ItemNodes = new ItemNodes();
    watcher: ApiWatcher;

    constructor(private path: string, private rootCloudId: string) {
        this.watcher = new ApiWatcher(path, {
            awaitWriteFinish: {stabilityThreshold: 2000, pollInterval: 100},
            persistent: true,
            ignoreInitial: true
        });
        this.watchDirectory();
    };

    handleNodesEvents = async () => {
        await this.handleInitialNodes();
        this.watcher.onAddFolder(this.addFolderHandler);
        this.watcher.onAddFile(this.addFileHandler);
        this.watcher.onFileUpdate(this.updateFileHandler);
        this.watcher.onFileDelete(this.deleteFileHandler);
        this.watcher.onFolderDelete(this.deleteFolderHandler);
    };

    watchDirectory = async () => {
        await this.handleNodesEvents();
    }

    private addFolderHandler = (nodePath: string) => {
        const folderNode = new FolderNode(nodePath, this.rootCloudId);
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
        const initialNodes = await offlineTrack.getInitialNodes(this.rootCloudId);
        await this.itemNodes.addMultipleNodes(initialNodes);

        const deleteErasedNotes = async () => {
            const allFoldersPath = await query(`SELECT path
                                                FROM folders`);
            const allFilesPath = await query(`SELECT path
                                              FROM files`);
            const allFoldersFormatted = allFoldersPath.map((item: { path: string }) => item.path);
            const allFilesFormatted = allFilesPath.map((item: { path: string }) => item.path);

            const initialNodesPath = initialNodes.map((item) => item.itemPath)

            const toDeleteFolders = allFoldersFormatted.filter((item: string) => !initialNodesPath.includes(item));
            const toDeleteFiles = allFilesFormatted.filter((item: string) => !initialNodesPath.includes(item));

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