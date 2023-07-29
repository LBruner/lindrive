import * as fs from "fs";
import {drive} from "./googleAuth";
import mime from "mime";
import {FileUpdateData, FileUploadData} from "./types";


export const uploadFile = async (fileData: FileUploadData) => {
    const {filePath, fileParentCloudID, fileExtension, fileName} = fileData;
    const media = {
        mimeType: mime.getType(fileExtension),
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

export const createDriveFolder = async (folderName: string, parentFolder: string | null) => {
    let requestBody = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentFolder) { // @ts-ignore
        requestBody.parents = [parentFolder]
    }

    try {
        const file = await drive.files.create({
            requestBody,
            fields: 'id',
        });
        console.log(`Created folder: ${folderName}`)
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
                mimeType: mime.getType(fileExtension),
                body: fs.createReadStream(filePath),
            }
        })
        console.log(`File: ${fileName} updated on Google Drive with id: ${fileID}`)
    } catch (e) {
        console.log(`File: ${fileName} could not be updated.
        Error: ${e}`)
    }
}

export const renameFolder = async (folderId: string, newName: string) => {
    try {
        const response = await drive.files.update({
            fileId: folderId,
            resource: {
                name: newName
            }
        });
    } catch (e) {
        console.log(e)
    }
}

export const deleteCloudFile = async (itemId: string) => {
    try {
        await drive.files.delete({fileId: itemId});
        console.log('Item deleted successfully.');
    } catch (error: any) {
        console.error('Error deleting item:', error.message);
    }
}