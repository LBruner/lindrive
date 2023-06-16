import * as path from "path";
import * as fs from "fs";
import {getFolderID, registerItem} from "./files.mysql";
import query from "../../services/mysql";
import {File, Folder, Result} from "../types";
import {itemsLogger} from "../../app";

function traverseDirectory(directory: string): Result {
    const files: File[] = [];
    const folders: Folder[] = [];

    function traverse(dir: string) {
        const entries = fs.readdirSync(dir, {withFileTypes: true});

        entries.forEach((entry) => {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(directory, fullPath);
            const stat = fs.statSync(fullPath);

            if (entry.isDirectory()) {
                const folder: Folder = {
                    name: path.basename(fullPath),
                    path: fullPath,
                    parentFolderName: path.basename(path.dirname(fullPath)),
                };

                folders.push(folder);

                traverse(fullPath);
            } else {
                const file: File = {
                    name: entry.name,
                    size: stat.size,
                    extension: path.extname(entry.name),
                    path: fullPath,
                    modified: new Date(stat.mtime).toISOString().slice(0, 19),
                    parentFolder: path.basename(path.dirname(fullPath)),
                };

                files.push(file);
            }
        });
    }

    const rootFolder: Folder = {
        name: path.basename(directory),
        path: directory,
        parentFolderName: path.basename(path.dirname(directory)),
    };

    folders.push(rootFolder);
    traverse(directory);

    return {files, folders};
}

const processFolders = async (folders: Folder[], rootFolderCloudID: string) => {
    let rootFolderID = await getFolderID(folders[0].path);

    if (!rootFolderID) {
        rootFolderID = await registerItem(folders[0], rootFolderCloudID);
    }

    for (let subFolder of folders) {
        const folderIsRegistered = await getFolderID(subFolder.path);

        if (!folderIsRegistered) {
            const parentID = await query(`SELECT cloudID
                                          FROM folders
                                          WHERE name = "${subFolder.parentFolderName}"`)
            itemsLogger.info(`Folder: ${subFolder.name} was registered under the parentID: ${parentID}`)
            const subFolderID = await registerItem(subFolder, parentID[0].cloudID);
        } else {
        }
    }
};

const processFiles = async (files: File[]) => {
    for (let file of files) {
        const parentFolderID = await query(`SELECT cloudID
                                            from folders
                                            WHERE name = "${file.parentFolder}"`);
        const fileIsRegistered = await query(`SELECT name
                                              FROM files
                                              WHERE name = "${file.name}"`);
        if (fileIsRegistered.length === 0 && parentFolderID[0]) {
            await registerItem(file, parentFolderID[0].cloudID)
            itemsLogger.info(`Folder: ${file.name} was registered under the parentID: ${parentFolderID}`)
        }
    }
}

export const startFilesSync = async (directoryFolder: string, rootFolderCloudID: string) => {
        const {folders, files} = traverseDirectory(directoryFolder)
        itemsLogger.info("these are the folders:", folders)
        itemsLogger.info("these are the files:", files)


        await processFolders(folders, rootFolderCloudID)
        await processFiles(files)
    }
;