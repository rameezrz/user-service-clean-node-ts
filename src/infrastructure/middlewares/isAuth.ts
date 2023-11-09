import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

async function decodeJwt(token: string, secret: string) {
  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, secret) as { [key: string]: any };
    return decoded;
  } catch (error) {
    // Token is invalid or has expired
    return null;
  }
}

async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Check if a valid JWT token is present in the request (you need to implement this)
  const token = req.cookies.jwtToken; // Assuming you store the token in a cookie

  if (token) {
    // If the token is valid, you can decode it and attach user data to the request
    const user = await decodeJwt(token, process.env.JWT_SECRET); // You should implement a function to decode the token

    if (user) {
      req.user = user; // Attach user data to the request
      return next(); // User is authenticated
    }
  }

  // If no valid token is present, return an unauthorized response
  res.status(401).json({ message: 'Authentication failed', isLoggedIn: false });
}

export { ensureAuthenticated };
