"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderHome = exports.setupRootFolder = void 0;
const UserData_1 = __importDefault(require("../models/user/UserData"));
const googleDriveAPI_1 = require("../models/googleDrive/googleDriveAPI");
const setupRootFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderName } = req.body;
    const userData = yield UserData_1.default.findOne();
    const { rootFolderId } = userData.dataValues;
    yield UserData_1.default.update({
        rootFolderName: folderName,
    }, {
        where: {}
    });
    yield (0, googleDriveAPI_1.renameFolder)(rootFolderId, folderName);
    res.send('Folder was created');
});
exports.setupRootFolder = setupRootFolder;
const renderHome = (req, res) => {
    res.render('driveHome');
};
exports.renderHome = renderHome;
