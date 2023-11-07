const express = require("express");

class UserController {
  constructor(userRegistration, userLogin) {
    this.userRegistration = userRegistration;
    this.userLogin = userLogin;
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
      console.log(req.user);
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
  
}

module.exports = UserController;
