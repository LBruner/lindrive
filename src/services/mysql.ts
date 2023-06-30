import sequelize from "../db/sequelize.config";
import File from "../models/files/File";
import Folder from "../models/folder/Folder";

export const setupDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        console.log(sequelize.models)
        await File.sync();
        await Folder.sync();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};