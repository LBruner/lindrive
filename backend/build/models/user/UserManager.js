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
exports.UserManager = void 0;
const sequelize_1 = require("../../db/sequelize");
const googleAuth_1 = require("../googleDrive/googleAuth");
const UserData_1 = __importDefault(require("./UserData"));
const open_1 = __importDefault(require("open"));
const NodeTracker_1 = require("../watcher/NodeTracker");
const googleDriveAPI_1 = require("../googleDrive/googleDriveAPI");
const UserStorage_1 = require("./UserStorage");
class UserManager {
    constructor() {
        this.trackingPaths = [];
        this.addTrackingPath = (trackingPath) => {
            this.trackingPaths.push(trackingPath);
        };
        this.initUser = () => __awaiter(this, void 0, void 0, function* () {
            const userData = yield (0, sequelize_1.getSetUser)();
            if (!userData) {
                yield (0, open_1.default)('http://localhost:8080/auth/google');
            }
            else {
                const { access_token, refresh_token } = userData;
                const decryptedTokens = yield this.userStorage.decryptStoredTokens({ access_token, refresh_token });
                try {
                    yield googleAuth_1.oauth2Client.setCredentials({
                        access_token: decryptedTokens.access_token,
                        refresh_token: decryptedTokens.refresh_token
                    });
                }
                catch (e) {
                    yield (0, open_1.default)('http://localhost:8080/auth/google');
                    console.log('error', e);
                    return;
                }
                for (const path of this.trackingPaths) {
                    new NodeTracker_1.NodeTracker(path);
                }
            }
        });
        this.setUserCredentials = (authCode) => __awaiter(this, void 0, void 0, function* () {
            const { tokens } = yield googleAuth_1.oauth2Client.getToken(authCode);
            const encryptedTokens = yield this.userStorage.storeTokens(tokens);
            yield googleAuth_1.oauth2Client.setCredentials(tokens);
            const isUserSet = yield (0, sequelize_1.getSetUser)();
            if (!isUserSet) {
                const folderId = yield (0, googleDriveAPI_1.createDriveFolder)('Lindrive', null);
                yield UserData_1.default.create({
                    access_token: encryptedTokens.access_token,
                    refresh_token: encryptedTokens.refresh_token,
                    rootFolderName: 'Lindrive',
                    rootFolderId: folderId
                });
            }
            for (const path of this.trackingPaths) {
                console.log(path);
                new NodeTracker_1.NodeTracker(path);
            }
        });
        this.isAuthenticated = () => __awaiter(this, void 0, void 0, function* () {
            return yield UserData_1.default.findOne();
        });
        this.userStorage = new UserStorage_1.UserStorage();
        this.initUser();
    }
    static getInstance() {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }
}
exports.UserManager = UserManager;
