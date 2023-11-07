const express = require('express')
const cookieParser = require('cookie-parser')
const MongoClient = require('mongodb').MongoClient


const UserRegistration = require('../application/useCases/userRegistration')
const UserLogin = require('../application/useCases/userLogin')
// const GetUserDashboard = require('../application/useCases/getUserDashboard')
const MongoDBUserRepository = require('../infrastructure/repositories/userRepositoryMongodb')
const UserController = require('../infrastructure/controllers/userController')
const JwtService = require('../application/services/jwtService');

const {ensureAuthenticated} = require('../infrastructure/middlewares/isAuth')

const app = express()
const PORT = 4000

app.use(express.json())
app.use(cookieParser())

const url = 'mongodb+srv://rameez007rz:rameez007@ecommicroservice.udvvcip.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(url)

async function startServer() {
    await client.connect();
    const database = client.db('auth_service');

    const userRepository = new MongoDBUserRepository(database);
    const userRegistration = new UserRegistration(userRepository);
    const userLogin = new UserLogin(userRepository, new JwtService('your-secret-key'));
    // const getUserDashboard = new GetUserDashboard(userRepository)
    const userController = new UserController(userRegistration, userLogin);

    app.post('/register', userController.registerUser.bind(userController));
    app.post('/login', userController.loginUser.bind(userController));
    app.get('/',ensureAuthenticated, userController.getUserDashboard);

    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ error: 'something went wrong', message: err.message });
    });

    app.listen(PORT, () => {
        console.log("Server is running");
    });
}


startServer()