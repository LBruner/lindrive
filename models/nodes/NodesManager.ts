import {NodeTracker} from "../watcher/NodeTracker";
import {UserStore} from "../storage/stores";
import path from "path";

export class NodesManager {
    private trackingFolders: NodeTracker[] = [];

    constructor(private userStore: UserStore) {
    }

    getTrackingFolders = () => {
        const folders = this.trackingFolders.map((folder) => {
            return {
                name: path.basename(folder.path),
                path: folder.path,
            }
        })
        return folders;
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

        if(nodeExistsAlready){
            console.log(`Path: ${trackingFolderPath} is already registered.`);
            return;
        }

        const newNodeTracker = new NodeTracker(trackingFolderPath);
        this.trackingFolders.push(newNodeTracker);
        this.userStore.addTrackingFolder(trackingFolderPath);
        await newNodeTracker.handleInitialNodes();
    }
}