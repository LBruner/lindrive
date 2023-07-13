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
exports.ItemNodes = void 0;
const googleDriveAPI_1 = require("../googleDrive/googleDriveAPI");
const sequelize_1 = require("../../db/sequelize");
class ItemNodes {
    constructor() {
        this.allNodes = [];
        this.addNode = (node) => __awaiter(this, void 0, void 0, function* () {
            this.allNodes.push(node);
            yield this.startNodeTracking(node);
        });
        this.addMultipleNodes = (nodes) => __awaiter(this, void 0, void 0, function* () {
            this.allNodes.push(...nodes);
            for (const node of nodes) {
                yield this.startNodeTracking(node);
            }
            console.log('Finished processing initial nodes');
        });
        this.getNode = (nodePath) => __awaiter(this, void 0, void 0, function* () {
            return this.allNodes.find((node) => node.path === nodePath);
        });
        this.updateNode = (nodePath) => __awaiter(this, void 0, void 0, function* () {
            const node = this.allNodes.find((node) => node.path === nodePath);
            if (!node) {
                console.log("Couldn't find node.");
                return;
            }
            yield node.updateItem();
            console.log(`Item: ${node.name} was updated`);
        });
        this.deleteNode = (nodePath, nodeType) => __awaiter(this, void 0, void 0, function* () {
            const deletingNode = yield this.getNode(nodePath);
            let nodeId;
            if (deletingNode) {
                this.allNodes = this.allNodes.filter((node) => node.path !== nodePath);
            }
            if (nodeType == 'FOLDER') {
                nodeId = yield (0, sequelize_1.getItemCloudID)(nodePath, 'FOLDER');
                yield (0, sequelize_1.deleteNode)(nodePath, 'FOLDER');
            }
            else {
                nodeId = yield (0, sequelize_1.getItemCloudID)(nodePath, 'FILE');
                yield (0, sequelize_1.deleteNode)(nodePath, 'FILE');
            }
            if (!nodeId) {
                console.log("Can't find the node.");
                return;
            }
            yield (0, googleDriveAPI_1.deleteCloudFile)(nodeId);
            console.log(`The node was deleted: ${nodePath}`);
        });
        this.startNodeTracking = (node) => __awaiter(this, void 0, void 0, function* () {
            const isRegistered = yield node.getRegisteredItem();
            if (!isRegistered) {
                node.cloudID = yield node.uploadToDrive();
                yield node.register();
            }
            else {
                node.cloudID = isRegistered;
                if (yield node.isItemDirty()) {
                    console.log(`Item: ${node.name} is Dirty!`);
                    yield node.updateItem();
                }
            }
        });
    }
}
exports.ItemNodes = ItemNodes;
