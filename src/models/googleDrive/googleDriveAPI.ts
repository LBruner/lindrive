import * as path from "path";
import * as fs from "fs";
import {drive} from "./googleAuth";
import {File, Folder} from "../types";
import mime from "mime";

export async function createDriveFolder(folder: Folder, parentFolder?: string) {
    console.log("PARENTS ID", parentFolder, folder.name)
    const requestBody = {
        name: folder.name,
        'mimeType': 'application/vnd.google-apps.folder',
        parents: [parentFolder]
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
        console.log(`File: ${file.name} uploaded to Google Drive with id: ${res.data.id}`)
        return res.data.id;
    } catch (e) {
        console.log(e)
    }
}

export const updateCloudFile = async (file: File) => {
    const filePath = path.resolve(file.path);
    try {
        await drive.files.update({
            fileId: file.cloudID,
            media: {
                mimeType: mime.lookup(file.extension),
                body: fs.createReadStream(filePath),
            }
        })
        console.log(`File: ${file.name} updated on Google Drive with id: ${file.cloudID}`)
    } catch (e) {
        console.log(`File: ${file.name} could not be updated.
        Error: ${e}`)
    }
}