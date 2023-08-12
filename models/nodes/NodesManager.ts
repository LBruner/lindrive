import {NodeTracker} from "../watcher/NodeTracker";
import {UserStore} from "../storage/stores";

export class NodesManager {
    userStore: UserStore

    constructor() {
        this.userStore = new UserStore();
        this.initTracking();
    }

    initTracking = async () => {
        const trackingFolders = await this.userStore.getTrackingFolders();

        if (trackingFolders.length === 0) {
            console.log('No folders to track!')
        }

        console.log('tracking', trackingFolders)
        for (let folder of trackingFolders) {
            new NodeTracker(folder)
        }
    }
}