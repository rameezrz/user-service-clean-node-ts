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
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserLogin {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            const result = yield this.verifyPassword(password, user.password);
            if (!result) {
                throw new Error('Email or Password is incorrect');
            }
            const payload = { userId: user.id };
            const token = this.jwtService.signToken(payload);
            return {
                user,
                token,
            };
        });
    }
    verifyPassword(password, dbPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield bcrypt_1.default.compare(password, dbPassword);
            return result;
        });
    }
}
exports.default = UserLogin;
