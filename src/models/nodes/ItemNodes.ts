import {deleteCloudFile} from "../googleDrive/googleDriveAPI";
import {deleteNode, getItemCloudID} from "../../db/sequelize";

export interface INode {
    name: string;
    cloudID: string | null;
    path: string
    modifiedDateLocal: string;
    parentFolderPath: string;

    register(): void;

    uploadToDrive(): Promise<string>;

    getItemDetails(): { name: string; parentFolderPath: string; modifiedDateLocal: string };

    getRegisteredItem(): Promise<string | null>;

    isItemDirty(): Promise<boolean>;

    updateItem(): Promise<void>;
}

export class ItemNodes {
    private allNodes: INode[] = [];

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
        const deletingNode = await this.getNode(nodePath);
        let nodeId;

        if (deletingNode) {
            this.allNodes = this.allNodes.filter((node) => node.path !== nodePath);
        }

        if (nodeType == 'FOLDER') {
            nodeId = await getItemCloudID(nodePath, 'FOLDER');
            await deleteNode(nodePath, 'FOLDER');
        } else {
            nodeId = await getItemCloudID(nodePath, 'FILE');
            await deleteNode(nodePath, 'FILE');
        }

        if (!nodeId) {
            console.log("Can't find the node.")
            return;
        }

        await deleteCloudFile(nodeId);
        console.log(`The node was deleted: ${nodePath}`);

    };

    startNodeTracking = async (node: INode): Promise<void> => {
        const isRegistered = await node.getRegisteredItem();

        if (!isRegistered) {
            node.cloudID = await node.uploadToDrive();
            await node.register();
        } else {
            node.cloudID = isRegistered;

            if (await node.isItemDirty()) {
                console.log(`Item: ${node.name} is Dirty!`);
                await node.updateItem();
            }
        }
    }
}