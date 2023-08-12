import {NodeStore, RootFolder} from "../storage/stores";
import Folder from "../folder/Folder";
import {IFolder} from "./stores/NodeStore";
import {INode} from "../nodes/ItemNodes";

export class NodeStorage {
    nodeStore: NodeStore

    constructor() {
        this.setupDefaultSettings();
        this.nodeStore = new NodeStore();
    }

    setupDefaultSettings = async () => {
        //TODO: add storage default settings
    }


    getTrackingFolders = async (): Promise<IFolder[]> => {
        return await this.nodeStore.getAllFolders();
    }

}

new NodeStorage()
