import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import process from "process";
import winston from 'winston';
import {Watcher} from "./models/watcher/Watcher";

const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
}));

app.use(morgan('combined'))
app.use(express.json());

export const itemsLogger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({filename: 'items.log'})
    ],
});

export const driveLogger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({filename: 'drive.log'})
    ],
});

// startFilesSync(process.env.CURSOS_DIRECTORY!, process.env.DOCUMENTS_FOLDER_KEY!)
const watcher = new Watcher(process.env.CURSOS_DIRECTORY!, process.env.DOCUMENTS_FOLDER_KEY!);

app.get('/*', (req, res) => {
    res.send("OI");
})

export default app;