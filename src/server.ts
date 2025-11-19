// server.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { connectToDatabase } from 'lib/mongodb';
import User from 'models/User';
import axios from 'axios';

export interface IPhoneLoginCredential {
  phoneNumber: string;
  dialCode: string;
  deviceId: string;
}

export interface IPhoneLoginVerifyCredential extends IPhoneLoginCredential {
  verificationCode: string;
  expiryTime?: number;
}

interface IUserProps {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  provider: string;
  image?: string;
}

interface ILoginCredential {
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  user?: string | IUserProps;
}

export interface IPhoneLoginCredential {
  phoneNumber: string;
  dialCode: string;
  deviceId: string;
}

const handleOAuthSignIn = async (user: any, account: any) => {
  await connectToDatabase();

  const existingUser = await User.findOne({ email: user.email });

  if (!existingUser) {
    const [firstName, ...lastNameParts] = (user.name || '').split(' ');
    const newUser = await User.create({
      firstName,
      lastName: lastNameParts.join(' '),
      email: user.email,
      provider: account?.provider,
      providerAccountId: account?.providerAccountId,
      status: 'verified',
      emailVerified: true,
      image: user.image,
    });
    user.status = 'verified';
    user.emailVerified = true;
    user.id = newUser.id.toString();
  } else {
    existingUser.provider = account?.provider!;
    existingUser.providerAccountId = account?.providerAccountId;
    existingUser.status = 'verified';
    existingUser.emailVerified = true;
    await existingUser.save();

    user.status = 'verified';
    user.emailVerified = true;
    user.id = existingUser.id.toString();
  }

  const region = 'a16';
  const orgName = process.env.AGORA_ORG_NAME;
  const appName = process.env.AGORA_APP_NAME;
  const auth = Buffer.from(
    `${process.env.AGORA_CUSTOMER_KEY}:${process.env.AGORA_CUSTOMER_SECRET}`,
  ).toString('base64');

  // Create user in Agora
  try {
    await axios.post(
      `https://${region}.chat.agora.io/${orgName}/${appName}/users`,
      {
        username: user.id,
        nickname: user.name,
        avatarurl: user.image || '',
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(`Agora Chat user created for OAuth user ${user.id}`);
  } catch (err: any) {
    console.error(
      'Agora create-user failed for OAuth:',
      err.response?.data || err.message,
    );
  }

  // Update profile in Agora (optional)
  try {
    await axios.post(
      `https://${region}.chat.agora.io/${orgName}/${appName}/users/${user.id}/profile`,
      {
        nickname: user.name,
        avatarurl: user.image || '',
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(`Agora profile updated for OAuth user ${user.id}`);
  } catch (err: any) {
    console.error(
      'Agora update-profile failed for OAuth:',
      err.response?.data || err.message,
    );
  }

  return true;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt' as const,
  },
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
      type: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        accessToken: { label: 'Access Token', type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
        user: { label: 'User', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const creds = credentials as ILoginCredential;

          if (creds?.accessToken && creds?.user) {
            const user =
              typeof creds.user === 'string'
                ? JSON.parse(creds.user)
                : creds.user;
            return {
              id: user._id,
              email: user.email,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              status: user.status,
              access_token: creds.accessToken,
              refresh_token: creds.refreshToken,
              provider: 'credentials',
            };
          }

          if (!creds?.email || !creds?.password) {
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
                  email: creds.email,
                  password: creds.password,
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

          if (payload.user.status !== 'verified') {
            throw new Error('Please verify your email before logging in.');
          }

          return {
            id: payload.user._id,
            firstName: payload.user.firstName || '',
            lastName: payload.user.lastName || '',
            name: `${payload.user.firstName || ''} ${payload.user.lastName || ''}`.trim(),
            email: payload.user.email,
            provider: payload.user.provider || 'credentials',
            status: payload.user.status,
          };
        } catch (error: any) {
          console.error('Login error:', error.response?.data || error.message);
          throw new Error(
            error.response?.data?.errors?.[0]?.message ||
              'Authentication failed',
          );
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        return await handleOAuthSignIn(user, account);
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (token.id) {
        await connectToDatabase();
        const existing = await User.findById(token.id);
        if (!existing) {
          token.invalidated = true;
          return token;
        }
      }

      if (user) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser.id.toString();
          token.email = dbUser.email;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.name =
            `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim();
          token.image = dbUser.image;

          if (
            account?.provider === 'google' ||
            account?.provider === 'facebook'
          ) {
            token.provider = dbUser.provider;
            token.status = 'verified';
            token.emailVerified = true;
          } else {
            token.provider =
              account?.provider || user.provider || 'credentials';
            token.status = user.status;
            token.emailVerified = Boolean(user.emailVerified);
          }
          return token;
        }
      }

      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.image = session.image;
        if (session.firstName) token.firstName = session.firstName;
        if (session.lastName) token.lastName = session.lastName;
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) {
        session.user = {} as any;
      }

      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.image = token.image as string;
      session.user.provider = token.provider as string;
      session.user.status = token.status as string;
      session.user.emailVerified = (token.emailVerified as boolean) ?? true;
      session.user.image = token.image as string;

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.includes('google') || url.includes('facebook')) {
        return `${baseUrl}/dashboard`;
      }
      return url.startsWith(baseUrl) ? url : `${baseUrl}${url}`;
    },
  },

  pages: {
    signIn: '/login',
  },
};
