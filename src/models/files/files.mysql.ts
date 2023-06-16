import query from "../../services/mysql";
import {itemsLogger} from "../../app";
import {Folder, File} from "../types";
import {createDriveFolder, uploadItem,} from "../googleDrive/googleDriveAPI";

export const getFolderID = async (folderPath: string): Promise<string | null> => {
    const result = await query(`SELECT cloudID
                                FROM folders
                                WHERE path = "${folderPath}"`);
    if (result.length > 0) {
        itemsLogger.info(`Folder: ${folderPath} already exists with cloudID: ${result[0].cloudID}\n`)
        return result[0].cloudID;
    }
    return null;
};
export const registerItem = async (item: Folder | File, parentFolderID: string): Promise<string> => {
    const cloudID = await uploadItem(item, parentFolderID);
    if ('size' in item) {
        const {name, extension, path, size, modified} = item;
        itemsLogger.info(`\`FILE: ${item.name} was uploaded to parent: ${parentFolderID} and Has ID: ${cloudID}`)
        await query(`INSERT INTO files (name, extension, path, cloud_id, last_modified_local, last_modified_cloud,
                                        size) VALUE ("${name}", "${extension}", "${path}", "${cloudID}", "${modified}",
                                                 "${modified}", "${size}")`)
    } else {
        const {name, path} = item;
        itemsLogger.info(`\`FOLDER: ${item.name} was uploaded to parent: ${parentFolderID} and Has ID: ${cloudID}`)
        await query(`INSERT INTO folders (name, path, cloudID)
                     VALUES ("${name}", "${path}", "${cloudID}")`);
    }

    return parentFolderID;
}


