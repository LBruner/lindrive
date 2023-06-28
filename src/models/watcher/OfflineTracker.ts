import {INode} from "../nodes/ItemNodes";
import chokidar from "chokidar";
import {FolderNode} from "../folder/FolderNode";
import {FileNode} from "../files/FileNode";

export class OfflineTracker{
    private readonly watcher: chokidar.FSWatcher;

    constructor(public path: string) {
        this.watcher = chokidar.watch(path, {
            ignoreInitial: true,
            awaitWriteFinish: {stabilityThreshold: 2000, pollInterval: 100}
        });
    }
    async getInitialNodes(rootCloudID: string): Promise<INode[]> {
        let descendingNodes: INode[];

        descendingNodes = await this.getInitialFolders(rootCloudID);
        descendingNodes.push(...await this.getInitialFiles());

        return descendingNodes;
    }

    async getInitialFolders(rootCloudID: string) {
        const temporaryWatcher = chokidar.watch(this.path);
        const initialNodes: INode[] = [];

        const promise: Promise<INode[]> = new Promise((resolve) => {
            temporaryWatcher.on('addDir', (eventName: string) => {
                const folderNode = new FolderNode(eventName, rootCloudID);
                initialNodes.push(folderNode);
            }).on('ready', async () => {
                resolve(initialNodes);
            })
        })
        return await promise;
    }

    async getInitialFiles() {
        const temporaryWatcher = chokidar.watch(this.path);
        const initialNodes: INode[] = [];

        const promise: Promise<INode[]> = new Promise((resolve) => {
            temporaryWatcher.on('add', (eventName: string) => {
                const fileNode = new FileNode(eventName);
                initialNodes.push(fileNode);
            }).on('ready', async () => {
                resolve(initialNodes)
            })
        })

        return await promise;
    }
}