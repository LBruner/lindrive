import {INode} from "../nodes/ItemNodes";
import chokidar, {WatchOptions} from "chokidar";
import {FolderNode} from "../folder/FolderNode";
import {FileNode} from "../files/FileNode";
import {FileStore, FolderStore} from "../storage/stores";

export class OfflineTracker {
    private readonly watcher: chokidar.FSWatcher;

    constructor(public path: string, private folderStore: FolderStore, private fileStore: FileStore, private trackHiddenNode: boolean) {
        this.watcher = chokidar.watch(path, {
            ignoreInitial: true,
            awaitWriteFinish: {stabilityThreshold: 2000, pollInterval: 100}
        });
    }

    async getInitialNodes(): Promise<INode[]> {
        let descendingNodes: INode[];

        descendingNodes = await this.getInitialFolders();
        descendingNodes.push(...await this.getInitialFiles());

        return descendingNodes;
    }

    async getInitialFolders() {
        const configWatch: WatchOptions = {};

        if(!this.trackHiddenNode){
            configWatch.ignored =  /(^|\/)\.[^\/.]/g
        }

        const temporaryWatcher = chokidar.watch(this.path, configWatch);
        const initialNodes: INode[] = [];

        const promise: Promise<INode[]> = new Promise((resolve) => {
            temporaryWatcher.on('addDir', async (eventName: string) => {
                const folderNode = new FolderNode(eventName, this.folderStore);
                initialNodes.push(folderNode);
            }).on('ready', async () => {
                resolve(initialNodes);
            })
        })
        return await promise;
    }

    async getInitialFiles() {
        const configWatch: WatchOptions = {};

        if(!this.trackHiddenNode){
            configWatch.ignored =  /(^|\/)\.[^\/.]/g
        }

        const temporaryWatcher = chokidar.watch(this.path, configWatch);
        const initialNodes: INode[] = [];

        const promise: Promise<INode[]> = new Promise((resolve) => {
            temporaryWatcher.on('add', (eventName: string) => {
                const fileNode = new FileNode(eventName,this.fileStore,this.folderStore);
                initialNodes.push(fileNode);
            }).on('ready', async () => {
                resolve(initialNodes)
            })
        })

        return await promise;
    }
}