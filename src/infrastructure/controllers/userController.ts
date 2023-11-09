import { Request, Response, NextFunction } from 'express';

class UserController {
  constructor(
    private userRegistration: UserRegistration,
    private userLogin: UserLogin,
    private userLogout: UserLogout
  ) {}

  async registerUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    try {
      const result = await this.userRegistration.registerUser(
        name,
        email,
        password
      );

      const { user, token } = result;
      delete user.password;
      res.cookie('user', user);
      res.cookie('jwtToken', token, { httpOnly: false });
      res.json({ message: 'User Created successfully', isLoggedIn: true, user });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const result = await this.userLogin.loginUser(email, password);

      const { user, token } = result;
      delete user.password;
      res.cookie('user', user);
      res.cookie('jwtToken', token, { httpOnly: false });
      res.json({ message: 'User Logged in successfully', isLoggedIn: true, user });
    } catch (error) {
      next(error);
    }
  }

  async getUserDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.cookies.user as User;
      console.log(user);
      res.json({ message: 'User Dashboard', user });
    } catch (error) {
      console.error('Error in getUserDashboard:', error);
      next(error);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      // Clear user-related cookies or tokens on the server
      res.clearCookie('user'); // Clear the user cookie
      res.clearCookie('jwtToken'); // Clear the authentication token cookie
      console.log('cleared successfully');
      res.json({ message: 'User logged out successfully' });
    } catch (error) {
      console.error('Error in logoutUser:', error);
      next(error);
    }
  }
}

export default UserController;
