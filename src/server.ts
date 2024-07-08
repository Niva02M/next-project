import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import client from '../apollo.config';
import { LOGIN_MUTATION } from 'graphql/auth';
import { ISignInResponse, ISignInResponseFormat } from 'types/api-response/auth';
import { JWT } from 'next-auth/jwt';
import { jwtDecode } from 'jwt-decode';

export interface ILoginCredential {
  email: string;
  password: string;
  deviceId?: string;
  loginFor?: string;
}
export interface IDecodedToken {
  username: string;
  sub: string;
  registrationStatus: string;
  jti: string;
}
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        deviceId: { label: 'Device ID', type: 'text', optional: true },
        accessToken: { label: 'Access Token', type: 'text', optional: true },
        refreshToken: { label: 'Refresh Token', type: 'text', optional: true },
        accessTokenExpiresIn: { label: 'Access Token Expires In', type: 'text', optional: true },
        refreshTokenExpiresIn: { label: 'Refresh Token Expires In', type: 'text', optional: true },
        user: { label: 'sSigned in user', type: 'object', optional: true },
        _id: { label: 'user id', type: 'text', optional: true }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, deviceId, accessToken, accessTokenExpiresIn, refreshTokenExpiresIn, refreshToken, _id, user } =
          credentials;
        try {
          if (accessToken && refreshToken && _id) {
            return {
              access_token: accessToken,
              refresh_token: refreshToken,
              id: _id,
              expires_at: accessTokenExpiresIn,
              refreshTokenExpiresIn,
              user
            };
          }

          const res = await client.mutate<{ loginWithEmailPassword: ISignInResponse }>({
            mutation: LOGIN_MUTATION,
            variables: {
              body: {
                email,
                password,
                deviceId
              }
            }
          });
          if (res?.data?.loginWithEmailPassword && res?.data?.loginWithEmailPassword?.token) {
            const data = res.data.loginWithEmailPassword;

            return {
              id: data.user?._id || '',
              user: data.user,
              access_token: data.token.accessToken,
              refresh_token: data.token.refreshToken,
              expires_at: data.token.accessTokenExpiresIn,
              mailVerified: data.user.status !== 'email_verification_pending'
            };
          }
          if (res.data?.loginWithEmailPassword.user.status === 'email_verification_pending') {
            return {
              id: res.data?.loginWithEmailPassword.user?._id || '',
              user: res.data?.loginWithEmailPassword.user,
              expiry: res.data?.loginWithEmailPassword.expiry,
              mailVerified: res?.data?.loginWithEmailPassword?.user.status !== 'email_verification_pending'
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    })
  ],

  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true
      }
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: false,
        sameSite: 'none',
        path: '/',
        secure: true
      }
    }
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      let registrationStatus = '';
      const userDetail = user as ISignInResponseFormat;
      if (user) {
        if (user?.access_token) {
          registrationStatus = jwtDecode<IDecodedToken>(user.access_token)?.registrationStatus;
        }
        return {
          access_token: userDetail?.access_token,
          refresh_token: userDetail?.refresh_token,
          expires_at: userDetail?.expires_at,
          expiry: userDetail?.expiry,
          user: { ...userDetail.user, registrationStatus }
        };
      }

      return token;
    },

    async session({ session, token, user }) {
      session.user = token;

      // Send properties to the client, like an access_token from a provider.

      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
