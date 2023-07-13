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
exports.OfflineTracker = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const FolderNode_1 = require("../folder/FolderNode");
const FileNode_1 = require("../files/FileNode");
class OfflineTracker {
    constructor(path) {
        this.path = path;
        this.watcher = chokidar_1.default.watch(path, {
            ignoreInitial: true,
            awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 }
        });
    }
    getInitialNodes() {
        return __awaiter(this, void 0, void 0, function* () {
            let descendingNodes;
            descendingNodes = yield this.getInitialFolders();
            descendingNodes.push(...yield this.getInitialFiles());
            return descendingNodes;
        });
    }
    getInitialFolders() {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryWatcher = chokidar_1.default.watch(this.path, {
                ignored: /(^|\/)\.[^\/.]/g
            });
            const initialNodes = [];
            const promise = new Promise((resolve) => {
                temporaryWatcher.on('addDir', (eventName) => __awaiter(this, void 0, void 0, function* () {
                    const folderNode = new FolderNode_1.FolderNode(eventName);
                    initialNodes.push(folderNode);
                })).on('ready', () => __awaiter(this, void 0, void 0, function* () {
                    resolve(initialNodes);
                }));
            });
            return yield promise;
        });
    }
    getInitialFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO ask if want to ignore hidden folders
            const temporaryWatcher = chokidar_1.default.watch(this.path, {
                ignored: /(^|\/)\.[^\/.]/g
            });
            const initialNodes = [];
            const promise = new Promise((resolve) => {
                temporaryWatcher.on('add', (eventName) => {
                    const fileNode = new FileNode_1.FileNode(eventName);
                    initialNodes.push(fileNode);
                }).on('ready', () => __awaiter(this, void 0, void 0, function* () {
                    resolve(initialNodes);
                }));
            });
            return yield promise;
        });
    }
}
exports.OfflineTracker = OfflineTracker;
