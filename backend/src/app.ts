import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import driveRoutes from './routes/driveRoutes';

const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
}));

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('*', (req, res) => {
    res.render('initialSettings');
})

// app.use('/auth/google', userRoutes);
// app.use('/drive', driveRoutes);
//
// app.get('/login', (req, res) => {
//     res.send('Failed to login!')
// })
//
// app.get('/*', (req,res) =>{
//     res.send(`Page not found.`)
//TODO: add not found route

export default app;