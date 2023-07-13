"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_config_1 = __importDefault(require("../../db/sequelize.config"));
class User extends sequelize_1.Model {
}
User.init({
    loginId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    refreshToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    randomSecret: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    rootFolderId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    rootFolderName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize: sequelize_config_1.default, modelName: 'user', timestamps: false });
exports.default = User;
