import jwt from 'jsonwebtoken';

export class JwtService {
  private readonly secret = process.env.JWT_SECRET || 'dev-secret';
  private readonly expiresIn = '1d';

  sign(payload: { sub: string; email: string }): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  verify(token: string): unknown {
    return jwt.verify(token, this.secret);
  }
}
