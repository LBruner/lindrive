"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordEncryptor = void 0;
const cryptr_1 = __importDefault(require("cryptr"));
class PasswordEncryptor {
    constructor(secret) {
        this.secret = secret;
        this.encryptToken = (token) => {
            return this.cryptr.encrypt(token);
        };
        this.cryptr = new cryptr_1.default(secret);
    }
    decryptStoredToken(encryptedToken) {
        console.log('THIS', this.secret);
        console.log(encryptedToken);
        return this.cryptr.decrypt(encryptedToken);
    }
}
exports.PasswordEncryptor = PasswordEncryptor;
