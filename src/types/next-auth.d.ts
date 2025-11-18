import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      name?: string;
      image?: string;
      provider?: string;
      status?: string;
      emailVerified?: boolean;
      // agoraUserId?: string;
      // agoraToken: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    firstName?: string;
    lastName?: string;
    provider?: string;
    status?: string;
    emailVerified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    // email?: string;
    firstName?: string;
    lastName?: string;
    // name?: string;
    // image?: string;
    provider?: string;
    status?: string;
    emailVerified?: boolean;
  }
}
