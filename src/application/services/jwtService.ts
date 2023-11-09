import jwt from 'jsonwebtoken';

class JwtService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  signToken(data: Record<string, any>): string {
    return jwt.sign(data, this.secretKey, { expiresIn: '1h' });
  }

  verifyToken(token: string): Record<string, any> {
    return jwt.verify(token, this.secretKey) as Record<string, any>;
  }
}

export default JwtService;
