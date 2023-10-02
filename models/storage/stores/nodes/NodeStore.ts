import Store from 'electron-store';
import {EventEmitter} from "events";
import {File, Folder, INode} from "./types";
import {DataStore} from "../DataStore";
import {deleteCloudFile} from "../../../googleDrive/googleDriveAPI";
import {NodeLogger} from "../../../nodes/NodeLogger";

interface INodeStore {
    files: File[];
    folders: Folder[];
}

export abstract class NodeStore<T extends INode> implements DataStore {
    store: Store<INodeStore>;
    storeEmitter: EventEmitter;
    nodeLogger: NodeLogger;
    allNodesStored: INode[];

    protected constructor(protected nodeType: keyof INodeStore) {
        this.allNodesStored = [];
        this.store = new Store<INodeStore>({
            defaults: {
                files: [],
                folders: [],
            }
        })
        this.storeEmitter = new EventEmitter();
        this.setEvents();
        this.refreshStore();
        this.nodeLogger = new NodeLogger();
    }

    setStore(node: INode[]): void {
        this.store.set(this.nodeType, node);
        this.storeEmitter.emit('dataChanged');
    }

    clearStore = () => {
        console.log(`Store was cleared!`)
        this.store.clear();
    }

    refreshStore = () => {
        console.log("Updated " + this.nodeType)
        this.allNodesStored = this.store.get(this.nodeType);
    }

    setEvents = () => {
        this.storeEmitter.on('dataChanged', this.refreshStore);
    }


    getNode = (folderPath: string) => {
        return this.allNodesStored.find(folder => folder.path === folderPath);
    };

    getModifiedDate = (path: string): string | null => {
        const node = this.getNode(path);

        if (!node) {
            return null;
        }

        return node.modified;
    }

    findOne(path: string): T | undefined {
        const storedNode = this.store.get(this.nodeType);

        if (!storedNode) {
            console.log(`No ${this.nodeType} are stored!`);
            return undefined;
        }

        const foundItem = storedNode.find((item: INode) => item.path === path);

        if (!foundItem) {
            return undefined
        }

        if (this.nodeType === 'files') {
            return foundItem as T;
        } else if (this.nodeType === 'folders') {
            return foundItem as T;
        }
    };

    getAllNodesPath = (startingPath: string): string[] => {
        const filteredPaths = this.allNodesStored.filter((node) => node.path.startsWith(startingPath))
        return filteredPaths.map(node => node.path);
    }

    getCloudId = (path: string): string | undefined => {
        const node = this.findOne(path);

        if (!node) {
            return undefined;
        }
        return node.cloudId!;
    }

    updateOne(newNode: INode): void {
        const {allNodesStored} = this;

        const nodeToChange = allNodesStored.findIndex(node => node.path === newNode.path);

        allNodesStored[nodeToChange] = newNode;

        this.setStore(allNodesStored);

        if (this.nodeType === "files") {
            this.nodeLogger.createLog({
                name: newNode.name,
                path: newNode.path,
                operation: 'UPDATE',
                date: new Date().toISOString().slice(0, 19)
            });
        }
        console.log(`Folder: ${newNode.path} changed!`);
    }
}