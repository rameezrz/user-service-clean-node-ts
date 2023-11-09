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
class UserController {
    constructor(userRegistration, userLogin, userLogout) {
        this.userRegistration = userRegistration;
        this.userLogin = userLogin;
        this.userLogout = userLogout;
    }
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            try {
                const result = yield this.userRegistration.registerUser(name, email, password);
                const { user, token } = result;
                delete user.password;
                res.cookie('user', user);
                res.cookie('jwtToken', token, { httpOnly: false });
                res.json({ message: 'User Created successfully', isLoggedIn: true, user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield this.userLogin.loginUser(email, password);
                const { user, token } = result;
                delete user.password;
                res.cookie('user', user);
                res.cookie('jwtToken', token, { httpOnly: false });
                res.json({ message: 'User Logged in successfully', isLoggedIn: true, user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserDashboard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.cookies.user;
                console.log(user);
                res.json({ message: 'User Dashboard', user });
            }
            catch (error) {
                console.error('Error in getUserDashboard:', error);
                next(error);
            }
        });
    }
    logoutUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Clear user-related cookies or tokens on the server
                res.clearCookie('user'); // Clear the user cookie
                res.clearCookie('jwtToken'); // Clear the authentication token cookie
                console.log('cleared successfully');
                res.json({ message: 'User logged out successfully' });
            }
            catch (error) {
                console.error('Error in logoutUser:', error);
                next(error);
            }
        });
    }
}
exports.default = UserController;
