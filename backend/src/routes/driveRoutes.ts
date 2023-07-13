import * as express from "express";
import {renderHome, setupRootFolder} from "../controllers/driveController";
import {isUserAuthenticated} from "../middlewares/userMiddlewares";

const router = express.Router();

router
    .get('/home', isUserAuthenticated,renderHome)
    .post('/', isUserAuthenticated, setupRootFolder)
export default router;