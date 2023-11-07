const jwt = require('jsonwebtoken');

async function decodeJwt(token, secret) {
  try {
    // Verify and decode the JWT token
    const decoded = await jwt.verify(token, secret);
    
    return decoded;
  } catch (error) {
    // Token is invalid or has expired
    return null;
  }
}



async function ensureAuthenticated(req, res, next) {
    // Check if a valid JWT token is present in the request (you need to implement this)
    const token = req.cookies.jwtToken; // Assuming you store the token in a cookie

    if (token) {
        // If the token is valid, you can decode it and attach user data to the request
        const user = await decodeJwt(token,'your-secret-key'); // You should implement a function to decode the token

        if (user) {
            req.user = user; // Attach user data to the request
            return next(); // User is authenticated
        }
    }

    // If no valid token is present, redirect the user to the login page
    res.status(404).json({message:"Authentication failed", isLoggedIn: false})
}

module.exports = {ensureAuthenticated}