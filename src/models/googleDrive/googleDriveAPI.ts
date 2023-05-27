import * as process from "process";
import * as path from "path";
import * as fs from "fs";
import {drive} from "./googleAuth";
import {File, Folder} from "../types";
import mime from "mime";

export async function createFolder(folder: Folder) {
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
        return file.data.id;
    } catch (e) {
        console.log(e)
    }
}


export async function uploadFile(file: File, parentFolderId: string) {
    const filePath = path.resolve(file.path);
    const media = {
        mimeType: mime.lookup(file.extension),
        body: fs.createReadStream(filePath)
    };
    try {
        const res = await drive.files.create({
            requestBody: {
                name: file.name,
                parents: [parentFolderId]
            },
            media: media,
            fields: 'id',
        })
        console.log('fileID:', res.data.id)
        return res.data.id;
    } catch (e) {
        console.log(e)
    }
}

export const updateCloudFile = (file: File) => {
    const filePath = path.resolve(file.path);
    drive.files.update({
        fileId: file.cloud_id,
        media: {
            mimeType: mime.lookup(file.extension),
            body: fs.createReadStream(filePath),
        }
    })
}