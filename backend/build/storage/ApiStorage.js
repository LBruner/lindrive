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
exports.ApiStorage = void 0;
const node_persist_1 = __importDefault(require("node-persist"));
const path_1 = __importDefault(require("path"));
const userSettingsPath = path_1.default.resolve(__dirname, '..', '..', 'settings');
class ApiStorage {
    constructor() {
        this.initStorage = () => __awaiter(this, void 0, void 0, function* () {
            yield node_persist_1.default.init({
                dir: userSettingsPath,
            });
        });
        this.getItem = (itemKey) => __awaiter(this, void 0, void 0, function* () {
            return yield node_persist_1.default.getItem(itemKey);
        });
        this.setItem = (itemKey, data) => __awaiter(this, void 0, void 0, function* () {
            node_persist_1.default.setItem(itemKey, data);
        });
        this.initStorage();
    }
}
exports.ApiStorage = ApiStorage;
