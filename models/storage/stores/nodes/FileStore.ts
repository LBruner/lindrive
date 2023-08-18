import {NodeStore} from "./NodeStore";
import {File} from "./types";

class FileStore extends NodeStore<File> {
    allNodesStored: File[] = [];

    constructor() {
        super("files");
        this.refreshStore();
    }
}

export default FileStore;