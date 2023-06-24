import * as path from "path";
import * as fs from "fs";
import {drive} from "./googleAuth";
import {File} from "../types";
import mime from "mime";
import {driveLogger} from "../../app";

type FileData = {
    filePath: string,
    fileExtension: string,
    fileParentCloudID: string,
    fileName: string,
}
export const uploadFile = async (fileData: FileData) => {
    const {filePath, fileParentCloudID, fileExtension, fileName} = fileData;
    const media = {
        mimeType: mime.lookup(fileExtension),
        body: fs.createReadStream(filePath)
    };

    try {
        const res = await drive.files.create({
            requestBody: {
                name: filePath,
                parents: [fileParentCloudID]
            },
            media: media,
            fields: 'id',
        });
        console.log("UPLOADED",res.data.id)
        // driveLogger.info(`File: ${fileName} uploaded to Google Drive with id: ${res.data.id}`);
        return res.data.id;
    } catch (e) {
        console.log(e);
    }
};

export const createDriveFolder = async (folderName: string, parentFolder: string) => {
    console.log(folderName, parentFolder)
    const requestBody = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolder]
    };

    try {
        const file = await drive.files.create({
            requestBody,
            fields: 'id',
        });
        driveLogger.info(`Folder ${folderName} was created with id: ${file.data.id}`);
        return file.data.id;
    } catch (e: any) {
        console.log(`Item could not be created! Error: ${e.message}`);
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