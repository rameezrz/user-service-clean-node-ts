const express = require("express");

class UserController {
  constructor(userRegistration, userLogin, userLogout) {
    this.userRegistration = userRegistration;
    this.userLogin = userLogin;
    this.userLogout = userLogout
  }

  async registerUser(req, res, next) {
    const { name, email, password } = req.body;

    try {
      const result = await this.userRegistration.registerUser(
        name,
        email,
        password
      );

      const {user, token} = result
      delete user.password
      res.cookie('user',user)
      res.cookie('jwtToken',token,{httpOnly:false})
      res.json({ message: "User Created successfully", isLoggedIn: true, user });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
      const result = await this.userLogin.loginUser(email, password);

      const { user, token } = result;
      delete user.password
      res.cookie('user',user)
      res.cookie('jwtToken', token, {httpOnly: false});
      res.json({ message: "User Logged in successfully", isLoggedIn: true, user });
    } catch (error) {
      next(error);
    }
  }

  async getUserDashboard(req, res, next) {
    try {
      const user = req.cookies.user
      console.log(user);
      res.json({ message: "User Dashboard", user });
    } catch (error) {
      console.error('Error in getUserDashboard:', error);
      next(error);
    }
  }

  async logoutUser(req, res, next) {
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

module.exports = UserController;
