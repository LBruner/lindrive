import Store from "electron-store";

export interface DataStore {
    store: Store<any>,
    setStore: (storeData: any) => void;
    clearStore: () => void;
}