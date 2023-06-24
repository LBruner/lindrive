import query from "../../services/mysql";
import {TableIdentifier} from "../../services/types";


export async function getRegisteredItem(path: string, tableIdentifier: TableIdentifier): Promise<{
    cloudID: string | undefined
}> {
    const [results] = await query(`SELECT cloudID
                                   from ${tableIdentifier}
                                   WHERE path = "${path}"`);

    return results;
}

//
// export const registerItem = async (item: Folder | File, parentFolderID: string): Promise<string> => {
//     const cloudID = await uploadItem(item, parentFolderID);
//     if ('size' in item) {
//         const {name, extension, path, size, modifiedDate, parentFolder} = item;
//         itemsLogger.info(`\`FILE: ${item.name} was uploaded to parent: ${parentFolderID} and Has ID: ${cloudID}`)
//         await query(`INSERT INTO files (name, extension, path, parentFolder, cloudID, lastModifiedLocal,
//                                         lastModifiedCloud,
//                                         size) VALUE ("${name}", "${extension}", "${path}", "${parentFolder}",
//                                                      "${cloudID}", "${modifiedDate}",
//                                                      "${modifiedDate}", "${size}")`)
//     } else {
//         const {name, path, modifiedDate} = item;
//         itemsLogger.info(`\`FOLDER: ${item.name} was uploaded to parent: ${parentFolderID} and Has ID: ${cloudID}`)
//         await query(`INSERT INTO folders (name, path, cloudID, modifiedDate)
//                      VALUES ("${name}", "${path}", "${cloudID}", "${modifiedDate}")`);
//     }
//
//     return parentFolderID;
// }


