import * as process from "process";
import * as path from "path";
import * as fs from "fs";
import {drive} from "./googleAuth";
import {Folder} from "../types";

export async function createFolder(folder: Folder) {
    console.log(folder)
    const requestBody = {
        name: folder.name,
        'mimeType': 'application/vnd.google-apps.folder',
        parents: [process.env.ROOT_FOLDER_KEY]
    };

    try {
        const file = await drive.files.create({
            requestBody,
            fields: 'id',
        });

        console.log('Folder Id:', file.data.id);
        console.log('OI')
        return file.data.id;
    } catch (e) {
        console.log(e)
    }
}


export async function uploadFile(mimeType: string, fileName: string, folderPath: string, parentFolderId: string) {
    const filePath = path.resolve(folderPath, fileName);
    const media = {
        mimeType,
        body: fs.createReadStream(filePath)
        // mimeType: 'application/tar',
        // body: fs.createReadStream(path.resolve(__dirname, 'backup')),
    };
    try {
        const res = await drive.files.create({
            requestBody: {
                name: fileName,
                // name: 'backup',
                parents: [parentFolderId]
            },
            media: media,
            fields: 'id',
        })
        console.log(res.data.id)
        return res.data.id;
    } catch (e) {
        console.log(e)
    }
}