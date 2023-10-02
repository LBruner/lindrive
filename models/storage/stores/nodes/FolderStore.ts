import {NodeStore} from "./NodeStore";
import {Folder} from "./types";
import {deleteCloudFile} from "../../../googleDrive/googleDriveAPI";

class FolderStore extends NodeStore<Folder> {
    allNodesStored: Folder[] = [];

    constructor() {
        super("folders");
        this.refreshStore();
    }

    createOne(folder: Folder): void {
        const storedFolders = this.allNodesStored;

        const fileExists = this.findOne(folder.path);

        if (fileExists) {
            console.log(`File ${folder.path} already exists!`);
            return;
        }


        storedFolders.push(folder);
        this.setStore(storedFolders);

        console.log(`Created new Folder: ${folder.path}`);
    }

    deleteOne = async (deletingNodePath: string): Promise<void> => {
        const {allNodesStored} = this;

        //TODO Refactor this:
        const filteredFolders = allNodesStored.filter(node => {
            return !node.path.startsWith(deletingNodePath + '/') && node.path !== deletingNodePath
        });

        this.setStore(filteredFolders);

        const deletingNode = this.findOne(deletingNodePath);

        if (deletingNode) {
            console.log(deletingNode)
            await deleteCloudFile(deletingNode.cloudId!);
        }

        console.log(`Folder: ${deletingNodePath} was deleted!`);
    }

    getParentFolder = (childPath: string): Folder | undefined => {
        return this.allNodesStored.find(node => node.path === childPath);
    }
}

export default FolderStore