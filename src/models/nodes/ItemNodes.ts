import query from "../../services/mysql";
import {deleteCloudFile} from "../googleDrive/googleDriveAPI";

export interface INode {
    name: string;
    cloudID: string | undefined;
    itemPath: string
    modifiedDate: string;
    parentFolderPath: string;

    register(): void;

    uploadToDrive(): Promise<string>;

    getItemDetails(): { name: string; parentFolderName: string; modifiedDate: string };

    getRegisteredItem(): Promise<{ cloudID: string | undefined }>;

    isItemDirty(): Promise<boolean>;

    updateItem(): Promise<void>;
}

export class ItemNodes {
    private allNodes: INode[] = [];

    addNode = async (node: INode): Promise<void> => {
        this.allNodes.push(node);
        await this.processAddNode(node);
    }

    addMultipleNodes = async (nodes: INode[]) =>{
        this.allNodes.push(...nodes);
        for (const node of nodes) {
            await this.processAddNode(node);
        }
        console.log('Finished processing initial nodes');
    }

    getNode = async (nodePath: string): Promise<INode | undefined> => {
        return this.allNodes.find((node) => node.itemPath === nodePath);
    };

    updateNode = async (nodePath: string): Promise<void> => {
        const node = this.allNodes.find((node) => node.itemPath === nodePath);

        if (!node) {
            console.log("Couldn't find node.");
            return;
        }

        await node.updateItem();
        console.log(`Item: ${node.name} was updated`);
    }

    deleteNode = async (nodePath: string, nodeType: 'FOLDER' | 'FILE'): Promise<void> => {
        const deleteNode = await this.getNode(nodePath);
        let nodeId;

        if (deleteNode) {
            this.allNodes = this.allNodes.filter((node) => node.itemPath !== nodePath);
        }

        if (nodeType == 'FOLDER') {
            nodeId = await query(`SELECT cloudID
                                  from folders
                                  WHERE path = "${nodePath}"`)
            await query(`DELETE
                         FROM files
                         WHERE parentFolderPath = "${nodePath}"`);
            await query(`DELETE
                         FROM folders
                         WHERE path = "${nodePath}"`);
        } else {
            nodeId = await query(`SELECT cloudID
                                  FROM files
                                  WHERE path = "${nodePath}"`);
            await query(`DELETE
                         FROM files
                         WHERE path = "${nodePath}"`);
        }

        if (nodeId.length === 0) {
            console.log("Can't find the node.")
            return;
        }

        await deleteCloudFile(nodeId[0].cloudID);

        console.log(`The node was deleted: ${nodePath}`);

    };

    processAddNode = async (node: INode): Promise<void> => {
        const isRegistered = await node.getRegisteredItem();

        if (!isRegistered) {
            node.cloudID = await node.uploadToDrive();
            node.register();
        } else {
            node.cloudID = isRegistered.cloudID;

            if (await node.isItemDirty()) {
                console.log(`Item: ${node.name} is Dirty!`);
                await node.updateItem();
            }
        }
    }
}