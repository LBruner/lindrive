"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drive = exports.authUrl = exports.oauth2Client = void 0;
const process_1 = __importDefault(require("process"));
const { google } = require("googleapis");
exports.oauth2Client = new google.auth.OAuth2(process_1.default.env.CLIENT_ID, process_1.default.env.CLIENT_SECRET, 'http://localhost:8080/auth/google/callback');
const scopes = ['https://www.googleapis.com/auth/drive'];
exports.authUrl = exports.oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
});
exports.drive = google.drive({
    version: 'v3',
    auth: exports.oauth2Client
});
