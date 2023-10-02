import {NodeStore} from "./NodeStore";
import {File} from "./types";
import {deleteCloudFile} from "../../../googleDrive/googleDriveAPI";

class FileStore extends NodeStore<File> {
    allNodesStored: File[] = [];

    constructor() {
        super("files");
        this.refreshStore();
    }

    createOne(file: File): void {
        const storedFiles = this.allNodesStored;

        const fileExists = this.findOne(file.path);

        if (fileExists) {
            console.log(`File ${file.path} already exists!`);
            return;
        }

        storedFiles.push(file);
        this.setStore(storedFiles);

        this.nodeLogger.createLog({
            name: file.name,
            path: file.path,
            operation: 'ADD',
            date: new Date().toISOString().slice(0, 19)
        });

        console.log(`Created new File: ${file.path}`);
    }

    deleteOne = async (deletingNodePath: string): Promise<void> => {
        const {allNodesStored} = this;

        //TODO Refactor this:
        const filteredFolders = allNodesStored.filter(node => {
            return !node.path.startsWith(deletingNodePath + '/') && node.path !== deletingNodePath
        });

        const deletingFolder = allNodesStored.find(node => !node.path.startsWith(deletingNodePath + '/') && node.path === deletingNodePath)

        this.nodeLogger.createLog({
            name: deletingFolder!.name,
            path: deletingFolder!.path,
            operation: 'DELETE',
            date: new Date().toISOString().slice(0, 19)
        })

        this.setStore(filteredFolders);

        const deletingNode = this.findOne(deletingNodePath);

        if (deletingNode) {
            console.log(deletingNode)
            await deleteCloudFile(deletingNode.cloudId!);
        }

        console.log(`File: ${deletingNodePath} was deleted!`);
    }


    deleteNestedFiles = async (path: string) => {
        const toDeleteFiles = this.allNodesStored.filter(file => file.path.startsWith(path));

        toDeleteFiles.forEach(file => {
            this.deleteOne(file.path);
        })
    }
}

export default FileStore;