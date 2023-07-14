import {RequestHandler} from "express";
import {authUrl} from "../models/googleDrive/googleAuth";
import {UserManager} from "../models/user/UserManager";

export const authenticateCallback: RequestHandler = async (req, res) => {
    const code = req.query.code;

    try {
        const userInstance = await UserManager.getInstance();
        await userInstance.setUserCredentials(code);
        res.cookie('isAuthenticated', 'true')
        res.redirect('http://localhost:3000/drive/settings')
    } catch (error) {
        console.error('Erro ao obter o token de acesso:', error);
        res.redirect('/login');
    }
}

export const redirectGoogleLogin: RequestHandler = async (req, res) => {
    res.json({authUrl: authUrl});
}