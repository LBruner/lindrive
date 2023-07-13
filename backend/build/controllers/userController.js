"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectGoogleLogin = exports.authenticateCallback = void 0;
const googleAuth_1 = require("../models/googleDrive/googleAuth");
const UserManager_1 = require("../models/user/UserManager");
const authenticateCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try {
        yield UserManager_1.UserManager.getInstance().setUserCredentials(code);
        res.render('initialSettings');
    }
    catch (error) {
        console.error('Erro ao obter o token de acesso:', error);
        res.redirect('/login');
    }
});
exports.authenticateCallback = authenticateCallback;
const redirectGoogleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect(googleAuth_1.authUrl);
});
exports.redirectGoogleLogin = redirectGoogleLogin;
