import {NodeStore} from "./NodeStore";
import {File} from "./types";

class FileStore extends NodeStore<File> {
    allNodesStored: File[] = [];

    constructor() {
        super("files");
        this.refreshStore();
    }

    deleteNestedFiles = async (path: string) =>{
        const toDeleteFiles = this.allNodesStored.filter(file => file.path.startsWith(path));

        toDeleteFiles.forEach(file =>{
            this.deleteOne(file.path);
        })
    }
}

export default FileStore;