import storage from "node-persist";
import path from "path";

const userSettingsPath = path.resolve(__dirname, '..', '..', 'settings');

export class ApiStorage {
    constructor() {
        this.initStorage();
    }

    initStorage = async () => {
        await storage.init({
            dir: userSettingsPath,
        });
    }

    getItem = async (itemKey: string): Promise<any | undefined> => {
        return await storage.getItem(itemKey);
    }

    setItem = async (itemKey: string, data: any): Promise<any | undefined> => {
        storage.setItem(itemKey, data)
    }
}