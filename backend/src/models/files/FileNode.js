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
exports.FileNode = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const types_1 = require("../../services/types");
const files_mysql_1 = require("./files.mysql");
const googleDriveAPI_1 = require("../googleDrive/googleDriveAPI");
const mysql_1 = __importDefault(require("../../services/mysql"));
class FileNode {
    constructor(itemPath) {
        this.itemPath = itemPath;
        const { name, parentFolderPath, modifiedDate, size, extension } = this.getItemDetails();
        this.extension = extension;
        this.modifiedDate = modifiedDate;
        this.name = name;
        this.parentFolderPath = parentFolderPath;
        this.size = size;
    }
    getItemDetails() {
        const stat = fs_1.default.statSync(this.itemPath);
        return {
            name: path_1.default.basename(this.itemPath),
            parentFolderPath: path_1.default.dirname(this.itemPath),
            modifiedDate: new Date(stat.mtime).toISOString().slice(0, 19),
            extension: path_1.default.extname(this.itemPath),
            size: stat.size,
        };
    }
    getRegisteredItem() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, files_mysql_1.getRegisteredItem)(this.itemPath, types_1.TableIdentifier.FILES);
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mysql_1.default)(`INSERT INTO lindrive.files (name, extension, path, parentFolderPath, cloudID, lastModifiedLocal,
                                                 lastModifiedCloud,
                                                 size) VALUE ("${this.name}", "${this.extension}", "${this.itemPath}",
                                                              "${this.parentFolderPath}", "${this.cloudID}",
                                                              "${this.modifiedDate}", "${this.modifiedDate}",
                                                              "${this.size}")`);
        });
    }
    uploadToDrive() {
        return __awaiter(this, void 0, void 0, function* () {
            const { cloudID } = yield (0, files_mysql_1.getRegisteredItem)(this.parentFolderPath, types_1.TableIdentifier.FOLDERS);
            return yield (0, googleDriveAPI_1.uploadFile)({
                filePath: this.itemPath,
                fileExtension: this.extension,
                fileParentCloudID: cloudID,
                fileName: this.name,
            });
        });
    }
    updateItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name: fileName, extension: fileExtension, cloudID: fileID, itemPath: filePath, } = this;
            yield (0, googleDriveAPI_1.updateCloudFile)({ fileExtension, fileName, fileID, filePath });
            yield (0, mysql_1.default)(`UPDATE lindrive.files
                     SET lastModifiedCloud = "${new Date().toISOString().slice(0, 19)}",
                         lastModifiedLocal = "${new Date().toISOString().slice(0, 19)}"
                     WHERE path = "${filePath}"`);
        });
    }
    isItemDirty() {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = yield (0, mysql_1.default)(`SELECT lastModifiedLocal
                                       from lindrive.files
                                       WHERE path = "${this.itemPath}"`);
            const dbModifiedDate = new Date(results.lastModifiedLocal).toISOString().slice(0, 19);
            const localModifiedDate = new Date(this.modifiedDate).toISOString().slice(0, 19);
            return localModifiedDate > dbModifiedDate;
        });
    }
}
exports.FileNode = FileNode;
