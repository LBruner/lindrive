import Store from 'electron-store';

interface StorageItems {
    access_token: string,
    refresh_token: string
}

export class StorageAPI {
    store: Store<StorageItems>;

    constructor() {
        this.store = new Store<StorageItems>({
            // TODO: select secret through app
            encryptionKey: process.env.USERNAME,
            schema: {
                access_token: {
                    type: 'string'
                },
                refresh_token: {
                    type: 'string',
                }
            }
        });

        console.log(this.store.path)
    }

    getItem = async (itemKey: keyof StorageItems): Promise<string | undefined> => {
        return this.store.get(itemKey);
    }

    setItem = (itemKey: keyof StorageItems, value: string): void => {
        this.store.set(itemKey, value);
    }

    clearStorage = () =>{
        this.store.clear()
    }
}