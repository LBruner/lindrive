import {NodeStore} from "./NodeStore";
import {Folder} from "./types";

class FolderStore extends NodeStore<Folder> {
    allNodesStored: Folder[] = [];

    constructor() {
        super("folders");
        this.refreshStore();
    }

    getFolder = (folderPath: string) => {
        return this.allNodesStored.find(folder => folder.path === folderPath);
    };

    getParentFolder = (childPath: string): Folder | undefined => {
        return this.allNodesStored.find(node => node.path === childPath);
    }


    getFolderCloudId = (folderPath: string): string | undefined => {
        const node = this.getFolder(folderPath);

        if (!node) {
            return undefined;
        }
        return node.cloudId!;
    }

    getModifiedDate = (folderPath: string): string | null => {
        const node = this.getFolder(folderPath);

        if (!node) {
            return null;
        }

        return node.modifiedLocal;
    }
}

export default FolderStore