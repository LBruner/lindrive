import File from "../models/files/File";
import Folder from "../models/folder/Folder";

export const setupDatabase = async () => {
    try {
        console.log('Connection has been established successfully.');
        // await File.sync();
        // await Folder.sync();
        // await File.sync({force: true});
        // await Folder.sync({force: true});
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export const getAllNodesPath = async (nodeType: modelIdentifier): Promise<string[]> => {
    let dbResponse;
    if (nodeType === 'FOLDER') {
        dbResponse = await Folder.findAll({attributes: ['path']});
    } else if (nodeType === 'FILE') {
        dbResponse = await File.findAll({attributes: ['path']});
    }

    if(!dbResponse){
        console.log("No data found")
        return []
    }

    return dbResponse.map(item => item.dataValues.path);
};

export type modelIdentifier = 'FOLDER' | 'FILE'

export const getItemCloudID = async (path: string, nodeType: modelIdentifier): Promise<string | null> => {
    let dbResponse;
    if (nodeType === 'FOLDER') {
        dbResponse = await Folder.findOne({where: {path}, attributes: ['cloudID']});
    } else if (nodeType === 'FILE') {
        console.log(path)
        dbResponse = await File.findOne({where: {path}, attributes: ['cloudID']});
    }

    return dbResponse?.dataValues.cloudID || null;
};

export const getModifiedDate = async (path: string, nodeType: modelIdentifier): Promise<string | null> => {
    let dbResults;
    if (nodeType === 'FOLDER') {
        dbResults = await Folder.findOne({
            where: {
                path: path
            }, attributes: ['modifiedDateLocal']
        });
    } else if (nodeType === 'FILE') {
        dbResults = await File.findOne({
            where: {
                path: path
            }, attributes: ['modifiedDateLocal']
        });
    }

    return dbResults?.dataValues.modifiedDateLocal || null
}

export const updateModifiedDate = async (path: string, nodeType: modelIdentifier) => {
    if (nodeType === 'FILE') {
        await File.update({
            modifiedDateLocal: new Date().toISOString().slice(0, 19),
            modifiedDateCloud: new Date().toISOString().slice(0, 19)
        }, {where: {path}})
    }
}

export const deleteNode = async (path: string, nodeType: modelIdentifier): Promise<void> => {
    if (nodeType === 'FILE') {
        await File.destroy({where: {path}});
    } else if (nodeType === 'FOLDER') {
        await Folder.destroy({where: {path}});
        await File.destroy({where: {parentFolderPath: path}})
    }
};