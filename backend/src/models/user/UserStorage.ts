import {ApiStorage} from "../../storage/ApiStorage";
import crypto from 'crypto';
import {UserTokens} from "./UserTokens";
import Cryptr from "cryptr";

export class UserStorage {
    storage: ApiStorage;

    constructor() {
        this.storage = new ApiStorage();
        this.setupDefaultSettings()
    }

    setupDefaultSettings = async () => {
        //TODO: add storage default settings
    }

    decryptStoredTokens = async (tokens: UserTokens): Promise<UserTokens> => {
        //TODO Maybe put this on db.
        const secret = await this.storage.getItem('encryptionSecret');

        if (!secret) {
            throw new Error(`Token secret not available.`)
        }

        const cryptr = new Cryptr(secret);

        return {
            access_token: cryptr.decrypt(tokens.access_token),
            refresh_token: cryptr.decrypt(tokens.refresh_token),
        }
    }

    generateEncryptionSecrets = (): string => {
        return crypto.randomBytes(16).toString();
    };


    storeTokens = async (tokens: UserTokens): Promise<UserTokens> => {
        const encryptionSecret = this.generateEncryptionSecrets();

        const cryptr = new Cryptr(encryptionSecret);

        await this.storeEncryptionSecret(encryptionSecret);

        return {
            access_token: cryptr.encrypt(tokens.access_token),
            refresh_token: cryptr.encrypt(tokens.refresh_token)
        };
    }

    private storeEncryptionSecret = async (encryptionSecret: string) => {
        await this.storage.setItem('encryptionSecret', encryptionSecret);
    }
}

new UserStorage()
