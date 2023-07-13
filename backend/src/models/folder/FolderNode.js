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
const mysql_1 = __importDefault(require("../../services/mysql"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const files_mysql_1 = require("../files/files.mysql");
const types_1 = require("../../services/types");
const googleDriveAPI_1 = require("../googleDrive/googleDriveAPI");
class FolderNode {
    constructor(itemPath, rootFolderID) {
        this.itemPath = itemPath;
        this.rootFolderID = rootFolderID;
        const { name, parentFolderName, modifiedDate } = this.getItemDetails();
        this.name = name;
        this.parentFolderPath = parentFolderName;
        this.modifiedDate = modifiedDate;
    }
    uploadToDrive() {
        return __awaiter(this, void 0, void 0, function* () {
            const cloudID = yield (0, files_mysql_1.getRegisteredItem)(this.parentFolderPath, types_1.TableIdentifier.FOLDERS);
            if (!cloudID) {
                return yield (0, googleDriveAPI_1.createDriveFolder)(this.name, this.rootFolderID);
            }
            else {
                return yield (0, googleDriveAPI_1.createDriveFolder)(this.name, cloudID.cloudID);
            }
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mysql_1.default)(`INSERT INTO lindrive.folders (name, path, cloudID, modifiedDate) VALUE ("${this.name}", "${this.itemPath}", "${this.cloudID}", "${this.modifiedDate}")`);
        });
    }
    getItemDetails() {
        const stat = fs_1.default.statSync(this.itemPath);
        return {
            name: path_1.default.basename(this.itemPath),
            parentFolderName: path_1.default.dirname(this.itemPath),
            modifiedDate: new Date(stat.mtime).toISOString().slice(0, 19)
        };
    }
    getRegisteredItem() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, files_mysql_1.getRegisteredItem)(this.itemPath, types_1.TableIdentifier.FOLDERS);
        });
    }
    isItemDirty() {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = yield (0, mysql_1.default)(`SELECT modifiedDate
                                       from folders
                                       WHERE path = "${this.itemPath}"`);
            const dbModifiedDate = new Date(results.modifiedDate).toISOString().slice(0, 19);
            const localModifiedDate = new Date(this.modifiedDate).toISOString().slice(0, 19);
            return localModifiedDate > dbModifiedDate;
        });
    }
    updateItem() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, mysql_1.default)(`UPDATE folders
                            SET modifiedDate = "${new Date().toISOString().slice(0, 19)}"
                            WHERE path = "${this.itemPath}"`);
        });
    }
}
exports.FolderNode = FolderNode;
