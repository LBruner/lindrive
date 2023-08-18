import {NodeTracker} from "../watcher/NodeTracker";

export class NodesManager {


    constructor(private trackingFolders: string[]) {

        this.initTracking();
    }

    initTracking = async () => {
        const {trackingFolders} = this;

        if (trackingFolders.length === 0) {
            console.log('No folders to track!')
        }

        console.log('tracking', trackingFolders);

        for (let folder of trackingFolders) {
            new NodeTracker(folder);
        }
    }
}