import { Collection, Db, ObjectId } from 'mongodb';
import { User } from '../../domain/User';

class MongoDBUserRepository {
  private collection: Collection;

  constructor(database: Db) {
    this.collection = database.collection('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.collection.findOne({ email });

    if (!userData) {
      return null;
    }

    return new User(
      userData._id,
      userData.name,
      userData.email,
      userData.password
    );
  }

  async findById(userId: string): Promise<User | null> {
    const userIdObj = new ObjectId(userId);

    const userData = await this.collection.findOne({ _id: userIdObj });

    if (!userData) {
      return null;
    }

    return new User(
      userData._id,
      userData.name,
      userData.email,
      userData.password
    );
  }

  async save(user: User): Promise<User> {
    const userData = {
      name: user.name,
      email: user.email,
      password: user.password,
    };

    const result = await this.collection.insertOne(userData);
    return new User(result.insertedId, user.name, user.email, user.password);
  }
}

export { MongoDBUserRepository };
