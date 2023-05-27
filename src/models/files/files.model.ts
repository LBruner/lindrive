import * as path from "path";
import {Folder} from '../types';
import * as fs from "fs";
import {updateDB} from "./files.mysql";

const folderDir = '/home/lbruner/Documents/Cursos';

function getFoldersAndFiles(directoryPath: string): Folder[] {
    const folders: Folder[] = [];

    const dirents = fs.readdirSync(directoryPath, {withFileTypes: true});

    const files = dirents
        .filter((dirent) => dirent.isFile())
        .map((dirent) => path.join(directoryPath, dirent.name));

    if (files.length > 0) {
        const rootFolder: Folder = {
            name: path.basename(directoryPath),
            path: path.dirname(directoryPath),
            parent_folder: null,
            filesLocation: files,
            filesDetails: []
        };

        folders.push(rootFolder);
    }

    const subFolders = dirents
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    for (const folderName of subFolders) {
        const folderPath = path.join(directoryPath, folderName);

        const subFolderFiles = fs.readdirSync(folderPath, {withFileTypes: true})
            .filter((dirent) => dirent.isFile())
            .map((dirent) => path.join(folderPath, dirent.name));

        const folder: Folder = {
            name: folderName,
            path: folderPath,
            filesLocation: subFolderFiles,
            parent_folder: path.basename(directoryPath),
            filesDetails: []
        };

        folders.push(folder);
    }

    for (let folder of folders) {
        for (let file of folder.filesLocation!) {
            const stats = fs.statSync(file);

            folder.filesDetails?.push({
                name: path.basename(file),
                path: file,
                size: stats.size,
                extension: path.extname(file),
                modified: stats.mtime,
            })
        }
    }
    return folders;
}

export const startFilesSync = async () => {
    const foldersAndFiles = getFoldersAndFiles(folderDir);
    await updateDB(foldersAndFiles);
};