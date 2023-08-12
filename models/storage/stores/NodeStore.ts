import Store from "electron-store";
import Folder from "../../folder/Folder";

interface File {
    name: string,
    cloudId: string | null,
    path: string,
    parentFolderName: string,
    modifiedLocal: string,
    modifiedCloud: string,
    size: number,
    extension: string,
}

export interface IFolder {
    name: string,
    cloudId: string | null,
    path: string,
    modifiedLocal: string,
    parentFolderPath: string,
}

export interface INodeStore {
    trackingFolders: IFolder[],
    trackingFiles: File[],
}

export class NodeStore {
    store: Store<INodeStore>

    constructor() {
        this.store = new Store<INodeStore>({
            defaults: {
                trackingFolders: [],
                trackingFiles: [],
            }
        });
    }

    clearStorage = async () => {
        await this.store.clear();
    }

    getAllFolders = async (): Promise<IFolder[]> => {
        return await this.store.get('trackingFolders');
    }

    getAllFoldersPath = async () =>{
        const allFolders = await this.store.get('trackingFolders');

        const allFoldersPath: string[] = []

        allFolders.forEach(folder => allFoldersPath.push(folder.path));

        return allFoldersPath;
    }

    getAllFiles = async (): Promise<File[] | []> => {
        return await this.store.get('trackingFiles');
    }

    getAllItems = async (itemName: string, itemKey: keyof INodeStore): Promise<File[] | IFolder[]> => {
        return this.store.get(itemName);
    };

    //CONTINUA ADICIONANDO O PRIMEIRO ITEM ARMAZENADO

    setTrackingFolders = async (newTrackingFolder: IFolder[]) => {
        this.store.set('trackingFolders', newTrackingFolder)
    }

    createFolder = async (newFolder: IFolder) => {
        const allFolders = await this.getAllFolders();

        if (allFolders.includes(newFolder)) {
            throw new Error("Item already created!");
        }

        allFolders.push(newFolder);

        this.setTrackingFolders(allFolders);
    }

    updateFolder = async (updatingFolder: IFolder) => {
        const allFolders = await this.getAllFolders()

        const selectedFolderIndex = allFolders.findIndex((item) => item.path === updatingFolder.path);

        if (selectedFolderIndex < 0) throw new Error(`Could not find folder: ${updatingFolder.path}.`);


        allFolders[selectedFolderIndex] = updatingFolder;

        await this.setTrackingFolders(allFolders);
    }


    getFolder = async (folderPath: string): Promise<IFolder | undefined> => {
        const storedFolders = await this.getAllFolders();

        if (storedFolders.length === 0) return undefined;

        const folder = storedFolders.find((item: IFolder) => item.path === folderPath);
        return folder;
    }

    deleteFolder = async (folderPath: string) => {
        const allNodes = await this.store.get('trackingFolders');
        console.log('folderPAth:',folderPath)

        const filteredNodes = allNodes.filter((folder) => folder.path !== folderPath);

        await this.setTrackingFolders(filteredNodes);
    }

    getFolderCloudId = async (folderPath: string): Promise<string | undefined> => {
        const folder = await this.getFolder(folderPath);

        return folder?.cloudId!
    }

    getParentFolder = async (parentFolderName: string): Promise<IFolder | undefined> => {
        const storedFolders = await this.getAllFolders();

        const foundFolder = storedFolders.find(folder => folder.path === parentFolderName);
        return foundFolder
    }

    getModifiedDate = async (folderPath: string) => {
        const allFolders = await this.getAllFolders();

        console.log("ALLFOLDERS", allFolders)
        console.log("FOLDERPATH", folderPath)
        const foundFolder = allFolders.find(folder => folder.path === folderPath);
        console.log("FOULDFOLDER", foundFolder)
        return foundFolder!.modifiedLocal;
    }
}