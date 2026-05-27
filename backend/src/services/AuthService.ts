import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-urfig';
  private static readonly JWT_EXPIRES_IN = '7d';

  static async register(userData: Partial<IUser>) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new Error('Email already in use');

    const user = new User(userData);
    await user.save();
    
    return this.generateTokenResponse(user);
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');

    return this.generateTokenResponse(user);
  }

  private static generateTokenResponse(user: IUser) {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}
迫