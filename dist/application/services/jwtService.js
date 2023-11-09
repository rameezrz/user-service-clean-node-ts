"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtService {
    constructor(secretKey) {
        this.secretKey = secretKey;
    }
    signToken(data) {
        return jsonwebtoken_1.default.sign(data, this.secretKey, { expiresIn: '1h' });
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.secretKey);
    }
}
exports.default = JwtService;
