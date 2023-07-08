import process from "process";

const {google} = require("googleapis");

export const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'http://localhost:8080/auth/google/callback',
)

const scopes = ['https://www.googleapis.com/auth/drive'];
export const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
});

export const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})
