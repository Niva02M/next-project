import axios from 'axios';
import { connectToDatabase } from 'lib/mongodb';
import User from 'models/User';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
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
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );

          const result = resp.data;

          if (result.errors) {
            throw new Error(result.errors[0]?.message || 'Login failed');
          }

          const payload = result.data?.loginUser;
          if (!payload?.user) {
            throw new Error(payload?.message || 'Invalid credentials');
          }

          return {
            id: payload.user._id,
            name: `${payload.user.firstName || ''} ${payload.user.lastName || ''}`.trim(),
            email: payload.user.email,
            provider: payload.user.provider || 'local'
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
      await connectToDatabase();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        const [firstName, ...lastNameParts] = (user.name || '').split(' ');
        const lastName = lastNameParts.join(' ');

        await User.create({
          firstName: firstName || '',
          lastName: lastName || '',
          email: user.email,
          provider: account?.provider,
          providerAccountId: account?.providerAccountId,

          image: user.image
        });
        console.log('✅ New Google user saved:', user.email);
      } else {
        if (existingUser.provider !== account?.provider) {
          existingUser.provider = account?.provider!;
          existingUser.providerAccountId = account?.providerAccountId;
          await existingUser.save();
        }
        console.log('ℹ️ Existing user logged in:', user.email);
      }

      return true;
    },
    async jwt({ token, user }: any) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    }
  },
  pages: {
    signIn: '/login'
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
