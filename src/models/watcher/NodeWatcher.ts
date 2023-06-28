import {ApiWatcher} from "./ApiWatcher";
import {ItemNodes} from "../nodes/ItemNodes";
import {FileNode} from "../files/FileNode";
import {FolderNode} from "../folder/FolderNode";

export class NodeWatcher {
    itemNodes: ItemNodes = new ItemNodes();
    watcher: ApiWatcher;

    constructor(private path: string, private rootCloudId: string) {
        this.watcher = new ApiWatcher(path, {
            awaitWriteFinish: {stabilityThreshold: 2000, pollInterval: 100},
            persistent: true,
        });
        this.watchDirectory();
    };

    handleNodesEvents = () => {
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