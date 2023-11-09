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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const userRegistration_1 = __importDefault(require("../application/useCases/userRegistration"));
const userLogin_1 = __importDefault(require("../application/useCases/userLogin"));
const userRepositoryMongodb_1 = require("./repositories/userRepositoryMongodb");
const userController_1 = __importDefault(require("./controllers/userController"));
const jwtService_1 = __importDefault(require("../application/services/jwtService"));
const isAuth_1 = require("./middlewares/isAuth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // Allow cookies
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const url = process.env.MONGO_URI || '';
const client = new mongodb_1.MongoClient(url);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const database = client.db(process.env.DB_NAME);
        const userRepository = new userRepositoryMongodb_1.MongoDBUserRepository(database);
        const userRegistration = new userRegistration_1.default(userRepository);
        const userLogin = new userLogin_1.default(userRepository, new jwtService_1.default(process.env.JWT_SECRET || ''));
        const userController = new userController_1.default(userRegistration, userLogin);
        app.post('/register', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            userController.registerUser(req, res, next);
        }));
        app.post('/login', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            userController.loginUser(req, res, next);
        }));
        app.get('/', isAuth_1.ensureAuthenticated, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            userController.getUserDashboard(req, res, next);
        }));
        app.delete('/logout', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            userController.logoutUser(req, res, next);
        }));
        app.use((err, req, res, next) => {
            res.status(404).json({ error: 'something went wrong', message: err.message });
        });
        app.listen(PORT, () => {
            console.log('Server is running');
        });
    });
}
startServer();
