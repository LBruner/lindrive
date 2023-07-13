"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drive = void 0;
const process_1 = __importDefault(require("process"));
const { google } = require("googleapis");
const oauth2Client = new google.auth.OAuth2(process_1.default.env.CLIENT_ID, process_1.default.env.CLIENT_SECRET, process_1.default.env.REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: process_1.default.env.REFRESH_TOKEN });
exports.drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});
