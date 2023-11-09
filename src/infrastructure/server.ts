import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import  UserRegistration  from '../application/useCases/userRegistration';
import  UserLogin  from '../application/useCases/userLogin';
import  {MongoDBUserRepository}  from './repositories/userRepositoryMongodb';
import  UserController  from './controllers/userController';
import  JwtService  from '../application/services/jwtService';
import { ensureAuthenticated } from './middlewares/isAuth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const url = process.env.MONGO_URI || '';
const client = new MongoClient(url);

async function startServer() {
  await client.connect();
  const database = client.db(process.env.DB_NAME);

  const userRepository = new MongoDBUserRepository(database);
  const userRegistration = new UserRegistration(userRepository);
  const userLogin = new UserLogin(userRepository, new JwtService(process.env.JWT_SECRET || ''));
  const userController = new UserController(userRegistration, userLogin);

  app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    userController.registerUser(req, res, next);
  });

  app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    userController.loginUser(req, res, next);
  });

  app.get('/', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    userController.getUserDashboard(req, res, next);
  });

  app.delete('/logout', async (req: Request, res: Response, next: NextFunction) => {
    userController.logoutUser(req, res, next);
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'something went wrong', message: err.message });
  });

  app.listen(PORT, () => {
    console.log('Server is running');
  });
}

startServer();
