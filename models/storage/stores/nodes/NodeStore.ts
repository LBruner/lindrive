import Store from 'electron-store';
import {EventEmitter} from "events";
import {File, Folder, INode} from "./types";
import {DataStore} from "../DataStore";
import {deleteCloudFile} from "../../../googleDrive/googleDriveAPI";

interface INodeStore {
    files: File[];
    folders: Folder[];
}

export abstract class NodeStore<T extends INode> implements DataStore {
    store: Store<INodeStore>;
    storeEmitter: EventEmitter;

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

    createOne(file: INode): void {
        const storedFiles = this.allNodesStored;

        const fileExists = this.findOne(file.path);

        if (fileExists) {
            console.log(`File ${file.path} already exists!`);
            return;
        }

        storedFiles.push(file);
        this.setStore(storedFiles);
        console.log(`Created new File: ${file.path}`)
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

    getAllNodesPath = (): string[] => {
        return this.allNodesStored.map(node => node.path);
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

        console.log(`Folder: ${newNode.path} changed!`);
    }

    deleteOne = async (deletingNodePath: string): Promise<void> => {
        const {allNodesStored} = this;

        const filteredFolders = allNodesStored.filter(node => !node.path.startsWith(deletingNodePath + '/') && node.path !== deletingNodePath);

        this.setStore(filteredFolders);

        const deletingNode = this.findOne(deletingNodePath);
        console.log("DELETING:", deletingNodePath)
        console.log("DELETING:", deletingNode)

        if (deletingNode) {
            console.log(deletingNode)
            await deleteCloudFile(deletingNode.cloudId!);
        }

        console.log(`Folder: ${deletingNodePath} was deleted!`);
    }
}