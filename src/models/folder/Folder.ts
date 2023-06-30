import {DataTypes, Model} from "sequelize";
import sequelizeConfig from "../../db/sequelize.config";

export interface FolderAttributes {
    name: string;
    path: string;
    parentFolderPath: string,
    modifiedDateLocal: string,
    cloudID?: string,
    parentFolderID?: string
}

class Folder extends Model<FolderAttributes> implements FolderAttributes {
    public name!: string;
    public path!: string;
    public parentFolderPath!: string;
    public modifiedDateLocal!: string;
    public cloudID?: string;
    public parentFolderID?: string;
}

Folder.init({
    cloudID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modifiedDateLocal: {
        type: DataTypes.STRING,
        allowNull: false
    }, parentFolderPath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentFolderID: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelizeConfig,
    modelName: "folder",
    timestamps: false
});

export default Folder;

