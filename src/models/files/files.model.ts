import * as path from "path";
import {File, Folder} from '../types';
import * as fs from "fs";
import {getFolderID} from "./files.mysql";
import query from "../../services/mysql";
import {createDriveFolder, uploadFile} from "../googleDrive/googleDriveAPI";

function getFolders(folderPath: string): Folder {
    const folderName = path.basename(folderPath);
    const folderContents = fs.readdirSync(folderPath);

    const folders: Folder[] = [];

    for (const item of folderContents) {
        const itemPath = path.join(folderPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            const subFolder = getFolders(itemPath);
            folders.push(subFolder);
        }
    }

    return {
        name: folderName,
        path: folderPath,
        parentFolderName: path.basename(path.dirname(folderPath)),
        folders: folders,
    };
}

//TODO Refactor
function getFiles(filePath: string): File[] {
    path.basename(filePath);
    const folderContents = fs.readdirSync(filePath);

    const files: File[] = [];

    for (const item of folderContents) {
        const itemPath = path.join(filePath, item);
        const stats = fs.statSync(itemPath);

        if (!stats.isDirectory()) {
            files.push({
                name: item,
                size: stats.size,
                path: itemPath,
                extension: path.extname(item),
                modified: new Date(stats.mtime).toISOString().slice(0, 19)
            })
        }
    }

    return files;
}

const registerFolder = async (folder: Folder, parentFolderID: string) => {
    const cloudID = await createDriveFolder(folder, parentFolderID)
    console.log(`FILE: ${folder.name} was uploaded to parent: ${parentFolderID} and Has ID: ${cloudID}`)
    await query(`INSERT INTO folders (name, path, cloudID)
                 VALUES ("${folder.name}", "${folder.path}", "${cloudID}")`);
    console.log(`Registered the folder: ${folder.name}`);
    return parentFolderID;
};

const registerFile = async (file: File, parentFolderID: string) => {
    const {name, extension, path, size, modified} = file;
    const cloudID = await uploadFile(file, parentFolderID)
    console.log(`FILE: ${file.name} was uploaded to parent: ${parentFolderID} and Has ID: ${cloudID}`)
    await query(`INSERT INTO files (name, extension, path, cloud_id, last_modified_local, last_modified_cloud,
                                    size) VALUE ("${name}", "${extension}", "${path}", "${cloudID}", "${modified}",
                                                 "${modified}", "${size}")`)
    return parentFolderID;
};

export const startFilesSync = async (directoryFolder: string, rootFolderCloudID: string) => {


    const folders = await getFolders(directoryFolder);

    const processFolders = async (rootFolder: Folder) => {
        let rootFolderID = await getFolderID(folders.path);

        if (!rootFolderID) {
            rootFolderID = await registerFolder(folders, rootFolderCloudID);
        }

        for (let subFolder of rootFolder.folders) {
            const folderIsRegistered = await getFolderID(subFolder.path);

            if (!folderIsRegistered) {
                const parentID = await query(`SELECT cloudID
                                              FROM folders
                                              WHERE name = "${subFolder.parentFolderName}"`)
                console.log(subFolder.name)
                console.log(parentID)
                const subFolderID = await registerFolder(subFolder, parentID[0].cloudID);
                await processFolders(subFolder);
                console.log(`folder ${subFolder.name} has parent id: "${subFolderID}"`)
            } else {
                await processFolders(subFolder);
            }
        }
    };

    const processFiles = async () => {
        const folders = await query(`SELECT path
                                     from folders`);
        for (let folder of folders) {
            const parentFolderID = await getFolderID(folder.path);
            const files = getFiles(folder.path);
            for (const file of files) {
                const fileIsRegistered = await query(`SELECT name
                                                      FROM files
                                                      WHERE name = "${file.name}"`);
                if (fileIsRegistered.length === 0)
                    await registerFile(file, parentFolderID)
            }
        }
    }
    await processFolders(folders)
    await processFiles()
};