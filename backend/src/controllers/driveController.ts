import {RequestHandler} from "express";
import UserData from "../models/user/UserData";
import {renameFolder} from "../models/googleDrive/googleDriveAPI";

export const setupRootFolder: RequestHandler = async (req, res) => {
    const {folderName} = req.body;

    const userData = await UserData.findOne();
    const {rootFolderId} = userData!.dataValues;

    await UserData.update({
        rootFolderName: folderName,
    }, {
        where: {}
    })
    await renameFolder(rootFolderId!, folderName)

    res.send('Folder was created')
}

export const renderHome: RequestHandler = (req, res) => {
    res.redirect('http://localhost:3000/home')
}

