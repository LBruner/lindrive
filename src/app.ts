import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {startFilesSync} from "./models/files/files.model";
import process from "process";


const app = express();


app.use(cors({
    origin: 'http://localhost:8080',
}));

app.use(morgan('combined'))
app.use(express.json());

const documentsDirectory = '/home/lbruner/Documents/Cursos';

startFilesSync(documentsDirectory, process.env.DOCUMENTS_FOLDER_KEY!)
// startFilesSync(screenshotsDirectory, process.env.SCREENSHOTS_FOLDER_KEY!)

app.get('/*', (req, res) => {
    res.send("OI");
})


export default app;