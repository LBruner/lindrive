import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {startFilesSync} from "./models/files/files.model";
import mime from "mime";
import {uploadFile} from "./models/googleDrive/googleDriveAPI";


const app = express();


app.use(cors({
    origin: 'http://localhost:8080',
}));

app.use(morgan('combined'))
const mimeType = mime.lookup('.md');
// uploadFile(mimeType,'Javascript.md', '/home/lbruner/Documents/Cursos', process.env.ROOT_FOLDER_KEY!)
app.use(express.json());

startFilesSync()

app.get('/*', (req, res) => {
    res.send("OI");
})


export default app;