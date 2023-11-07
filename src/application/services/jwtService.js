const jwt = require('jsonwebtoken');

class JwtService {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  signToken(data) {
    return jwt.sign(data, this.secretKey, { expiresIn: '1h' });
  }

  // You can also add a verifyToken method to validate tokens
  verifyToken(token) {
    return jwt.verify(token, this.secretKey);
  }
}

module.exports = JwtService;
        