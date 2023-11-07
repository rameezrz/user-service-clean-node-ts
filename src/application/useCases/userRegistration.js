const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt');
const User = require('../../domain/User')
const {generateToken} = require('../../utils/jwtUtils')

class UserRegistration {
    constructor(userRepository){
        this.userRepository = userRepository
    }

    async registerUser(name, email,password){
        const existingUser = await this.userRepository.findByEmail(email)
        if(existingUser){
            throw new Error('Email is already Registered')
        }

        const hashedPassword = await this.hashPassword(password);

        const userId = uuidv4();
        const newUser = new User(userId, name, email, hashedPassword);
        const savedUser = await this.userRepository.save(newUser)

        const payload = {userId:savedUser.id}
        const token = generateToken(payload)

        return {user: savedUser, token}
    }

    async hashPassword(password) {
        try {
            const saltRounds = 10; 
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserRegistration