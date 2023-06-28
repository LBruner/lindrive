import {ApiWatcher} from "./ApiWatcher";
import {ItemNodes} from "../folder/ItemNodes";
import {FileNode} from "../files/FileNode";
import {FolderNode} from "../folder/FolderNode";
import query from "../../services/mysql";

export class NodeWatcher {
    itemNodes: ItemNodes = new ItemNodes();
    watcher: ApiWatcher;

    constructor(private path: string, private rootCloudId: string) {
        this.watcher = new ApiWatcher(path);
        this.watchDirectory();
    };

    handleInitialNodes = async () => {
        const initialNodes = await this.watcher.getInitialNodes(this.rootCloudId);
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

    handleNodesEvents = () => {
        this.watcher.onAddFolder(this.addFolderHandler);
        this.watcher.onAddFile(this.addFileHandler);
        this.watcher.onFileUpdate(this.updateFileHandler);
        this.watcher.onFileDelete(this.deleteFileHandler);
        this.watcher.onFolderDelete(this.deleteFolderHandler);
    };

    watchDirectory = async () => {
        await this.handleInitialNodes();
        await this.handleNodesEvents();
    }

    private addFolderHandler = (nodePath: string) => {
        const folderNode = new FolderNode(nodePath, this.rootCloudId);
        this.itemNodes.addSingleNode(folderNode);
    }

    private addFileHandler = (nodePath: string) => {
        const fileNode = new FileNode(nodePath);
        this.itemNodes.addSingleNode(fileNode);
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

}