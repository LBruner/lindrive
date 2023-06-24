import {IWatchable} from "../watcher/Watcher";

export abstract class ItemNode implements IWatchable {
    abstract register(): void

    abstract uploadToDrive(): Promise<string>

    abstract getItemDetails(): { name: string; parentFolderName: string; modifiedDate: string }

    abstract getRegisteredItem(): Promise<{ cloudID: string | undefined }>

    abstract isItemDirty(): Promise<boolean>

    abstract name: string;
    abstract cloudID: string | undefined;
    abstract itemPath: string
    abstract modifiedDate: string;
    abstract parentFolderPath: string;

    async processAddItem() {
        const isRegistered = await this.getRegisteredItem();

        if (!isRegistered) {
            this.cloudID = await this.uploadToDrive();
            await this.register();
        } else {
            this.cloudID = isRegistered.cloudID;
        }
    }


    syncToCloud(): void {
    }

}