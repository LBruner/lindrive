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

export class ItemsNode {
    nodes: INode[] = [];

    constructor() {
    }

    async addSingleNode(node: INode) {
        this.nodes.push(node);
        await this.processAddNode(node);
    }

    async addMultipleNodes(nodes: INode[]) {
        this.nodes.push(...nodes);

        const initialNodes = nodes;
        for (const node of nodes) {
            await this.processAddNode(node);
        }
        ;
        console.log('Finished processing initial nodes');
    }

    async updateNode(nodePath: string) {
        const node = this.nodes.find((node) => node.itemPath === nodePath);

        if (!node) return; //TODO: ADD DELETE NODE
        await node.updateItem();
        console.log(`Item: ${node.name} was updated`);
    }

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