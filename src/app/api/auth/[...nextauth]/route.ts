import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
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

        const resp = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
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
          })
        });

        const result = await resp.json();

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
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
