import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import process from "process";
import winston from 'winston';
import {NodeWatcher} from "./models/watcher/NodeWatcher";

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


const watcher= new NodeWatcher(process.env.CURSOS_DIRECTORY!, process.env.DOCUMENTS_FOLDER_KEY!)
app.get('/*', (req, res) => {
    res.send("OI");
})

export default app;