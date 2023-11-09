"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(payload) {
    const secretKey = process.env.JWT_SECRET || '';
    // Set the token expiration time (e.g., 1 day).
    const expiresIn = '1d';
    // Generate the token.
    const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn });
    return token;
}
exports.generateToken = generateToken;
