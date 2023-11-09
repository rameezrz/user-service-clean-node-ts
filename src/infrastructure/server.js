const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config();


const app = express()
const PORT = process.env.PORT

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // Allow cookies
  };
  
  app.use(cors(corsOptions));
  
app.use(express.json())
app.use(cookieParser())

const UserRegistration = require('../application/useCases/userRegistration')
const UserLogin = require('../application/useCases/userLogin')
const MongoDBUserRepository = require('../infrastructure/repositories/userRepositoryMongodb')
const UserController = require('../infrastructure/controllers/userController')
const JwtService = require('../application/services/jwtService');

const {ensureAuthenticated} = require('../infrastructure/middlewares/isAuth')


const url = process.env.MONGO_URI
const client = new MongoClient(url)

async function startServer() {
    await client.connect();
    const database = client.db(process.env.DB_NAME);

    const userRepository = new MongoDBUserRepository(database);
    const userRegistration = new UserRegistration(userRepository);
    const userLogin = new UserLogin(userRepository, new JwtService(process.env.JWT_SECRET));
    const userController = new UserController(userRegistration, userLogin);

    app.post('/register', userController.registerUser.bind(userController));
    app.post('/login', userController.loginUser.bind(userController));
    app.get('/',ensureAuthenticated, userController.getUserDashboard);
    app.delete('/logout', userController.logoutUser)

    app.use((err, req, res, next) => {
        res.status(404).json({ error: 'something went wrong', message: err.message });
    });

    app.listen(PORT, () => {
        console.log("Server is running");
    });
}


startServer()