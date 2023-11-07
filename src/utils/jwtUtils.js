const jwt = require('jsonwebtoken');

function generateToken(payload) {
    
    const secretKey = 'your-secret-key'; 
  
    // Set the token expiration time (e.g., 1 day).
    const expiresIn = '1d';
  
    // Generate the token.
    const token = jwt.sign(payload, secretKey, { expiresIn });
  
    return token;
}

module.exports = { generateToken };