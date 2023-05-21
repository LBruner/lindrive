import {execSync as exec} from "child_process";
import fs from "fs/promises";
import * as path from "path";

const folderDir = '/home/lbruner/Documents/Cursos'

const getFilesPath = async (directory: string) => {
    const files = await fs.readdir(directory);
    let filesPath: string[] = [];
    for (let file of files) {
        const info = await fs.stat(`${directory}/${file}`);

        if (info.isDirectory()) {
            const nestedFiles = await getNestedFiles(directory, file);
            filesPath.push(...nestedFiles);
            //TODO: DATABASE SUBFOLDER
            continue;
        }
        filesPath.push(`${directory}/${file}`)
    }
    console.log(filesPath)
    return filesPath;
}

const getNestedFiles = async (directory: string, file: string) => {
    const filePath = path.resolve(directory, file);
    let nestedFiles = [];
    const newFiles = await fs.readdir((`${directory}/${file}`));
    for (let file of newFiles) {
        nestedFiles.push(`${filePath}/${file}`)
    }
    return nestedFiles;
}

const getLocalInfo = (file: string) => {
    console.log(file)
    const date = exec(`find "${file}" -type f -exec date -r '{}' "+%Y-%m-%d %H:%M:%S" ';'`);
    return new Date(date.toString());
}

export const startFilesSync = async () => {
    const data = await getFilesPath(folderDir);

    if (data)
        for (let file of data) {
            console.log(getLocalInfo(file));
        }
}