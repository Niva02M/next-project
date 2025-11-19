import axios from 'axios';
import { connectToDatabase } from 'lib/mongodb';
import User from 'models/User';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

type UserStatus =
  | 'email_verification_pending'
  | 'email_verified'
  | 'password_set'
  | 'password_set_pending';
interface IUserPops {
  _id: string;
  email: string;
  status: UserStatus;
}
export interface ILoginCredential {
  email: string;
  password: string;
  deviceId?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresIn?: string;
  user: string | IUserPops;
  _id?: string;
}

export interface IPhoneLoginCredential {
  phoneNumber: string;
  dialCode: string;
  deviceId: string;
}

export interface IPhoneLoginVerifyCredential extends IPhoneLoginCredential {
  verificationCode: string;
  expiryTime?: number;
}
const handleProvider = async (account: any, user: any) => {
  await connectToDatabase();

  const existingUser = await User.findOne({ email: user.email });
  if (!existingUser) {
    const [firstName, ...lastNameParts] = (user.name || '').split(' ');
    const newUser = await User.create({
      firstName,
      lastName: lastNameParts.join(' '),
      email: user.email,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      status: 'verified',
      emailVerified: true,
      image: user.image,
    });

    user.id = newUser.id.toString();
    user.status = 'verified';
    user.emailVerified = true;
  } else {
    existingUser.provider = account.provider;
    existingUser.providerAccountId = account.providerAccountId;
    existingUser.status = 'verified';
    existingUser.emailVerified = true;
    await existingUser.save();

    user.id = existingUser.id.toString();
    user.status = 'verified';
    user.emailVerified = true;
  }

  try {
    await axios.post(`${process.env.NEXTAUTH_URL}/api/agora/create-user`, {
      userId: user.id,
      nickname: user.name,
      avatarurl: user.image || '',
    });
  } catch (err: any) {
    console.error(
      'Agora create-user failed for OAuth:',
      err.response?.data || err.message,
    );
  }

  try {
    await axios.post(`${process.env.NEXTAUTH_URL}/api/agora/update-profile`, {
      userId: user.id,
      nickname: user.name,
      avatarurl: user.image || '',
    });
  } catch (err: any) {
    console.error(
      'Agora update-profile failed for OAuth:',
      err.response?.data || err.message,
    );
  }

  return user;
};

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    FacebookProvider({
      clientId: process.env.NEXT_FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.NEXT_FACEBOOK_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        accessToken: { label: 'Access Token', type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
        user: { label: 'User', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        if (credentials.accessToken && credentials.user) {
          const user = JSON.parse(credentials.user);
          return {
            id: user._id,
            email: user.email,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            status: user.status,
            access_token: credentials.accessToken,
            refresh_token: credentials.refreshToken,
            provider: 'credentials',
            emailVerified: true,
          };
        }

        if (!credentials.email || !credentials.password) {
          throw new Error('Missing credentials');
        }

        const resp = await axios.post(
          `${process.env.NEXTAUTH_URL || ''}/api/graphql`,
          {
            query: `
              mutation loginUser($body: LoginInput!) {
                loginUser(body: $body) {
                  message
                  user {
                    _id
                    firstName
                    lastName
                    email
                    provider
                    status
                  }
                }
              }
            `,
            variables: {
              body: {
                email: credentials.email,
                password: credentials.password,
              },
            },
          },
          { headers: { 'Content-Type': 'application/json' } },
        );

        const result = resp.data;
        if (result.errors)
          throw new Error(result.errors[0]?.message || 'Login failed');

        const payload = result.data?.loginUser;
        if (!payload?.user)
          throw new Error(payload?.message || 'Invalid credentials');
        if (payload.user.status !== 'verified')
          throw new Error('Please verify your email before logging in.');

        return {
          id: payload.user._id,
          firstName: payload.user.firstName || '',
          lastName: payload.user.lastName || '',
          name: `${payload.user.firstName || ''} ${payload.user.lastName || ''}`.trim(),
          email: payload.user.email,
          provider: payload.user.provider || 'credentials',
          status: payload.user.status,
          emailVerified: true,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        await handleProvider(account, user);
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update' && session) {
        return { ...token, ...session.user };
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.name = user.name;
        token.image = user.image;
        token.provider = user.provider;
        token.status = user.status;
        token.emailVerified = Boolean(user.emailVerified);
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        name: token.name as string,
        image: token.image as string,
        provider: token.provider as string,
        status: token.status as string,
        emailVerified: token.emailVerified as boolean,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('google') || url.includes('facebook'))
        return `${baseUrl}/dashboard`;
      return url.startsWith(baseUrl) ? url : `${baseUrl}${url}`;
    },
  },

  pages: {
    signIn: '/login',
  },
};
