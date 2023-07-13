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
const googleDriveAPI_1 = require("../googleDrive/googleDriveAPI");
const File_1 = __importDefault(require("./File"));
const sequelize_1 = require("../../db/sequelize");
class FileNode {
    constructor(path) {
        this.path = path;
        const { name, parentFolderPath, modifiedDateLocal, size, extension } = this.getItemDetails();
        this.extension = extension;
        this.modifiedDateLocal = modifiedDateLocal;
        this.name = name;
        this.parentFolderPath = parentFolderPath;
        this.size = size;
        this.cloudID = null;
    }
    getItemDetails() {
        const stat = fs_1.default.statSync(this.path);
        return {
            name: path_1.default.basename(this.path),
            parentFolderPath: path_1.default.dirname(this.path),
            modifiedDateLocal: new Date(stat.mtime).toISOString().slice(0, 19),
            extension: path_1.default.extname(this.path),
            size: stat.size,
        };
    }
    getRegisteredItem() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, sequelize_1.getItemCloudID)(this.path, 'FILE');
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, extension, path, parentFolderPath, modifiedDateLocal, size, cloudID } = this;
            if (!cloudID) {
                throw new Error('CloudID is null.');
            }
            yield File_1.default.create({
                name,
                extension,
                path,
                parentFolderPath,
                modifiedDateLocal,
                size,
                cloudID,
                modifiedDateCloud: modifiedDateLocal,
            });
        });
    }
    uploadToDrive() {
        return __awaiter(this, void 0, void 0, function* () {
            const cloudID = yield (0, sequelize_1.getItemCloudID)(this.parentFolderPath, 'FOLDER');
            return yield (0, googleDriveAPI_1.uploadFile)({
                filePath: this.path,
                fileExtension: this.extension,
                fileParentCloudID: cloudID,
                fileName: this.name,
            });
        });
    }
    updateItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name: fileName, extension: fileExtension, cloudID, path: filePath, } = this;
            if (!cloudID) {
                throw new Error('CloudID is null.');
            }
            yield (0, googleDriveAPI_1.updateCloudFile)({ fileExtension, fileName, fileID: cloudID, filePath });
            yield (0, sequelize_1.updateModifiedDate)(filePath, "FILE");
        });
    }
    isItemDirty() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield (0, sequelize_1.getModifiedDate)(this.path, 'FILE');
            if (!results) {
                throw new Error('Error getting modified date');
            }
            const dbModifiedDate = new Date(results).toISOString().slice(0, 19);
            const localModifiedDate = new Date(this.modifiedDateLocal).toISOString().slice(0, 19);
            return localModifiedDate > dbModifiedDate;
        });
    }
}
exports.FileNode = FileNode;
