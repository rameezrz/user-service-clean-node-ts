import jwt from 'jsonwebtoken';

export function generateToken(payload: object): string {
  const secretKey = process.env.JWT_SECRET || '';

  // Set the token expiration time (e.g., 1 day).
  const expiresIn = '1d';

  // Generate the token.
  const token = jwt.sign(payload, secretKey, { expiresIn });

  return token;
}
