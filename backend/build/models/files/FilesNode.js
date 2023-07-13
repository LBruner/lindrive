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
exports.FilesNode = void 0;
const ItemNode_1 = require("../folder/ItemNode");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const types_1 = require("../../services/types");
const files_mysql_1 = require("../files/files.mysql");
const googleDriveAPI_1 = require("../googleDrive/googleDriveAPI");
const mysql_1 = __importDefault(require("../../services/mysql"));
class FilesNode extends ItemNode_1.ItemNode {
    constructor(itemPath) {
        super();
        this.itemPath = itemPath;
        const { name, parentFolderName, modifiedDate, size, extension } = this.getItemDetails();
        this.extension = extension;
        this.modifiedDate = modifiedDate;
        this.name = name;
        this.parentFolderPath = parentFolderName;
        this.size = size;
    }
    getItemDetails() {
        const stat = fs_1.default.statSync(this.itemPath);
        const itemData = {
            name: path_1.default.basename(this.itemPath),
            parentFolderName: path_1.default.dirname(this.itemPath),
            modifiedDate: new Date(stat.mtime).toISOString().slice(0, 19),
            extension: path_1.default.extname(this.itemPath),
            size: stat.size,
        };
        return itemData;
    }
    getRegisteredItem() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, files_mysql_1.getRegisteredItem)(this.itemPath, types_1.TableIdentifier.FILES);
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mysql_1.default)(`INSERT INTO lindrive.files (name, extension, path, parentFolder, cloudID, lastModifiedLocal,
                                                 lastModifiedCloud,
                                                 size) VALUE ("${this.name}", "${this.extension}", "${this.itemPath}", "${this.parentFolderPath}", "${this.cloudID}", "${this.modifiedDate}")`);
        });
    }
    uploadToDrive() {
        return __awaiter(this, void 0, void 0, function* () {
            const { cloudID } = yield (0, files_mysql_1.getRegisteredItem)(this.parentFolderPath, types_1.TableIdentifier.FILES);
            return yield (0, googleDriveAPI_1.createDriveFolder)(this.name, cloudID);
        });
    }
}
exports.FilesNode = FilesNode;
