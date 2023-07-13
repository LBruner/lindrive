"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080',
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('*', (req, res) => {
    res.render('initialSettings');
});
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
exports.default = app;
