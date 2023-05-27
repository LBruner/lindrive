import {File, Folder} from "../types";
import query from "../../services/mysql";
import {createFolder} from "../googleDrive/googleDriveAPI";

export const isRegistered = async (tableName: string, queryName: string) => {
    const data = await query(`SELECT *
                              from ${tableName}
                              WHERE name = "${queryName}"`)
    return data.length > 0;
}


export const insertIntoDB = async (item: Folder | File) => {
    if ('size' in item) {
        if (!await isRegistered('files', item.name)) {
            const formattedDate = new Date(item.modified!).toISOString().slice(0, 19).replace('T', ' ');
            await query(`INSERT INTO files(name, extension, path, last_modified_local, last_modified_cloud, size)
                         VALUES ("${item.name}", "${item.extension}", "${item.path}", "${formattedDate}", null,
                                 ${item.size})`);
        }
    } else {
        if (!await isRegistered('folders', item.name)) {
            const folderCloudID = await createFolder(item);

            await query(`INSERT INTO folders (name, path, cloud_id)
                         VALUES ("${item.name}", "${item.path}","${folderCloudID}")`)

        }
    }
}

export const updateDB = async (foldersAndFiles: Folder[]) => {
    for (let folder of foldersAndFiles) {
        await insertIntoDB(folder)

        for (let file of folder.filesDetails!) {
            await insertIntoDB(file)
        }
    }
};