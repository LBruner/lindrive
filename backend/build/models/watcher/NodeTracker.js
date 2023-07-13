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
exports.NodeTracker = void 0;
const ApiWatcher_1 = require("./ApiWatcher");
const ItemNodes_1 = require("../nodes/ItemNodes");
const FileNode_1 = require("../files/FileNode");
const FolderNode_1 = require("../folder/FolderNode");
const OfflineTracker_1 = require("./OfflineTracker");
const sequelize_1 = require("../../db/sequelize");
const fs_1 = __importDefault(require("fs"));
const watcherConfig = {
    awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
    persistent: true,
    ignored: /(^|[/\\])\..obsidian/,
    ignoreInitial: true
};
class NodeTracker {
    constructor(path) {
        this.path = path;
        this.itemNodes = new ItemNodes_1.ItemNodes();
        this.handleNodesEvents = () => __awaiter(this, void 0, void 0, function* () {
            yield this.handleInitialNodes();
            this.watcher.onAddFolder(this.addFolderHandler);
            this.watcher.onFolderDelete(this.deleteFolderHandler);
            this.watcher.onAddFile(this.addFileHandler);
            this.watcher.onFileUpdate(this.updateFileHandler);
            this.watcher.onFileDelete(this.deleteFileHandler);
        });
        this.watchDirectory = () => __awaiter(this, void 0, void 0, function* () {
            yield this.handleNodesEvents();
        });
        //TODO Remove duplicated code
        this.addFolderHandler = (nodePath) => {
            const folderNode = new FolderNode_1.FolderNode(nodePath);
            this.itemNodes.addNode(folderNode);
        };
        this.addFileHandler = (nodePath) => {
            const fileNode = new FileNode_1.FileNode(nodePath);
            this.itemNodes.addNode(fileNode);
        };
        this.updateFileHandler = (nodePath) => __awaiter(this, void 0, void 0, function* () {
            yield this.itemNodes.updateNode(nodePath);
        });
        this.deleteFileHandler = (nodePath) => __awaiter(this, void 0, void 0, function* () {
            yield this.itemNodes.deleteNode(nodePath, "FILE");
        });
        this.deleteFolderHandler = (nodePath) => __awaiter(this, void 0, void 0, function* () {
            yield this.itemNodes.deleteNode(nodePath, "FOLDER");
        });
        this.handleInitialNodes = () => __awaiter(this, void 0, void 0, function* () {
            const offlineTrack = new OfflineTracker_1.OfflineTracker(this.path);
            const initialNodes = yield offlineTrack.getInitialNodes();
            yield this.itemNodes.addMultipleNodes(initialNodes);
            const deleteErasedNotes = () => __awaiter(this, void 0, void 0, function* () {
                const allFoldersPath = yield (0, sequelize_1.getAllNodesPath)('FOLDER');
                const allFilesPath = yield (0, sequelize_1.getAllNodesPath)('FILE');
                const initialNodesPath = initialNodes.map((item) => item.path);
                const toDeleteFolders = allFoldersPath.filter((item) => !initialNodesPath.includes(item));
                const toDeleteFiles = allFilesPath.filter((item) => !initialNodesPath.includes(item));
                for (let node of toDeleteFolders) {
                    yield this.itemNodes.deleteNode(node, "FOLDER");
                }
                for (let node of toDeleteFiles) {
                    yield this.itemNodes.deleteNode(node, "FILE");
                }
            });
            yield deleteErasedNotes();
        });
        const pathIsValid = this.isFolderPathValid(path);
        if (pathIsValid) {
            this.watcher = new ApiWatcher_1.ApiWatcher(path, watcherConfig);
            this.watchDirectory();
        }
        else {
            throw new Error(`Path: ${path} is invalid!`);
        }
    }
    ;
    isFolderPathValid(folderPath) {
        try {
            const stats = fs_1.default.statSync(folderPath);
            return stats.isDirectory();
        }
        catch (error) {
            return false;
        }
    }
}
exports.NodeTracker = NodeTracker;
