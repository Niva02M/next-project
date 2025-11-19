// import { authOptions } from 'app/api/auth/[...nextauth]/route';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from 'components/sendOTPEmail/sendOTPEmail';
import { GraphQLError } from 'graphql';
import { connectToDatabase } from 'lib/mongodb';
import User, { GraphQLContext } from 'models/User';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from 'server';

async function syncAgoraProfile(
  userId: string,
  nickname?: string,
  avatarurl?: string,
) {
  try {
    await axios.post(`${process.env.NEXTAUTH_URL}/api/agora/update-profile`, {
      userId,
      nickname,
      avatarurl,
    });
    console.log(`Agora profile synced for user ${userId}`);
  } catch (err: any) {
    console.error(' Agora sync failed:', err.response?.data || err.message);
  }
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) return null;
      return context.user;
    },
  },
  Mutation: {
    async registerUser(_: any, { body }: any) {
      const { firstName, lastName, email, password, phoneNumber, deviceId } =
        body;

      await connectToDatabase();

      const existing = await User.findOne({ email });
      if (existing) throw new Error('Email already registered');

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        deviceId,
        status: 'email_verification_pending',
        otp,
        otpExpiry,
      });

      await sendOtpEmail(email, otp);

      return {
        user: newUser,
        expiry: {
          expiresAt: expiryTime.toISOString(),
          expiresBy: expiryTime.getTime(),
        },
        message: 'Registration successful, OTP sent to email',
      };
    },
    async verifyOtp(_: any, { body }: any) {
      const { email, otp } = body;

      await connectToDatabase();
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      if (user.status === 'verified') {
        return {
          message: 'Already verified',
          token: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            accessTokenExpiresIn: 3600,
            refreshTokenExpiresIn: 86400,
          },
          user,
        };
      }

      if (!user.otp || !user.otpExpiry)
        throw new Error('No OTP found or expired');
      if (user.otpExpiry < new Date()) throw new Error('OTP expired');

      if (user.otp !== otp) throw new Error('Invalid OTP');

      user.status = 'verified';
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      try {
        await axios.post(`${process.env.NEXTAUTH_URL}/api/agora/create-user`, {
          userId: user.id,
          nickname: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          avatarurl: user.image || '',
        });
        console.log(`Agora Chat user created for ${user.id}`);
      } catch (err: any) {
        console.error(
          'Agora create-user failed:',
          err.response?.data || err.message,
        );
      }

      await syncAgoraProfile(
        user.id.toString(),
        `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        user.image || '',
      );

      const expiryTime = new Date(Date.now() + 60 * 60 * 1000);

      const token = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        accessTokenExpiresIn: 3600,
        refreshTokenExpiresIn: 86400,
      };

      return {
        message: 'Email verified successfully',
        expiry: {
          expiresAt: expiryTime.toISOString(),
          expiresBy: expiryTime.getTime(),
        },
        token,
        user,
      };
    },
    async resendVerifyOtp(_: any, { body }: any) {
      const { email, deviceId } = body;

      await connectToDatabase();
      const user = await User.findOne({ email });

      if (!user) throw new Error('User not found');
      if (user.status === 'verified') {
        throw new Error('User already verified');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      try {
        await sendOtpEmail(email, otp);
        console.log(` Resent OTP to ${email}`);
      } catch (error) {
        console.error('Failed to send OTP:', error);
        throw new Error('Failed to send OTP email. Please try again later.');
      }

      return {
        message: 'OTP sent successfully. Please check your email.',
        expiry: {
          expiresAt: otpExpiry.toISOString(),
          expiresBy: otpExpiry.getTime(),
        },
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
          code: 'USER_NOT_FOUND',
        };
      }
      if (user.provider !== 'credentials') {
        return { message: 'Use your provider to log in', status: 'ERROR' };
      }
      if (!password || !user?.password) {
        throw new Error('Invalid credentials');
      }
      if (user.status !== 'verified') {
        throw new Error('Please verify your email before logging in.');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return {
          message: 'Invalid password.',
          status: 'ERROR',
          code: 'INVALID_CREDENTIALS',
        };
      }

      const expiryTime = new Date(Date.now() + 60 * 60 * 1000);

      const token = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        accessTokenExpiresIn: 3600,
        refreshTokenExpiresIn: 86400,
      };

      return {
        message: 'Login successful',
        expiry: {
          expiresAt: expiryTime.toISOString(),
          expiresBy: expiryTime.getTime(),
        },
        token,
        user,
      };
    },
    async updateProfile(_: any, { body }: any, context: any) {
      const session = (await getServerSession(authOptions)) as Session | null;

      if (!session || !session.user?.email) {
        throw new GraphQLError('Unauthorized');
      }

      await connectToDatabase();
      console.log('Updating user profile:', {
        email: session.user.email,
        body,
      });
      const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email },
        {
          $set: {
            firstName: body.firstName,
            lastName: body.lastName,
            image: body.image,
          },
        },
        { new: true },
      );

      if (!updatedUser) {
        throw new GraphQLError('User not found');
      }
      await syncAgoraProfile(
        updatedUser.id.toString(),
        `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim(),
        updatedUser.image || '',
      );

      return {
        message: 'Profile updated successfully',
        user: updatedUser,
      };
    },
    async changePassword(_: any, { body }: any, context: any) {
      const session = (await getServerSession(authOptions)) as Session | null;

      if (!session || !session.user?.email) {
        throw new GraphQLError('Unauthorized');
      }

      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        throw new GraphQLError(
          'Both currentPassword and newPassword are required',
        );
      }

      await connectToDatabase();

      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        throw new GraphQLError('User not found');
      }

      if (!user.password) {
        throw new GraphQLError('Password not set for this user');
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        throw new GraphQLError('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      return {
        message: 'Password changed successfully',
        user,
      };
    },
  },
};
