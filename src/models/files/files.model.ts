import * as path from "path";
import * as fs from "fs";
import {getFolderID, registerItem} from "./files.mysql";
import query from "../../services/mysql";
import {File, Folder, Result} from "../types";
import {itemsLogger} from "../../app";
import {updateCloudFile} from "../googleDrive/googleDriveAPI";

function traverseDirectory(directory: string): Result {
    const files: File[] = [];
    const folders: Folder[] = [];

    function traverse(dir: string) {
        const entries = fs.readdirSync(dir, {withFileTypes: true});

        entries.forEach((entry) => {
            const fullPath = path.join(dir, entry.name);
            const stat = fs.statSync(fullPath);

            if (entry.isDirectory()) {
                const folder: Folder = {
                    name: path.basename(fullPath),
                    path: fullPath,
                    parentFolderName: path.basename(path.dirname(fullPath)),
                    modifiedDate: new Date(stat.mtime).toISOString().slice(0, 19)
                };

                folders.push(folder);

                traverse(fullPath);
            } else {
                const file: File = {
                    name: entry.name,
                    size: stat.size,
                    extension: path.extname(entry.name),
                    path: fullPath,
                    modifiedDate: new Date(stat.mtime).toISOString().slice(0, 19),
                    parentFolder: path.basename(path.dirname(fullPath)),
                };

                files.push(file);
            }
        });
    }

    const stat = fs.statSync(directory);

    const rootFolder: Folder = {
        name: path.basename(directory),
        path: directory,
        parentFolderName: path.basename(path.dirname(directory)),
        modifiedDate: new Date(stat.mtime).toISOString().slice(0, 19)
    };

    folders.push(rootFolder);
    traverse(directory);

    return {files, folders};
}

const processFolders = async (folders: Folder[], rootFolderCloudID: string) => {
    let rootFolderID = await getFolderID(folders[0].path);
    const markedFolders: Folder[] = []

    if (!rootFolderID) {
        await registerItem(folders[0], rootFolderCloudID);
        markedFolders.push(folders[0])
    }


    for (let folder of folders) {
        const folderIsRegistered = await getFolderID(folder.path);

        if (!folderIsRegistered) {
            const parentID = await query(`SELECT cloudID
                                          FROM folders
                                          WHERE name = "${folder.parentFolderName}"`)
            itemsLogger.info(`Folder: ${folder.name} was registered under the parentID: ${parentID}`)
            await registerItem(folder, parentID[0].cloudID);
            markedFolders.push(folder)
        } else {
            const [results] = await query(`SELECT modifiedDate
                                           from folders
                                           WHERE path = "${folder.path}"`);
            const dbModifiedDate = new Date(results.modifiedDate);
            const localModifiedDate = new Date(folder.modifiedDate);

            if (localModifiedDate > dbModifiedDate) {
                markedFolders.push(folder)
            }

        }
    }
    return markedFolders;
};

const processFiles = async (allFiles: File[], markedFolders: Folder[]) => {
    const filteredFiles = allFiles.filter((file) => markedFolders.some(item => item.name === file.parentFolder))
    itemsLogger.info(`Looking inside the folders: ${markedFolders}`)
    for (let file of filteredFiles) {
        const parentFolderID = await query(`SELECT cloudID
                                            from folders
                                            WHERE name = "${file.parentFolder}"`);
        const results = await query(`SELECT name
                                     FROM files
                                     WHERE name = "${file.name}"`);
        const isFileRegistered = results.length > 0 && parentFolderID[0]
        if (!isFileRegistered) {
            await registerItem(file, parentFolderID[0].cloudID)
            itemsLogger.info(`Folder: ${file.name} was registered under the parentID: ${parentFolderID}`)
        } else {
            const [results] = await query(`SELECT name, cloudID, lastModifiedLocal
                                           from files
                                           WHERE path = "${file.path}"`);
            const dbModifiedDate = results.lastModifiedLocal;
            const localModifiedDate = file.modifiedDate;
            if (localModifiedDate > dbModifiedDate) {
                await query(`UPDATE files
                             SET lastModifiedLocal = "${new Date().toISOString().slice(0, 19)}",
                                 lastModifiedCloud = "${new Date().toISOString().slice(0, 19)}"
                             WHERE path = "${file.path}"`);
                await query(`UPDATE folders
                             SET modifiedDate = "${new Date().toISOString().slice(0, 19)}"
                             WHERE name = "${file.parentFolder}"`);

                file.cloudID = results.cloudID;
                await updateCloudFile(file);
                itemsLogger.info(`UPDATED THE FILE: ${file.name}`)
            }
        }
    }
}


export const startFilesSync = async (directoryFolder: string, rootFolderCloudID: string) => {
        const {folders, files} = traverseDirectory(directoryFolder)
        itemsLogger.info("these are the folders:", folders)
        itemsLogger.info("these are the files:", files)

        const markedFolders = await processFolders(folders, rootFolderCloudID)
        await processFiles(files, markedFolders)
    }
;