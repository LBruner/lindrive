import {UserTokens} from "./UserTokens";
import {RootFolder, NodeStore} from "../storage/stores";

export class UserStorage {
    userStorage: NodeStore;

    constructor() {
        this.setupDefaultSettings();
        this.userStorage = new NodeStore();
    }

    setupDefaultSettings = async () => {
        //TODO: add storage default settings
    }


}

new UserStorage()
