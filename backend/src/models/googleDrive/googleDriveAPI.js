"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteCloudFile = exports.updateCloudFile = exports.createDriveFolder = exports.uploadFile = void 0;
const fs = __importStar(require("fs"));
const googleAuth_1 = require("./googleAuth");
const mime_1 = __importDefault(require("mime"));
const app_1 = require("../../app");
const uploadFile = (fileData) => __awaiter(void 0, void 0, void 0, function* () {
    const { filePath, fileParentCloudID, fileExtension, fileName } = fileData;
    const media = {
        mimeType: mime_1.default.lookup(fileExtension),
        body: fs.createReadStream(filePath)
    };
    try {
        const res = yield googleAuth_1.drive.files.create({
            requestBody: {
                name: fileName,
                parents: [fileParentCloudID]
            },
            media: media,
            fields: 'id',
        });
        console.log("UPLOADED", res.data.id);
        // driveLogger.info(`File: ${fileName} uploaded to Google Drive with id: ${res.data.id}`);
        return res.data.id;
    }
    catch (e) {
        console.log(e);
    }
});
exports.uploadFile = uploadFile;
const createDriveFolder = (folderName, parentFolder) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(folderName, parentFolder);
    const requestBody = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolder]
    };
    try {
        const file = yield googleAuth_1.drive.files.create({
            requestBody,
            fields: 'id',
        });
        app_1.driveLogger.info(`Folder ${folderName} was created with id: ${file.data.id}`);
        return file.data.id;
    }
    catch (e) {
        console.log(`Item could not be created! Error: ${e.message}`);
    }
});
exports.createDriveFolder = createDriveFolder;
const updateCloudFile = (fileData) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileID, fileName, filePath, fileExtension } = fileData;
    try {
        yield googleAuth_1.drive.files.update({
            fileId: fileID,
            media: {
                mimeType: mime_1.default.lookup(fileExtension),
                body: fs.createReadStream(filePath),
            }
        });
        console.log(`File: ${fileName} updated on Google Drive with id: ${fileID}`);
    }
    catch (e) {
        console.log(`File: ${fileName} could not be updated.
        Error: ${e}`);
    }
});
exports.updateCloudFile = updateCloudFile;
const deleteCloudFile = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield googleAuth_1.drive.files.delete({ fileId: itemId });
        console.log('Item deleted successfully.');
    }
    catch (error) {
        console.error('Error deleting item:', error.message);
    }
});
exports.deleteCloudFile = deleteCloudFile;
