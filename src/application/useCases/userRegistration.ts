import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import User from '../../domain/User';
import { generateToken } from '../../utils/jwtUtils';

class UserRegistration {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already Registered');
    }

    const hashedPassword = await this.hashPassword(password);

    const userId: string = uuidv4();
    const newUser = new User(userId, name, email, hashedPassword);
    const savedUser = await this.userRepository.save(newUser);

    const payload = { userId: savedUser.id };
    const token = generateToken(payload);

    return { user: savedUser, token };
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds: number = 10;
      const hashedPassword: string = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRegistration;
