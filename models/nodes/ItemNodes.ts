import {deleteCloudFile} from "../googleDrive/googleDriveAPI";
import {deleteNode, getItemCloudID} from "../../db/sequelize";
import {Logger} from "sequelize/types/utils/logger";
import {NodeStore} from "../storage/stores";

export interface INode {
    name: string;
    cloudId: string | null;
    path: string
    modifiedLocal: string;
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

    addNode = async (node: INode): Promise<void> => {
        this.allNodes.push(node);
        await this.startNodeTracking(node);
    }

    addMultipleNodes = async (nodes: INode[]) => {
        console.log("ALL NODES",)
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

        if (!deletingNode) {
            console.log(`Can't find the node ${nodePath}`);
            return;
        }

        if (deletingNode) {
            this.allNodes = this.allNodes.filter((node) => node.path !== nodePath);
        }

        if (nodeType == 'FOLDER') {
            //TODO CREATE SINGLETON CLASS
            const nodeStore = new NodeStore();

            const nodeFolder = await nodeStore.getFolder(nodePath);
            await nodeStore.deleteFolder(nodeFolder?.path!);
        }
        // else {
        //     nodeId = await getItemCloudID(nodePath, 'FILE');
        //     await deleteNode(nodePath, 'FILE');
        // }

        await deleteCloudFile(deletingNode?.cloudId!);
        console.log(`The node was deleted: ${nodePath}`);
    };

    startNodeTracking = async (node: INode): Promise<void> => {
        const getRegisteredId = await node.getRegisteredItemId();

        console.log(`PATH: ${node.path} registered: ${getRegisteredId}`)

        if (!getRegisteredId) {
            node.cloudId = await node.uploadToDrive();
            await node.register();
        } else {
            node.cloudId = getRegisteredId;

            if (await node.isItemDirty()) {
                console.log(`Item: ${node.name} is Dirty!`);
                await node.updateItem();
            }
        }
    }
}