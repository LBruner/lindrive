import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
}));

app.use(morgan('combined'))

app.use(express.json());

app.get('/*', (req, res) => {
    res.send("OI");
})


export default app;