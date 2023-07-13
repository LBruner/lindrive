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
exports.ItemNodes = void 0;
const mysql_1 = __importDefault(require("../../services/mysql"));
const googleDriveAPI_1 = require("../googleDrive/googleDriveAPI");
class ItemNodes {
    constructor() {
        this.allNodes = [];
        this.addNode = (node) => __awaiter(this, void 0, void 0, function* () {
            this.allNodes.push(node);
            yield this.processAddNode(node);
        });
        this.addMultipleNodes = (nodes) => __awaiter(this, void 0, void 0, function* () {
            this.allNodes.push(...nodes);
            for (const node of nodes) {
                yield this.processAddNode(node);
            }
            console.log('Finished processing initial nodes');
        });
        this.getNode = (nodePath) => __awaiter(this, void 0, void 0, function* () {
            return this.allNodes.find((node) => node.itemPath === nodePath);
        });
        this.updateNode = (nodePath) => __awaiter(this, void 0, void 0, function* () {
            const node = this.allNodes.find((node) => node.itemPath === nodePath);
            if (!node) {
                console.log("Couldn't find node.");
                return;
            }
            yield node.updateItem();
            console.log(`Item: ${node.name} was updated`);
        });
        this.deleteNode = (nodePath, nodeType) => __awaiter(this, void 0, void 0, function* () {
            const deleteNode = yield this.getNode(nodePath);
            let nodeId;
            if (deleteNode) {
                this.allNodes = this.allNodes.filter((node) => node.itemPath !== nodePath);
            }
            if (nodeType == 'FOLDER') {
                nodeId = yield (0, mysql_1.default)(`SELECT cloudID
                                  from folders
                                  WHERE path = "${nodePath}"`);
                yield (0, mysql_1.default)(`DELETE
                         FROM files
                         WHERE parentFolderPath = "${nodePath}"`);
                yield (0, mysql_1.default)(`DELETE
                         FROM folders
                         WHERE path = "${nodePath}"`);
            }
            else {
                nodeId = yield (0, mysql_1.default)(`SELECT cloudID
                                  FROM files
                                  WHERE path = "${nodePath}"`);
                yield (0, mysql_1.default)(`DELETE
                         FROM files
                         WHERE path = "${nodePath}"`);
            }
            if (nodeId.length === 0) {
                console.log("Can't find the node.");
                return;
            }
            yield (0, googleDriveAPI_1.deleteCloudFile)(nodeId[0].cloudID);
            console.log(`The node was deleted: ${nodePath}`);
        });
        this.processAddNode = (node) => __awaiter(this, void 0, void 0, function* () {
            const isRegistered = yield node.getRegisteredItem();
            if (!isRegistered) {
                node.cloudID = yield node.uploadToDrive();
                node.register();
            }
            else {
                node.cloudID = isRegistered.cloudID;
                if (yield node.isItemDirty()) {
                    console.log(`Item: ${node.name} is Dirty!`);
                    yield node.updateItem();
                }
            }
        });
    }
}
exports.ItemNodes = ItemNodes;
