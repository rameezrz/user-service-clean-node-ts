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
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../../domain/User"));
const jwtUtils_1 = require("../../utils/jwtUtils");
class UserRegistration {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    registerUser(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('Email is already Registered');
            }
            const hashedPassword = yield this.hashPassword(password);
            const userId = (0, uuid_1.v4)();
            const newUser = new User_1.default(userId, name, email, hashedPassword);
            const savedUser = yield this.userRepository.save(newUser);
            const payload = { userId: savedUser.id };
            const token = (0, jwtUtils_1.generateToken)(payload);
            return { user: savedUser, token };
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                return hashedPassword;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserRegistration;
