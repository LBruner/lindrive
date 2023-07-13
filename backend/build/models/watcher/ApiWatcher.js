"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiWatcher = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
class ApiWatcher {
    constructor(path, watcherConfig) {
        this.path = path;
        this.onAddFolder = (callback) => {
            this.watcher.on('addDir', callback);
        };
        this.onAddFile = (callback) => {
            this.watcher.on('add', callback);
        };
        this.onFileUpdate = (callback) => {
            this.watcher.on('change', callback);
        };
        this.onFileDelete = (callback) => {
            this.watcher.on('unlink', callback);
        };
        this.onFolderDelete = (callback) => {
            this.watcher.on('unlinkDir', callback);
        };
        this.watcher = chokidar_1.default.watch(path, watcherConfig);
    }
}
exports.ApiWatcher = ApiWatcher;
