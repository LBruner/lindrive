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
exports.getSetUser = exports.deleteNode = exports.updateModifiedDate = exports.getModifiedDate = exports.getItemCloudID = exports.getAllNodesPath = exports.setupDatabase = void 0;
const File_1 = __importDefault(require("../models/files/File"));
const Folder_1 = __importDefault(require("../models/folder/Folder"));
const UserData_1 = __importDefault(require("../models/user/UserData"));
const setupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield File_1.default.sync();
        yield Folder_1.default.sync();
        yield UserData_1.default.sync();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
exports.setupDatabase = setupDatabase;
const getAllNodesPath = (nodeType) => __awaiter(void 0, void 0, void 0, function* () {
    let dbResponse;
    if (nodeType === 'FOLDER') {
        dbResponse = yield Folder_1.default.findAll({ attributes: ['path'] });
    }
    else if (nodeType === 'FILE') {
        dbResponse = yield File_1.default.findAll({ attributes: ['path'] });
    }
    if (!dbResponse) {
        console.log("No data found");
        return [];
    }
    return dbResponse.map(item => item.dataValues.path);
});
exports.getAllNodesPath = getAllNodesPath;
const getItemCloudID = (path, nodeType) => __awaiter(void 0, void 0, void 0, function* () {
    let dbResponse;
    if (nodeType === 'FOLDER') {
        dbResponse = yield Folder_1.default.findOne({ where: { path }, attributes: ['cloudID'] });
    }
    else if (nodeType === 'FILE') {
        console.log(path);
        dbResponse = yield File_1.default.findOne({ where: { path }, attributes: ['cloudID'] });
    }
    return (dbResponse === null || dbResponse === void 0 ? void 0 : dbResponse.dataValues.cloudID) || null;
});
exports.getItemCloudID = getItemCloudID;
const getModifiedDate = (path, nodeType) => __awaiter(void 0, void 0, void 0, function* () {
    let dbResults;
    if (nodeType === 'FOLDER') {
        dbResults = yield Folder_1.default.findOne({
            where: {
                path: path
            }, attributes: ['modifiedDateLocal']
        });
    }
    else if (nodeType === 'FILE') {
        dbResults = yield File_1.default.findOne({
            where: {
                path: path
            }, attributes: ['modifiedDateLocal']
        });
    }
    return (dbResults === null || dbResults === void 0 ? void 0 : dbResults.dataValues.modifiedDateLocal) || null;
});
exports.getModifiedDate = getModifiedDate;
const updateModifiedDate = (path, nodeType) => __awaiter(void 0, void 0, void 0, function* () {
    if (nodeType === 'FILE') {
        yield File_1.default.update({
            modifiedDateLocal: new Date().toISOString().slice(0, 19),
            modifiedDateCloud: new Date().toISOString().slice(0, 19)
        }, { where: { path } });
    }
});
exports.updateModifiedDate = updateModifiedDate;
const deleteNode = (path, nodeType) => __awaiter(void 0, void 0, void 0, function* () {
    if (nodeType === 'FILE') {
        yield File_1.default.destroy({ where: { path } });
    }
    else if (nodeType === 'FOLDER') {
        yield Folder_1.default.destroy({ where: { path } });
        yield File_1.default.destroy({ where: { parentFolderPath: path } });
    }
});
exports.deleteNode = deleteNode;
//TODO separate functions into Nodes and User folder
const getSetUser = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield UserData_1.default.findOne();
});
exports.getSetUser = getSetUser;
