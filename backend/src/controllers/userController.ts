import {RequestHandler} from "express";
import {authUrl} from "../models/googleDrive/googleAuth";
import {UserManager} from "../models/user/UserManager";

export const authenticateCallback: RequestHandler = async (req, res) => {
    const code = req.query.code;

    try {
        await UserManager.getInstance().setUserCredentials(code);
        res.render('initialSettings')
    } catch (error) {
        console.error('Erro ao obter o token de acesso:', error);
        res.redirect('/login');
    }
}

export const redirectGoogleLogin: RequestHandler = async (req, res) => {
    res.redirect(authUrl);
}