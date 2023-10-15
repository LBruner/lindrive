import {NodeTracker} from "../watcher/NodeTracker";
import {UserStore} from "../storage/stores";
import path from "path";
import {EventEmitter} from "events";

export class NodesManager {
    private trackingFolders: NodeTracker[] = [];
    nodeEmitter: EventEmitter = new EventEmitter();

    constructor(private userStore: UserStore) {
    }

    getTrackingFolders = () => {
        return this.trackingFolders.map((folder) => {
            return {
                name: path.basename(folder.path),
                path: folder.path,
            }
        });
    }

    deleteTrackingFolder = async (folderPath: string) => {
        const foundTrackingFolderIndex = this.trackingFolders.findIndex(item => item.path === folderPath);

        if (foundTrackingFolderIndex === -1) {
            throw new Error(`Tracking folder with path: ${folderPath} not found!`);
        }

        await this.trackingFolders[foundTrackingFolderIndex].unWatchDirectory();
        this.userStore.deleteTrackingFolder(folderPath);
        this.trackingFolders.splice(foundTrackingFolderIndex, 1);
    }

    setStoredTrackingFolders = (trackingFolderPaths: string[]) => {
        trackingFolderPaths.forEach((folderPath) => this.addTrackingFolder(folderPath));
    }

    addTrackingFolder = async (trackingFolderPath: string) => {
        const nodeExistsAlready = this.trackingFolders.some(node => node.path === trackingFolderPath);

        if (nodeExistsAlready) {
            console.log(`Path: ${trackingFolderPath} is already registered.`);
            return;
        }

        const trackHiddenNodes = this.userStore.getTrackingHiddenNode();
        const newNodeTracker = new NodeTracker(trackingFolderPath, trackHiddenNodes);
        this.trackingFolders.push(newNodeTracker);
        this.userStore.addTrackingFolder(trackingFolderPath);
        await newNodeTracker.handleInitialNodes();
    }

    deleteAllNodes = () => {
        this.trackingFolders.forEach((tracker => tracker.watcher.removeAllEvents()));
        this.trackingFolders = [];
    }

    getNodesEmitter = (): EventEmitter => {
        return this.nodeEmitter;
    }
}