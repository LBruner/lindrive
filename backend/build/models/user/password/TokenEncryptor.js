"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenEncryptor = void 0;
const cryptr_1 = __importDefault(require("cryptr"));
class TokenEncryptor {
    constructor(secret) {
        this.secret = secret;
        this.encryptToken = (tokens) => {
            const { refresh_token, access_token } = tokens;
            const encryptedAccessToken = this.cryptr.encrypt(refresh_token);
            const encryptedRefreshToken = this.cryptr.encrypt(access_token);
            return {
                access_token: encryptedAccessToken,
                refresh_token: encryptedRefreshToken
            };
        };
        this.cryptr = new cryptr_1.default(secret);
    }
    decryptStoredToken(encryptedToken) {
        return;
    }
}
exports.TokenEncryptor = TokenEncryptor;
