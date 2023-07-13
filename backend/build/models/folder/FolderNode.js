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
exports.FolderNode = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const googleDriveAPI_1 = require("../googleDrive/googleDriveAPI");
const Folder_1 = __importDefault(require("./Folder"));
const sequelize_1 = require("../../db/sequelize");
const UserData_1 = __importDefault(require("../user/UserData"));
class FolderNode {
    constructor(path) {
        this.path = path;
        const { name, parentFolderPath, modifiedDateLocal } = this.getItemDetails();
        this.name = name;
        this.parentFolderPath = parentFolderPath;
        this.modifiedDateLocal = modifiedDateLocal;
        this.cloudID = null;
    }
    uploadToDrive() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.parentFolderPath);
            const dbResponse = yield Folder_1.default.findOne({ where: { path: this.parentFolderPath }, attributes: ['cloudID'] });
            const cloudID = dbResponse === null || dbResponse === void 0 ? void 0 : dbResponse.dataValues.cloudID;
            if (!cloudID) {
                const rootFolder = yield UserData_1.default.findOne();
                if (!rootFolder) {
                    throw new Error('Root user was not created!');
                }
                return yield (0, googleDriveAPI_1.createDriveFolder)(this.name, rootFolder.dataValues.rootFolderId);
            }
            else {
                console.log(cloudID);
                return yield (0, googleDriveAPI_1.createDriveFolder)(this.name, cloudID);
            }
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, path, cloudID, modifiedDateLocal, parentFolderPath } = this;
            if (!cloudID) {
                throw new Error("Item not found in database");
            }
            yield Folder_1.default.create({ name, path, cloudID, modifiedDateLocal, parentFolderPath });
        });
    }
    getItemDetails() {
        const stat = fs_1.default.statSync(this.path);
        return {
            name: path_1.default.basename(this.path),
            parentFolderPath: path_1.default.dirname(this.path),
            modifiedDateLocal: new Date(stat.mtime).toISOString().slice(0, 19),
        };
    }
    getRegisteredItem() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, sequelize_1.getItemCloudID)(this.path, 'FOLDER');
        });
    }
    isItemDirty() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield (0, sequelize_1.getModifiedDate)(this.path, 'FOLDER');
            if (!results) {
                throw new Error("Item not found in database");
            }
            const dbModifiedDate = new Date(results).toISOString().slice(0, 19);
            const localModifiedDate = new Date(this.modifiedDateLocal).toISOString().slice(0, 19);
            return localModifiedDate > dbModifiedDate;
        });
    }
    updateItem() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Folder_1.default.update({ modifiedDateLocal: new Date().toISOString().slice(0, 19) }, { where: { path: this.path } });
        });
    }
}
exports.FolderNode = FolderNode;
