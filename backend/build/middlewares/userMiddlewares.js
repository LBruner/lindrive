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
exports.redirectAuthenticatedUser = exports.isUserAuthenticated = void 0;
const UserManager_1 = require("../models/user/UserManager");
const isUserAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isAuthenticated = yield UserManager_1.UserManager.getInstance().isAuthenticated();
    if (!isAuthenticated) {
        res.redirect('/auth/google');
    }
    else {
        next();
    }
});
exports.isUserAuthenticated = isUserAuthenticated;
const redirectAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isAuthenticated = yield UserManager_1.UserManager.getInstance().isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
        res.redirect('/drive/home');
    }
    else {
        next();
    }
});
exports.redirectAuthenticatedUser = redirectAuthenticatedUser;
