import * as path from "path";
import * as fs from "fs";
import {drive} from "./googleAuth";
import {File, Folder} from "../types";
import mime from "mime";
import {driveLogger} from "../../app";

export const uploadFile = async (file: File, parentFolder: string) => {
    const filePath = path.resolve(file.path);
    const media = {
        mimeType: mime.lookup(file.extension),
        body: fs.createReadStream(filePath)
    };

    try {
        const res = await drive.files.create({
            requestBody: {
                name: file.name,
                parents: [parentFolder]
            },
            media: media,
            fields: 'id',
        });
        driveLogger.info(`File: ${file.name} uploaded to Google Drive with id: ${res.data.id}`);
        return res.data.id;
    } catch (e) {
        console.log(e);
    }
};

export const createDriveFolder = async (folder: Folder, parentFolder: string) => {
    const requestBody = {
        name: folder.name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolder]
    };

    try {
        const file = await drive.files.create({
            requestBody,
            fields: 'id',
        });
        driveLogger.info(`Folder ${folder.name} was created with id: ${file.data.id}`);
        return file.data.id;
    } catch (e) {
        console.log(e);
    }
};

export const uploadItem = async (item: Folder | File, parentFolder: string) => {
    if ('extension' in item) {
        return uploadFile(item, parentFolder);
    } else {
        return createDriveFolder(item, parentFolder);
    }
};

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