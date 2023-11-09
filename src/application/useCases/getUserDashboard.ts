import UserRepository from '../repositories/userRepository'; // Replace with the correct import path
import User from '../../domain/User';

class GetUserDashboard {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<{ user: User }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return { user };
  }
}

export default GetUserDashboard;
