import {deleteCloudFile} from "../googleDrive/googleDriveAPI";
import {FileStore, FolderStore} from "../storage/stores";

export interface INode {
    name: string;
    cloudId: string | null;
    path: string
    modified: string;
    parentFolderPath: string;

    register(): void;

    uploadToDrive(): Promise<string | null>;

    getItemDetails(): { name: string; parentFolderPath: string; modifiedDateLocal: string };

    getRegisteredItemId(): Promise<string | undefined>;

    isItemDirty(): Promise<boolean>;

    updateItem(): Promise<void>;
}

export class ItemNodes {
    private allNodes: INode[] = [];

    constructor(private fileStore: FileStore, private folderStore: FolderStore) {
    }

    addNode = async (node: INode): Promise<void> => {
        this.allNodes.push(node);
        await this.startNodeTracking(node);
    }

    addMultipleNodes = async (nodes: INode[]) => {
        this.allNodes.push(...nodes);
        for (const node of nodes) {
            await this.startNodeTracking(node);
        }
        console.log('Finished processing initial nodes');
    }

    getNode = async (nodePath: string): Promise<INode | undefined> => {
        return this.allNodes.find((node) => node.path === nodePath);
    };

    updateNode = async (nodePath: string): Promise<void> => {
        const node = this.allNodes.find((node) => node.path === nodePath);

        if (!node) {
            console.log("Couldn't find node.");
            return;
        }

        await node.updateItem();
        console.log(`Item: ${node.name} was updated`);
    }

    deleteNode = async (nodePath: string, nodeType: 'FOLDER' | 'FILE'): Promise<void> => {
        let deletingNode;

        if (nodeType == 'FOLDER') {
            deletingNode =  this.folderStore.findOne(nodePath);
            await this.fileStore.deleteNestedFiles(nodePath);
            await this.folderStore.deleteOne(nodePath);
        }

        else if (nodeType === 'FILE') {
            deletingNode =  this.fileStore.findOne(nodePath);
            await this.fileStore.deleteOne(nodePath);
        }

        if (!deletingNode) {
            this.allNodes = this.allNodes.filter((node) => node.path !== nodePath);
        }

        await deleteCloudFile(deletingNode?.cloudId!);
        console.log(`The node was deleted: ${nodePath}`);
    };

    startNodeTracking = async (node: INode): Promise<void> => {
        const getRegisteredId = await node.getRegisteredItemId();

        console.log(`PATH: ${node.path} registered: ${getRegisteredId}`)

        if (!getRegisteredId) {
            node.cloudId = await node.uploadToDrive();
            node.register();
        }
        else {
            node.cloudId = getRegisteredId;

            if (await node.isItemDirty()) {
                console.log(`Item: ${node.name} is Dirty!`);
                await node.updateItem();
            }
        }
    }
}