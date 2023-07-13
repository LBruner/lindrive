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
exports.ItemsNode = void 0;
class ItemsNode {
    constructor() {
        this.allNodes = [];
    }
    addSingleNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
            this.allNodes.push(node);
            yield this.processAddNode(node);
        });
    }
    addMultipleNodes(nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            this.allNodes.push(...nodes);
            const initialNodes = nodes;
            for (const node of nodes) {
                yield this.processAddNode(node);
            }
            ;
            console.log('Finished processing initial nodes');
        });
    }
    getAllNodes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.allNodes;
        });
    }
    ;
    getNode(nodePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.allNodes.find((node) => node.itemPath === nodePath);
        });
    }
    ;
    updateNode(nodePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = this.allNodes.find((node) => node.itemPath === nodePath);
            if (!node)
                return; //TODO: ADD DELETE NODE
            yield node.updateItem();
            console.log(`Item: ${node.name} was updated`);
        });
    }
    processAddNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
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
exports.ItemsNode = ItemsNode;
