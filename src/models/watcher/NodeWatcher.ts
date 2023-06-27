import {Watcher} from "./Watcher";
import {ItemNodes} from "../folder/ItemNodes";
import {FileNode} from "../files/FileNode";
import {FolderNode} from "../folder/FolderNode";
import query from "../../services/mysql";

export class NodeWatcher {
    itemNodes: ItemNodes = new ItemNodes()
    watcher: Watcher;

    constructor(private path: string, private rootCloudId: string) {
        this.watcher = new Watcher(path);
        this.watchDirectory()
    };

    async handleInitialNodes() {
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

        await deleteErasedNotes()
    }

    async handleNewNodes() {
        this.watcher.on('add', (eventName: string) => {
            const fileNode = new FileNode(eventName);
            this.itemNodes.addSingleNode(fileNode);
        })

        this.watcher.on('addDir', (eventName: string) => {
            const folderNode = new FolderNode(eventName, this.rootCloudId);
            console.log(folderNode)
            this.itemNodes.addSingleNode(folderNode);
        })
    }

    async handleNodesUpdate() {
        this.watcher.on('change', async (eventName: string) => {
            await this.itemNodes.updateNode(eventName);
        })
    };

    async handleNodesDelete() {
        this.watcher.on('unlink', async (eventName: string) => {
            console.log(eventName);
            await this.itemNodes.deleteNode(eventName, 'FILE');
        })

        this.watcher.on('unlinkDir', async (eventName: string) => {
            await this.itemNodes.deleteNode(eventName, 'FOLDER');
        })
    };

    async watchDirectory() {
        await this.handleInitialNodes();
        await this.handleNewNodes();
        await this.handleNodesUpdate();
        await this.handleNodesDelete();
    }
}