"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sequelize_config_1 = __importDefault(require("../db/sequelize.config"));
class Database {
    getModel(modelName) {
        return sequelize_config_1.default.models[modelName];
    }
}
exports.Database = Database;
