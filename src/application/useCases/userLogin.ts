import bcrypt from 'bcrypt';
import UserRepository from '../repositories/userRepository'; // Replace with the correct import path
import JwtService from '../services/jwtService'; // Replace with the correct import path
import User from '../../domain/User';

class UserLogin {
  private userRepository: UserRepository;
  private jwtService: JwtService;

  constructor(userRepository: UserRepository, jwtService: JwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const result = await this.verifyPassword(password, user.password);

    if (!result) {
      throw new Error('Email or Password is incorrect');
    }

    const payload = { userId: user.id };
    const token = this.jwtService.signToken(payload);

    return {
      user,
      token,
    };
  }

  private async verifyPassword(password: string, dbPassword: string): Promise<boolean> {
    const result = await bcrypt.compare(password, dbPassword);
    return result;
  }
}

export default UserLogin;
