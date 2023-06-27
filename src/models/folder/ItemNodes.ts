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

    constructor() {
    }

    async addSingleNode(node: INode) {
        this.allNodes.push(node);
        await this.processAddNode(node);
    }

    async addMultipleNodes(nodes: INode[]) {
        this.allNodes.push(...nodes);
        for (const node of nodes) {
            await this.processAddNode(node);
        }
        console.log('Finished processing initial nodes');
    }

    async getNode(nodePath: string) {
        return this.allNodes.find((node) => node.itemPath === nodePath);
    };

    async updateNode(nodePath: string) {
        const node = this.allNodes.find((node) => node.itemPath === nodePath);

        if (!node) return; //TODO: ADD DELETE NODE
        await node.updateItem();
        console.log(`Item: ${node.name} was updated`);
    }

    async deleteNode(nodePath: string, nodeType: 'FOLDER' | 'FILE') {
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
        console.log(nodeId[0].cloudID)
        await deleteCloudFile(nodeId[0].cloudID);

        console.log(`DELETE THE NODE: ${nodePath}`);

    };

    async processAddNode(node: INode) {
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