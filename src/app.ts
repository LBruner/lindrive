import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {startFilesSync} from "./models/files/files.model";
import process from "process";
import winston from 'winston';

const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
}));

app.use(morgan('combined'))
app.use(express.json());

export const itemsLogger = winston.createLogger({
    level: 'info', // Set the log level
    format: winston.format.simple(), // Define the log format
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({filename: 'items.log'}), // Log to a file
    ],
});

export const driveLogger = winston.createLogger({
    level: 'info', // Set the log level
    format: winston.format.simple(), // Define the log format
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({filename: 'drive.log'}), // Log to a file
    ],
});

startFilesSync(process.env.CURSOS_DIRECTORY!, process.env.DOCUMENTS_FOLDER_KEY!)

app.get('/*', (req, res) => {
    res.send("OI");
})


export default app;