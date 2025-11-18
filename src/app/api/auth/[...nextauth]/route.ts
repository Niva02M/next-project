import axios from 'axios';
import { connectToDatabase } from 'lib/mongodb';
import User from 'models/User';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    FacebookProvider({
      clientId: process.env.NEXT_FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.NEXT_FACEBOOK_CLIENT_SECRET!
    }),
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
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
        user: { label: 'User', type: 'text' }
      },
      async authorize(credentials) {
        try {
          if (credentials?.accessToken && credentials?.user) {
            const user = JSON.parse(credentials.user);
            console.log(user);
            return {
              id: user._id,
              email: user.email,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              status: user.status,
              access_token: credentials.accessToken,
              refresh_token: credentials.refreshToken,
              provider: 'credentials'
            };
          }

          if (!credentials?.email || !credentials?.password) {
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
                  password: credentials.password
                }
              }
            },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const result = resp.data;
          if (result.errors) throw new Error(result.errors[0]?.message || 'Login failed');

          const payload = result.data?.loginUser;
          if (!payload?.user) throw new Error(payload?.message || 'Invalid credentials');

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
            status: payload.user.status
          };
        } catch (error: any) {
          console.error('Login error:', error.response?.data || error.message);
          throw new Error(error.response?.data?.errors?.[0]?.message || 'Authentication failed');
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
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
            image: user.image
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
        try {
          await axios.post(`${process.env.NEXTAUTH_URL}/api/agora/create-user`, {
            userId: user.id,
            nickname: user.name,
            avatarurl: user.image || ''
          });
        } catch (err) {
          const e = err as any;
          console.error('Agora create-user failed for OAuth:', e?.response?.data || e?.message);
        }

        try {
          await axios.post(`${process.env.NEXTAUTH_URL}/api/agora/update-profile`, {
            userId: user.id,
            nickname: user.name,
            avatarurl: user.image || ''
          });
        } catch (err) {
          const e = err as any;
          console.error('Agora update-profile failed for OAuth:', e?.response?.data || e?.message);
        }
      }

      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (token.id) {
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
          token.name = `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim();
          token.image = dbUser.image;

          if (account?.provider === 'google' || account?.provider === 'facebook') {
            token.provider = dbUser.provider;
            token.status = 'verified';
            token.emailVerified = true;
          } else {
            token.provider = account?.provider || user.provider || 'credentials';
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
    }
  },
  pages: {
    signIn: '/login'
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
