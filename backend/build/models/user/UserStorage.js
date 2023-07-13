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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStorage = void 0;
const ApiStorage_1 = require("../../storage/ApiStorage");
const crypto_1 = __importDefault(require("crypto"));
const cryptr_1 = __importDefault(require("cryptr"));
class UserStorage {
    constructor() {
        this.setupDefaultSettings = () => __awaiter(this, void 0, void 0, function* () {
            //TODO: add storage default settings
        });
        this.decryptStoredTokens = (tokens) => __awaiter(this, void 0, void 0, function* () {
            //TODO Maybe put this on db.
            const secret = yield this.storage.getItem('encryptionSecret');
            if (!secret) {
                throw new Error(`Token secret not available.`);
            }
            const cryptr = new cryptr_1.default(secret);
            return {
                access_token: cryptr.decrypt(tokens.access_token),
                refresh_token: cryptr.decrypt(tokens.refresh_token),
            };
        });
        this.generateEncryptionSecrets = () => {
            return crypto_1.default.randomBytes(16).toString();
        };
        this.storeTokens = (tokens) => __awaiter(this, void 0, void 0, function* () {
            const encryptionSecret = this.generateEncryptionSecrets();
            const cryptr = new cryptr_1.default(encryptionSecret);
            yield this.storeEncryptionSecret(encryptionSecret);
            return {
                access_token: cryptr.encrypt(tokens.access_token),
                refresh_token: cryptr.encrypt(tokens.refresh_token)
            };
        });
        this.storeEncryptionSecret = (encryptionSecret) => __awaiter(this, void 0, void 0, function* () {
            yield this.storage.setItem('encryptionSecret', encryptionSecret);
        });
        this.storage = new ApiStorage_1.ApiStorage();
        this.setupDefaultSettings();
    }
}
exports.UserStorage = UserStorage;
new UserStorage();
