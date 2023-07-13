import * as express from "express";
import {authenticateCallback, redirectGoogleLogin} from "../controllers/userController";
import {redirectAuthenticatedUser} from "../middlewares/userMiddlewares";

const router = express.Router();

router
    .get('/callback',redirectAuthenticatedUser, authenticateCallback)
    .get('/',redirectAuthenticatedUser, redirectGoogleLogin)

export default router;