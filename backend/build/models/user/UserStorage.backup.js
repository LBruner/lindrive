"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStorage = void 0;
const ApiStorage_1 = require("../../storage/ApiStorage");
const PasswordEncryptor_1 = require("./password/PasswordEncryptor");
class UserStorage {
    constructor() {
        this.setupDefaultSettings = () => __awaiter(this, void 0, void 0, function* () {
        });
        this.decryptStoredTokens = (tokens) => __awaiter(this, void 0, void 0, function* () {
            const passwordEncryptor = this.passwordEncryptor;
            const secretData = yield this.getEncryptionSecrets();
            const accessToken = yield passwordEncryptor.decryptStoredToken(tokens.access_token, secretData);
            const refreshToken = yield passwordEncryptor.decryptStoredToken(tokens.refresh_token, secretData);
            return {
                access_token: accessToken,
                refresh_token: refreshToken
            };
        });
        this.storeEncryptedTokens = (tokens) => __awaiter(this, void 0, void 0, function* () {
            const passwordEncryptor = this.passwordEncryptor;
            const randomEncryptionDetails = passwordEncryptor.getRandomEncryption();
            console.log('fposaiofsai', randomEncryptionDetails);
            yield this.storeEncryptionSecrets(randomEncryptionDetails);
            const encryptedAccessToken = passwordEncryptor.encryptToken(tokens.access_token, randomEncryptionDetails);
            const encryptedRefreshToken = passwordEncryptor.encryptToken(tokens.refresh_token, randomEncryptionDetails);
            return {
                access_token: encryptedAccessToken,
                refresh_token: encryptedRefreshToken
            };
        });
        this.storeEncryptionSecrets = (encryptionData) => __awaiter(this, void 0, void 0, function* () {
            const { encryptionAlgorithm, encryptionIv, encryptionKey } = encryptionData;
            yield this.storage.setItem('encryptionAlgorithm', encryptionAlgorithm);
            yield this.storage.setItem('encryptionIv', encryptionIv);
            yield this.storage.setItem('encryptionKey', encryptionKey);
        });
        this.getEncryptionSecrets = () => __awaiter(this, void 0, void 0, function* () {
            const encryptionAlgorithm = yield this.storage.getItem('encryptionAlgorithm');
            const encryptionIv = yield this.storage.getItem('encryptionIv');
            const encryptionKey = yield this.storage.getItem('encryptionKey');
            return {
                encryptionAlgorithm,
                encryptionKey: encryptionKey,
                encryptionIv: encryptionIv
            };
        });
        this.storage = new ApiStorage_1.ApiStorage();
        this.passwordEncryptor = new PasswordEncryptor_1.PasswordEncryptor();
        this.setupDefaultSettings();
    }
    get getItem() {
        return this.storage.getItem;
    }
    get setItem() {
        return this.storage.setItem;
    }
}
exports.UserStorage = UserStorage;
new UserStorage();
