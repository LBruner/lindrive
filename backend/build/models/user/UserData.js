"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_config_1 = __importDefault(require("../../db/sequelize.config"));
class UserData extends sequelize_1.Model {
}
UserData.init({
    access_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    refresh_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    rootFolderId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    rootFolderName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'lindrive'
    },
}, { sequelize: sequelize_config_1.default, modelName: 'userData', timestamps: false });
exports.default = UserData;
