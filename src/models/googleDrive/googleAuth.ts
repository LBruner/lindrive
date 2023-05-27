import process from "process";

const {google} = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

export const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})
