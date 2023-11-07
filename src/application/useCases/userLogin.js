const bcrypt = require('bcrypt');

class UserLogin {
    constructor(userRepository, jwtService) {
      this.userRepository = userRepository;
      this.jwtService = jwtService;
    }
  
    async loginUser(email, password) {
      const user = await this.userRepository.findByEmail(email);
  
      if (!user) {
        throw new Error('User not found');
      }

      const result = await this.verifyPassword(password,user.password)

      if(!result){
        throw new Error('Email or Password is incorrect');
      }
      
      const payload = { userId: user.id };
      const token = this.jwtService.signToken(payload);
  
      return {
        user,
        token,
      };
    }

    async verifyPassword(password,dbPassword){
        const result = await bcrypt.compare(password,dbPassword)
        return result
    }
  }
  
  module.exports = UserLogin;