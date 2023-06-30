import {DataTypes, Model} from "sequelize";
import sequelizeConfig from "../../db/sequelize.config";

export interface FileAttributes {
    cloudID?: string
    extension: string;
    id: number;
    name: string;
    modifiedDateLocal: string;
    modifiedDateCloud: string;
    parentFolderPath?: string,
    path: string;
    size: number;
}

class File extends Model<FileAttributes> implements FileAttributes {
    id!: number;
    cloudID?: string;
    extension!: string;
    name!: string;
    modifiedDateLocal!: string;
    modifiedDateCloud!: string;
    parentFolderPath?: string;
    path!: string;
    size!: number;
}

File.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cloudID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    extension: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    modifiedDateCloud: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modifiedDateLocal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parentFolderPath: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: sequelizeConfig,
    modelName: 'file',
    createdAt: true,
    updatedAt: false
})

export default File;

