import {File, Folder} from "../types";
import query from "../../services/mysql";
import {createFolder, updateCloudFile, uploadFile} from "../googleDrive/googleDriveAPI";

export const getRegisteredValue = async (tableName: string, queryName: string) => {
    const data = await query(`SELECT *
                              from ${tableName}
                              WHERE name = "${queryName}"`)
    if (data.length == 0)
        return null;
    return data;
}

export const insertIntoDB = async (item: Folder | File, folderName?: string) => {
    if ('size' in item) {
        const localDate = item.modified!.slice(0, 19).replace('T', ' ');

        const registeredFile = await getRegisteredValue('files', item.name);
        const folderData = await query(`SELECT cloud_id
                                        from folders
                                        WHERE name = "${folderName}"`);

        if (!registeredFile) {
            const fileCloudID = await uploadFile(item, folderData[0].cloud_id);

            await query(`INSERT INTO files(name, extension, path, last_modified_local, last_modified_cloud, cloud_id,
                                           size)
                         VALUES ("${item.name}", "${item.extension}", "${item.path}", "${localDate}",
                                 "${localDate}", "${fileCloudID}",
                                 ${item.size})`);
        } else {
            const localUTCDate = new Date(localDate).toUTCString();
            const dbDate = new Date(registeredFile[0].last_modified_local).toUTCString()

            console.log(`Local: ${localUTCDate} - DB: ${dbDate}`);

            if (localUTCDate > dbDate) {
                await updateCloudFile(registeredFile[0]);
                await query(`UPDATE files
                             SET last_modified_local = "${localDate}"
                             WHERE name = "${registeredFile[0].name}"`)
            }
        }
    } else {
        const registeredFolder = await getRegisteredValue('folders', item.name);
        if (!registeredFolder) {
            const folderCloudID = await createFolder(item);

            await query(`INSERT INTO folders (name, path, cloud_id)
                         VALUES ("${item.name}", "${item.path}", "${folderCloudID}")`)
        }
    }
}

export const updateDB = async (foldersAndFiles: Folder[]) => {
    for (let folder of foldersAndFiles) {
        await insertIntoDB(folder)

        for (let file of folder.filesDetails!) {
            await insertIntoDB(file, folder.name)
        }
    }
};