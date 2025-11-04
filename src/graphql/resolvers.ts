import bcrypt from 'bcryptjs';
import { connectToDatabase } from 'lib/mongodb';
import User from 'models/User';

export const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL Yoga!'
  },

  Mutation: {
    async registerUser(_: any, { body }: any) {
      const { firstName, lastName, email, password, phoneNumber, deviceId } = body;

      await connectToDatabase();

      const existing = await User.findOne({ email });
      if (existing) throw new Error('Email already registered');

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        deviceId,
        status: 'email_verification_pending'
      });

      const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

      return {
        user: newUser,
        expiry: {
          expiresAt: expiryTime.toISOString(),
          expiresBy: expiryTime.getTime()
        },
        message: 'Registration successful, OTP sent to email'
      };
    },
    async loginUser(_: any, { body }: any) {
      const { email, password } = body;

      await connectToDatabase();

      const user = await User.findOne({ email });
      if (!user) {
        return {
          message: 'No user found with that email.',
          status: 'ERROR',
          code: 'USER_NOT_FOUND'
        };
      }
      if (!password || !user?.password) {
        throw new Error('Invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return {
          message: 'Invalid password.',
          status: 'ERROR',
          code: 'INVALID_CREDENTIALS'
        };
      }

      const expiryTime = new Date(Date.now() + 60 * 60 * 1000);

      const token = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        accessTokenExpiresIn: 3600,
        refreshTokenExpiresIn: 86400
      };

      return {
        message: 'Login successful',
        expiry: {
          expiresAt: expiryTime.toISOString(),
          expiresBy: expiryTime.getTime()
        },
        token,
        user
      };
    }
  }
};
