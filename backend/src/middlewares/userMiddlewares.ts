import {RequestHandler} from "express";
import {UserManager} from "../models/user/UserManager";

export const isUserAuthenticated: RequestHandler = async (req, res, next) => {
    const isAuthenticated = await UserManager.getInstance().isAuthenticated();

    if (!isAuthenticated) {
        res.redirect('/auth/google');
    } else {
        next()
    }
}

export const redirectAuthenticatedUser:RequestHandler = async (req, res, next) => {
    const isAuthenticated = await UserManager.getInstance().isAuthenticated();

    console.log(isAuthenticated)
    if(isAuthenticated){
        res.redirect('/drive/home')
    }
    else{
        next();
    }
}