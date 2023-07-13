"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_config_1 = __importDefault(require("../../db/sequelize.config"));
class File extends sequelize_1.Model {
}
File.init({
    cloudID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    extension: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    modifiedDateCloud: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    modifiedDateLocal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    parentFolderPath: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: sequelize_config_1.default, modelName: 'file'
});
exports.default = File;
