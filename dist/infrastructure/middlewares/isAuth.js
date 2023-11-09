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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function decodeJwt(token, secret) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verify and decode the JWT token
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            return decoded;
        }
        catch (error) {
            // Token is invalid or has expired
            return null;
        }
    });
}
function ensureAuthenticated(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if a valid JWT token is present in the request (you need to implement this)
        const token = req.cookies.jwtToken; // Assuming you store the token in a cookie
        if (token) {
            // If the token is valid, you can decode it and attach user data to the request
            const user = yield decodeJwt(token, process.env.JWT_SECRET); // You should implement a function to decode the token
            if (user) {
                req.user = user; // Attach user data to the request
                return next(); // User is authenticated
            }
        }
        // If no valid token is present, return an unauthorized response
        res.status(401).json({ message: 'Authentication failed', isLoggedIn: false });
    });
}
exports.ensureAuthenticated = ensureAuthenticated;
