import {NodeStore} from "./NodeStore";
import {Folder} from "./types";

class FolderStore extends NodeStore<Folder> {
    allNodesStored: Folder[] = [];

    constructor() {
        super("folders");
        this.refreshStore();
    }

    getParentFolder = (childPath: string): Folder | undefined => {
        return this.allNodesStored.find(node => node.path === childPath);
    }
}

export default FolderStore