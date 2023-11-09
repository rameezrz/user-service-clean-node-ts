const User = require("../../domain/User");
const { ObjectId } = require('mongodb');

class MongoDBUserRepository {
  constructor(database) {
    this.collection = database.collection("users");
  }

  async findByEmail(email) {
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

  async findById({user} ) {
    const userIdObj = new ObjectId(user.userId);
  
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
  


  async save(user) {
    const userData = {
      name: user.name,
      email: user.email,
      password: user.password,
    };

    const result = await this.collection.insertOne(userData);
    return new User(result.insertedId, user.name, user.email, user.password);
  }
}

module.exports = MongoDBUserRepository;
