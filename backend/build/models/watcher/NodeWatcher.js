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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeWatcher = void 0;
const ApiWatcher_1 = require("./ApiWatcher");
const ItemNodes_1 = require("../nodes/ItemNodes");
const FileNode_1 = require("../files/FileNode");
const FolderNode_1 = require("../folder/FolderNode");
class NodeWatcher {
    constructor(path, rootCloudId) {
        this.path = path;
        this.rootCloudId = rootCloudId;
        this.itemNodes = new ItemNodes_1.ItemNodes();
        this.handleNodesEvents = () => {
            this.watcher.onAddFolder(this.addFolderHandler);
            this.watcher.onAddFile(this.addFileHandler);
            this.watcher.onFileUpdate(this.updateFileHandler);
            this.watcher.onFileDelete(this.deleteFileHandler);
            this.watcher.onFolderDelete(this.deleteFolderHandler);
        };
        this.watchDirectory = () => __awaiter(this, void 0, void 0, function* () {
            yield this.handleNodesEvents();
        });
        this.addFolderHandler = (nodePath) => {
            const folderNode = new FolderNode_1.FolderNode(nodePath, this.rootCloudId);
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
        this.watcher = new ApiWatcher_1.ApiWatcher(path, {
            awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
            persistent: true,
        });
        this.watchDirectory();
    }
    ;
}
exports.NodeWatcher = NodeWatcher;
