import {DataTypes, Model} from "sequelize";
import sequelize from "../../db/sequelize.config";

export interface UserAttributes {
    access_token: string,
    randomSecret?: string,
    refresh_token: string,
    rootFolderId?: string
    rootFolderName?: string,
}

class UserData extends Model<UserAttributes> implements UserAttributes {
    access_token!: string;
    randomSecret!: string;
    refresh_token!: string;
    rootFolderId!: string;
    rootFolderName!: string;
}

UserData.init({
    access_token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rootFolderId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rootFolderName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'lindrive'
    },
}, {sequelize, modelName: 'userData', timestamps: false})

export default UserData