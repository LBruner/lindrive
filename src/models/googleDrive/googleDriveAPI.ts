import * as fs from "fs";
import {drive} from "./googleAuth";
import mime from "mime";
import {driveLogger} from "../../app";
import {FileUpdateData, FileUploadData} from "./types";


export const uploadFile = async (fileData: FileUploadData) => {
    const {filePath, fileParentCloudID, fileExtension, fileName} = fileData;
    const media = {
        mimeType: mime.lookup(fileExtension),
        body: fs.createReadStream(filePath)
    };

    try {
        const res = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [fileParentCloudID]
            },
            media: media,
            fields: 'id',
        });
        console.log("UPLOADED", res.data.id)
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


export const updateCloudFile = async (fileData: FileUpdateData) => {
    const {fileID, fileName, filePath, fileExtension} = fileData;
    try {
        await drive.files.update({
            fileId: fileID,
            media: {
                mimeType: mime.lookup(fileExtension),
                body: fs.createReadStream(filePath),
            }
        })
        console.log(`File: ${fileName} updated on Google Drive with id: ${fileID}`)
    } catch (e) {
        console.log(`File: ${fileName} could not be updated.
        Error: ${e}`)
    }
}