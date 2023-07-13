"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driveLogger = exports.itemsLogger = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080',
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
exports.itemsLogger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.simple(),
    transports: [
        new winston_1.default.transports.File({ filename: 'items.log' })
    ],
});
exports.driveLogger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.simple(),
    transports: [
        new winston_1.default.transports.File({ filename: 'drive.log' })
    ],
});
// const watcher= new NodeTracker(process.env.CURSOS_DIRECTORY!, process.env.DOCUMENTS_FOLDER_KEY!)
app.get('/*', (req, res) => {
    res.send("OI");
});
exports.default = app;
