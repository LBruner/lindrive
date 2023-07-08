import "dotenv/config";
import * as http from "http";
import app from "./app.js";
import {setupDatabase} from "./db/sequelize";
import {UserManager} from "./models/user/UserManager";

const PORT = 8080;

const server = http.createServer(app);
const startServer = async () => {
    await setupDatabase();
    //TODO fix this
    UserManager.getInstance()
    server.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}...`);
    })
}

startServer()