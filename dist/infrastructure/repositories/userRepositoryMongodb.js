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
exports.MongoDBUserRepository = void 0;
const mongodb_1 = require("mongodb");
const User_1 = require("../../domain/User");
class MongoDBUserRepository {
    constructor(database) {
        this.collection = database.collection('users');
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.collection.findOne({ email });
            if (!userData) {
                return null;
            }
            return new User_1.User(userData._id, userData.name, userData.email, userData.password);
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIdObj = new mongodb_1.ObjectId(userId);
            const userData = yield this.collection.findOne({ _id: userIdObj });
            if (!userData) {
                return null;
            }
            return new User_1.User(userData._id, userData.name, userData.email, userData.password);
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = {
                name: user.name,
                email: user.email,
                password: user.password,
            };
            const result = yield this.collection.insertOne(userData);
            return new User_1.User(result.insertedId, user.name, user.email, user.password);
        });
    }
}
exports.MongoDBUserRepository = MongoDBUserRepository;
