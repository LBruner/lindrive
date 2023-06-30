import "dotenv/config";
import * as http from "http";
import app from "./app.js";
import {setupDatabase} from "./db/sequelize";

const PORT = 8080;

const server = http.createServer(app);

const startServer = async () => {
    await setupDatabase();

    server.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}...`);
    })
}

startServer()